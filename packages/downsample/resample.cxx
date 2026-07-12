/*=========================================================================
 *
 *  Copyright NumFOCUS
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         https://www.apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *=========================================================================*/

#include "itkPipeline.h"
#include "itkInputImage.h"
#include "itkOutputImage.h"
#include "itkSupportInputImageTypes.h"

#include "itkImage.h"
#include "itkImageBase.h"
#include "itkVectorImage.h"
#include "itkVariableLengthVector.h"

#include "itkResampleImageFilter.h"
#include "itkTransform.h"

// Generic single-transform reader (any parameterization -> abstract itk::Transform base).
#include "resampleReadInputTransform.h"

// Per-component extract/compose for the itk::VectorImage specialization.
#include "itkVectorIndexSelectionCastImageFilter.h"
#include "itkComposeImageFilter.h"

#include "itkInterpolateImageFunction.h"
#include "itkLinearInterpolateImageFunction.h"
#include "itkNearestNeighborInterpolateImageFunction.h"
#include "itkBSplineInterpolateImageFunction.h"
#include "itkGaussianInterpolateImageFunction.h"
#include "itkWindowedSincInterpolateImageFunction.h"
#include "itkLabelImageGenericInterpolateImageFunction.h"

#include <algorithm>
#include <cmath>
#include <cstdint>
#include <sstream>
#include <string>
#include <vector>

namespace
{

// Shared interpolator-selection helper.
//
// Returns the requested interpolator as the common base pointer
// itk::InterpolateImageFunction<TImage, double>::Pointer, which feeds
// itk::ResampleImageFilter::SetInterpolator directly (the filter's
// InterpolatorType is InterpolateImageFunction<InputImageType, double>).
// The caller constrains `interpolator` to one of the six names below via
// CLI::IsMember, so an unknown name should be unreachable. Rather than silently
// substituting a default, an unknown name throws: any future drift between the
// CLI option list and this helper then fails loudly instead of resampling with
// the wrong kernel.
template <typename TImage>
typename itk::InterpolateImageFunction<TImage, double>::Pointer
SelectInterpolator(const std::string & interpolator)
{
  using ImageType = TImage;
  using InterpolatorBaseType = itk::InterpolateImageFunction<ImageType, double>;

  typename InterpolatorBaseType::Pointer selected;
  if (interpolator == "linear")
  {
    selected = itk::LinearInterpolateImageFunction<ImageType, double>::New();
  }
  else if (interpolator == "nearest_neighbor")
  {
    selected = itk::NearestNeighborInterpolateImageFunction<ImageType, double>::New();
  }
  else if (interpolator == "label_image")
  {
    selected = itk::LabelImageGenericInterpolateImageFunction<ImageType, itk::LinearInterpolateImageFunction>::New();
  }
  else if (interpolator == "b_spline")
  {
    selected = itk::BSplineInterpolateImageFunction<ImageType, double, double>::New();
  }
  else if (interpolator == "windowed_sinc")
  {
    // Radius 3, default Hamming window and ZeroFluxNeumann boundary condition.
    selected = itk::WindowedSincInterpolateImageFunction<ImageType, 3>::New();
  }
  else if (interpolator == "gaussian")
  {
    selected = itk::GaussianInterpolateImageFunction<ImageType, double>::New();
  }
  else
  {
    itkGenericExceptionMacro("Unknown interpolator '" << interpolator << "'.");
  }
  return selected;
}

// A fully-resolved output grid: every field itk::ResampleImageFilter needs to define the output
// sampling lattice, with each component either taken from a provided CLI option or defaulted from the
// moving image's geometry. The types come from itk::ImageBase<VDimension> so a single grid, resolved
// once, feeds both the scalar itk::Image path and each single-component itk::Image of the VectorImage
// path (an itk::Image and an itk::VectorImage of the same dimension share these geometry types).
template <unsigned int VDimension>
struct ResolvedGrid
{
  typename itk::ImageBase<VDimension>::SizeType      size;
  typename itk::ImageBase<VDimension>::SpacingType   spacing;
  typename itk::ImageBase<VDimension>::PointType     origin;
  typename itk::ImageBase<VDimension>::DirectionType direction;
  typename itk::ImageBase<VDimension>::IndexType     startIndex;
};

// Resolve the explicit output grid from the moving image's geometry and the parsed option vectors.
//
// Each grid component is taken from its option when that option was provided (a non-empty vector) and
// otherwise falls back to the moving image's own geometry, so the pipeline reproduces the input grid
// when no options are given. The one non-trivial branch is auto-sizing: when --output-spacing is given
// without --size, the size is chosen per axis to preserve the input's physical extent at the new
// spacing (ceil(inputSize * inputSpacing / outputSpacing), clamped to a minimum of 1) -- the "just
// change the spacing" convenience. The caller is expected to have already validated the option-vector
// lengths (see ValidateGridOptionLengths), so indexing by axis here is safe. The geometry is read
// through the itk::ImageBase base so the scalar and vector paths can share this one resolver.
template <unsigned int VDimension>
ResolvedGrid<VDimension>
ResolveOutputGrid(const itk::ImageBase<VDimension> * movingImage,
                  const std::vector<uint64_t> &      sizeArg,
                  const std::vector<double> &        outputSpacingArg,
                  const std::vector<double> &        outputOriginArg,
                  const std::vector<double> &        outputDirectionArg)
{
  ResolvedGrid<VDimension> grid;

  const auto & inputSpacing = movingImage->GetSpacing();
  const auto & inputOrigin = movingImage->GetOrigin();
  const auto & inputDirection = movingImage->GetDirection();
  const auto & inputRegion = movingImage->GetLargestPossibleRegion();
  const auto & inputSize = inputRegion.GetSize();

  // Spacing: --output-spacing if provided, else the input spacing.
  for (unsigned int axis = 0; axis < VDimension; ++axis)
  {
    grid.spacing[axis] = outputSpacingArg.empty() ? inputSpacing[axis] : outputSpacingArg[axis];
  }

  // Origin: --output-origin if provided, else the input origin.
  for (unsigned int axis = 0; axis < VDimension; ++axis)
  {
    grid.origin[axis] = outputOriginArg.empty() ? inputOrigin[axis] : outputOriginArg[axis];
  }

  // Direction: --output-direction reshaped row-major into the D-by-D matrix if provided, else the input
  // direction.
  if (outputDirectionArg.empty())
  {
    grid.direction = inputDirection;
  }
  else
  {
    for (unsigned int row = 0; row < VDimension; ++row)
    {
      for (unsigned int column = 0; column < VDimension; ++column)
      {
        grid.direction[row][column] = outputDirectionArg[row * VDimension + column];
      }
    }
  }

  // Size: --size if provided; else, when --output-spacing was given, auto-size to preserve the input's
  // physical extent at the new spacing; else the input size.
  if (!sizeArg.empty())
  {
    for (unsigned int axis = 0; axis < VDimension; ++axis)
    {
      grid.size[axis] = static_cast<itk::SizeValueType>(sizeArg[axis]);
    }
  }
  else if (!outputSpacingArg.empty())
  {
    for (unsigned int axis = 0; axis < VDimension; ++axis)
    {
      const double physicalExtent = static_cast<double>(inputSize[axis]) * inputSpacing[axis];
      const double resolvedCount = std::ceil(physicalExtent / grid.spacing[axis]);
      grid.size[axis] = static_cast<itk::SizeValueType>(std::max(1.0, resolvedCount));
    }
  }
  else
  {
    grid.size = inputSize;
  }

  // Start index: the input's largest-region start index.
  grid.startIndex = inputRegion.GetIndex();

  return grid;
}

// Validate that any provided grid-option vector has the correct length for VDimension: --size,
// --output-spacing, and --output-origin must each hold VDimension values, and the flattened row-major
// --output-direction matrix must hold VDimension * VDimension values. Empty vectors are unset (they
// default from the input geometry) and always pass. Returns an explanatory message on the first
// mismatch, or an empty string when every provided vector is well-sized -- mirroring the size/sigma
// length check in gaussian-kernel-radius.cxx, whose caller turns a non-empty message into a
// CLI::Error and returns via pipeline.exit().
template <unsigned int VDimension>
std::string
ValidateGridOptionLengths(const std::vector<uint64_t> & size,
                          const std::vector<double> &   outputSpacing,
                          const std::vector<double> &   outputOrigin,
                          const std::vector<double> &   outputDirection)
{
  std::ostringstream ostrm;
  if (!size.empty() && size.size() != VDimension)
  {
    ostrm << "--size expects " << VDimension << " values (one per axis) but received " << size.size() << ".\n";
    return ostrm.str();
  }
  if (!outputSpacing.empty() && outputSpacing.size() != VDimension)
  {
    ostrm << "--output-spacing expects " << VDimension << " values (one per axis) but received " << outputSpacing.size()
          << ".\n";
    return ostrm.str();
  }
  if (!outputOrigin.empty() && outputOrigin.size() != VDimension)
  {
    ostrm << "--output-origin expects " << VDimension << " values (one per axis) but received " << outputOrigin.size()
          << ".\n";
    return ostrm.str();
  }
  if (!outputDirection.empty() && outputDirection.size() != VDimension * VDimension)
  {
    ostrm << "--output-direction expects " << VDimension * VDimension << " values (the " << VDimension << "x"
          << VDimension << " row-major direction matrix) but received " << outputDirection.size() << ".\n";
    return ostrm.str();
  }
  return std::string();
}

// Shared resample wiring used by both the scalar pipeline and each component of the vector pipeline, so
// the explicit-grid / transform / interpolator setup lives in exactly one place.
//
// Builds an itk::ResampleImageFilter<TImage, TImage> that maps `movingImage` onto the explicitly
// parameterized output `grid` (size, spacing, origin, direction, start index) using the selected
// interpolator and, when provided, the optional transform (otherwise the filter's default identity
// transform is kept). Output samples that map outside the moving image are filled with
// `defaultPixelValue` (the background value), cast to the image's pixel type. The filter is returned
// un-executed so the caller controls when it updates (the vector path defers to a single
// ComposeImageFilter update across all components).
template <typename TImage>
typename itk::ResampleImageFilter<TImage, TImage>::Pointer
MakeResampleFilter(const TImage *                                                                 movingImage,
                   const ResolvedGrid<TImage::ImageDimension> &                                   grid,
                   const itk::Transform<double, TImage::ImageDimension, TImage::ImageDimension> * transform,
                   const std::string &                                                            interpolator,
                   double                                                                         defaultPixelValue)
{
  using ImageType = TImage;
  using ResampleFilterType = itk::ResampleImageFilter<ImageType, ImageType>;

  auto resampleFilter = ResampleFilterType::New();
  resampleFilter->SetInput(movingImage);
  resampleFilter->SetSize(grid.size);
  resampleFilter->SetOutputSpacing(grid.spacing);
  resampleFilter->SetOutputOrigin(grid.origin);
  resampleFilter->SetOutputDirection(grid.direction);
  resampleFilter->SetOutputStartIndex(grid.startIndex);
  resampleFilter->SetInterpolator(SelectInterpolator<ImageType>(interpolator));
  resampleFilter->SetDefaultPixelValue(static_cast<typename ImageType::PixelType>(defaultPixelValue));

  // Only override the filter's default identity transform when one was provided.
  if (transform != nullptr)
  {
    resampleFilter->SetTransform(transform);
  }

  return resampleFilter;
}

// Groups the CLI options shared by the scalar and vector resample paths so both declare exactly one
// option surface -- identical names, order, type_names, help text, and interpolator constraint. The
// option-target members must outlive ITK_WASM_PARSE (CLI11 binds them by reference), so the caller owns
// this struct on its own stack and passes it to addResampleOptions() before parsing. The four grid
// vectors are left empty when their options are absent, which the functors read as "default from the
// input geometry."
template <typename TImage>
struct ResampleOptions
{
  itk::wasm::InputImage<TImage>  inputImage;
  std::vector<uint64_t>          size;
  std::vector<double>            outputSpacing;
  std::vector<double>            outputOrigin;
  std::vector<double>            outputDirection;
  std::string                    transformArg;
  std::string                    interpolator{ "linear" };
  double                         defaultPixelValue{ 0.0 };
  itk::wasm::OutputImage<TImage> outputImage;
};

// Declares the shared resample option surface into `pipeline`, binding each option to the corresponding
// member of `options`. Kept in lockstep with the scalar and vector functors' post-parse reads below.
template <typename TImage>
void
addResampleOptions(itk::wasm::Pipeline & pipeline, ResampleOptions<TImage> & options)
{
  // The moving image. This is the image SupportInputImageTypes dispatches on, so it must be the first
  // positional option added.
  pipeline.add_option("input", options.inputImage, "The moving image to resample.")
    ->required()
    ->type_name("INPUT_IMAGE");

  // Explicit output-grid parameters. Each is optional and, when omitted, defaults per axis from the
  // moving image's geometry (so with no grid options the pipeline reproduces the input grid).
  pipeline
    .add_option("--size",
                options.size,
                "Output size in pixels per axis. Defaults to the input size; when --output-spacing is given "
                "without --size, the size is auto-computed to preserve the input's physical extent at the new "
                "spacing.")
    ->expected(1, -1);

  pipeline
    .add_option("--output-spacing",
                options.outputSpacing,
                "Output spacing per axis in physical units. Defaults to the input spacing.")
    ->expected(1, -1);

  pipeline
    .add_option("--output-origin",
                options.outputOrigin,
                "Output origin, the physical coordinates of the first pixel, per axis. Defaults to the input "
                "origin.")
    ->expected(1, -1);

  pipeline
    .add_option("--output-direction",
                options.outputDirection,
                "Output direction as the D-by-D orientation matrix, flattened row-major (D values per row). "
                "Defaults to the input direction.")
    ->expected(1, -1);

  // Optional transform mapping output-grid points into the moving-image space. Bound to a plain string
  // (the memory-store index under --memory-io, or the filesystem path otherwise); readInputTransform()
  // reconstructs any transform parameterization -- composing a multi-entry or composite list into an
  // itk::CompositeTransform -- into the abstract itk::Transform base, which
  // itk::ResampleImageFilter::SetTransform accepts polymorphically.
  pipeline
    .add_option("-t,--transform",
                options.transformArg,
                "Optional transform mapping output-grid points into the moving-image space. A multi-entry or "
                "composite list is composed with itk::CompositeTransform semantics: the last entry is applied to "
                "the point first. Defaults to identity.")
    ->type_name("INPUT_TRANSFORM");

  pipeline
    .add_option("-i,--interpolator", options.interpolator, "Interpolation method used to sample the moving image.")
    ->check(CLI::IsMember({ "linear", "nearest_neighbor", "label_image", "b_spline", "windowed_sinc", "gaussian" }));

  // Background value: output samples that map outside the moving image get this value (cast to the pixel
  // type). Defaults to 0; e.g. -1024 (air) is the natural background for CT.
  pipeline.add_option("-d,--default-value",
                      options.defaultPixelValue,
                      "Pixel value assigned to output samples that map outside the moving image (the background "
                      "value), cast to the output pixel type. Defaults to 0.");

  pipeline.add_option("output", options.outputImage, "The resampled output image.")
    ->required()
    ->type_name("OUTPUT_IMAGE");
}

} // namespace

template <typename TImage>
class PipelineFunctor
{
public:
  int
  operator()(itk::wasm::Pipeline & pipeline)
  {
    using ImageType = TImage;
    constexpr unsigned int ImageDimension = ImageType::ImageDimension;

    ResampleOptions<ImageType> options;
    addResampleOptions(pipeline, options);

    ITK_WASM_PARSE(pipeline);

    // Reject any provided grid-option vector whose length does not match the image dimension before the
    // grid is resolved (which indexes each vector by axis).
    const std::string gridError = ValidateGridOptionLengths<ImageDimension>(
      options.size, options.outputSpacing, options.outputOrigin, options.outputDirection);
    if (!gridError.empty())
    {
      CLI::Error err("Runtime error", gridError, 1);
      return pipeline.exit(err);
    }

    typename ImageType::ConstPointer movingImage = options.inputImage.Get();

    // Read the optional transform generically into the abstract itk::Transform base.
    // Left null when unset, so MakeResampleFilter keeps the filter's identity transform.
    using BaseTransformType = itk::Transform<double, ImageDimension, ImageDimension>;
    typename BaseTransformType::ConstPointer transform;
    if (!options.transformArg.empty())
    {
      ITK_WASM_CATCH_EXCEPTION(pipeline, transform = readInputTransform<ImageDimension>(options.transformArg));
    }

    // Resolve the explicit output grid once from the moving image's geometry, applying the parameterized
    // options with input-geometry fallback.
    const ResolvedGrid<ImageDimension> grid = ResolveOutputGrid<ImageDimension>(
      movingImage.GetPointer(), options.size, options.outputSpacing, options.outputOrigin, options.outputDirection);

    // Shared explicit-grid / transform / interpolator / background-value wiring.
    auto resampleFilter = MakeResampleFilter<ImageType>(
      movingImage.GetPointer(), grid, transform.GetPointer(), options.interpolator, options.defaultPixelValue);

    ITK_WASM_CATCH_EXCEPTION(pipeline, resampleFilter->UpdateLargestPossibleRegion());

    typename ImageType::ConstPointer result = resampleFilter->GetOutput();
    options.outputImage.Set(result);

    return EXIT_SUCCESS;
  }
};

// Specialization for itk::VectorImage (multi-component) pixel types.
//
// itk::ResampleImageFilter has no native multi-component path, so -- mirroring
// downsample.cxx -- each component is extracted to a scalar image, resampled
// independently through the shared MakeResampleFilter wiring, then recomposed.
// Every interpolator therefore works with vector pixels.
template <typename TPixel, unsigned int VDimension>
class PipelineFunctor<itk::VectorImage<TPixel, VDimension>>
{
public:
  int
  operator()(itk::wasm::Pipeline & pipeline)
  {
    constexpr unsigned int Dimension = VDimension;
    using PixelType = TPixel;
    using VectorImageType = itk::VectorImage<PixelType, Dimension>;
    using ScalarImageType = itk::Image<PixelType, Dimension>;

    // Same option surface as the scalar path -- the InputImage/OutputImage are just typed on the
    // VectorImage -- so the bindings stay uniform across pixel types.
    ResampleOptions<VectorImageType> options;
    addResampleOptions(pipeline, options);

    ITK_WASM_PARSE(pipeline);

    // Reject any provided grid-option vector whose length does not match the image dimension before the
    // grid is resolved (which indexes each vector by axis).
    const std::string gridError = ValidateGridOptionLengths<Dimension>(
      options.size, options.outputSpacing, options.outputOrigin, options.outputDirection);
    if (!gridError.empty())
    {
      CLI::Error err("Runtime error", gridError, 1);
      return pipeline.exit(err);
    }

    typename VectorImageType::ConstPointer movingImage = options.inputImage.Get();

    // Read the optional transform generically into the abstract itk::Transform base
    // (null when unset -> each per-component filter keeps the identity transform).
    using BaseTransformType = itk::Transform<double, Dimension, Dimension>;
    typename BaseTransformType::ConstPointer transform;
    if (!options.transformArg.empty())
    {
      ITK_WASM_CATCH_EXCEPTION(pipeline, transform = readInputTransform<Dimension>(options.transformArg));
    }

    // Resolve the explicit output grid once from the moving VectorImage's geometry; the same grid feeds
    // every per-component scalar resample.
    const ResolvedGrid<Dimension> grid = ResolveOutputGrid<Dimension>(
      movingImage.GetPointer(), options.size, options.outputSpacing, options.outputOrigin, options.outputDirection);

    const unsigned int numberOfComponents = movingImage->GetNumberOfComponentsPerPixel();

    using ExtractFilterType = itk::VectorIndexSelectionCastImageFilter<VectorImageType, ScalarImageType>;
    using ResampleFilterType = itk::ResampleImageFilter<ScalarImageType, ScalarImageType>;
    using ComposeFilterType = itk::ComposeImageFilter<ScalarImageType>;

    auto composeFilter = ComposeFilterType::New();

    // itk::DataObject holds only a WeakPointer back to its producing filter, so
    // every per-component filter must stay alive until the single, final compose
    // update below pulls the data through the whole pipeline.
    std::vector<typename ExtractFilterType::Pointer>  extractFilters;
    std::vector<typename ResampleFilterType::Pointer> resampleFilters;
    extractFilters.reserve(numberOfComponents);
    resampleFilters.reserve(numberOfComponents);

    for (unsigned int component = 0; component < numberOfComponents; ++component)
    {
      auto extractFilter = ExtractFilterType::New();
      extractFilter->SetInput(movingImage);
      extractFilter->SetIndex(component);
      extractFilters.push_back(extractFilter);

      // Reuse the shared scalar wiring; the grid resolved from the moving VectorImage above applies
      // unchanged to each single-component output.
      auto resampleFilter = MakeResampleFilter<ScalarImageType>(
        extractFilter->GetOutput(), grid, transform.GetPointer(), options.interpolator, options.defaultPixelValue);
      resampleFilters.push_back(resampleFilter);

      composeFilter->SetInput(component, resampleFilter->GetOutput());
    }

    ITK_WASM_CATCH_EXCEPTION(pipeline, composeFilter->UpdateLargestPossibleRegion());

    typename VectorImageType::ConstPointer result = composeFilter->GetOutput();
    options.outputImage.Set(result);

    return EXIT_SUCCESS;
  }
};

int
main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline(
    "resample",
    "Resample an image onto an explicitly parameterized output grid with an optional transform and a selectable "
    "interpolator.",
    argc,
    argv);

  return itk::wasm::SupportInputImageTypes<PipelineFunctor,
                                           uint8_t,
                                           int8_t,
                                           uint16_t,
                                           int16_t,
                                           uint32_t,
                                           int32_t,
                                           uint64_t,
                                           int64_t,
                                           float,
                                           double,
                                           itk::VariableLengthVector<uint8_t>,
                                           itk::VariableLengthVector<uint16_t>,
                                           itk::VariableLengthVector<int16_t>,
                                           itk::VariableLengthVector<float>,
                                           itk::VariableLengthVector<double>>::Dimensions<2U, 3U, 4U>("input",
                                                                                                      pipeline);
}

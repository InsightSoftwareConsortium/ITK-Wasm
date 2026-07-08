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

// Shared resample wiring used by both the scalar pipeline and each component of
// the vector pipeline, so the reference-geometry / transform / interpolator
// setup lives in exactly one place.
//
// Builds an itk::ResampleImageFilter<TImage, TImage> that maps `movingImage`
// onto the reference image's geometry (origin, spacing, direction, size, start
// index) using the selected interpolator and, when provided, the optional
// transform (otherwise the filter's default identity transform is kept). Output
// samples that map outside the moving image are filled with `defaultPixelValue`
// (the background value), cast to the image's pixel type. The reference is taken
// as an itk::ImageBase pointer because the filter reads only its geometry -- this
// lets the vector path pass the moving VectorImage's own geometry to each
// single-component (itk::Image) resample. The filter is returned un-executed so
// the caller controls when it updates (the vector path defers to a single
// ComposeImageFilter update across all components).
template <typename TImage>
typename itk::ResampleImageFilter<TImage, TImage>::Pointer
MakeResampleFilter(const TImage *                                                                 movingImage,
                   const itk::ImageBase<TImage::ImageDimension> *                                 referenceGeometry,
                   const itk::Transform<double, TImage::ImageDimension, TImage::ImageDimension> * transform,
                   const std::string &                                                            interpolator,
                   double                                                                         defaultPixelValue)
{
  using ImageType = TImage;
  using ResampleFilterType = itk::ResampleImageFilter<ImageType, ImageType>;

  auto resampleFilter = ResampleFilterType::New();
  resampleFilter->SetInput(movingImage);
  resampleFilter->SetReferenceImage(referenceGeometry);
  resampleFilter->UseReferenceImageOn();
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
// this struct on its own stack and passes it to addResampleOptions() before parsing.
template <typename TImage>
struct ResampleOptions
{
  itk::wasm::InputImage<TImage>  inputImage;
  itk::wasm::InputImage<TImage>  referenceImage;
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

  // The reference image whose geometry (origin, spacing, direction, size) defines the output grid. Only
  // the metadata is read, so a metadata-only / empty pixel buffer is acceptable.
  pipeline
    .add_option("reference-image",
                options.referenceImage,
                "Reference image whose geometry defines the output grid. Only the geometry (origin, spacing, "
                "direction, size) is used; the pixel values are ignored.")
    ->required()
    ->type_name("INPUT_IMAGE");

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

    typename ImageType::ConstPointer movingImage = options.inputImage.Get();
    typename ImageType::ConstPointer referenceGeometry = options.referenceImage.Get();

    // Read the optional transform generically into the abstract itk::Transform base.
    // Left null when unset, so MakeResampleFilter keeps the filter's identity transform.
    using BaseTransformType = itk::Transform<double, ImageDimension, ImageDimension>;
    typename BaseTransformType::ConstPointer transform;
    if (!options.transformArg.empty())
    {
      ITK_WASM_CATCH_EXCEPTION(pipeline, transform = readInputTransform<ImageDimension>(options.transformArg));
    }

    // Shared reference-geometry / transform / interpolator / background-value wiring.
    auto resampleFilter = MakeResampleFilter<ImageType>(movingImage.GetPointer(),
                                                        referenceGeometry.GetPointer(),
                                                        transform.GetPointer(),
                                                        options.interpolator,
                                                        options.defaultPixelValue);

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

    typename VectorImageType::ConstPointer movingImage = options.inputImage.Get();
    typename VectorImageType::ConstPointer referenceGeometry = options.referenceImage.Get();

    // Read the optional transform generically into the abstract itk::Transform base
    // (null when unset -> each per-component filter keeps the identity transform).
    using BaseTransformType = itk::Transform<double, Dimension, Dimension>;
    typename BaseTransformType::ConstPointer transform;
    if (!options.transformArg.empty())
    {
      ITK_WASM_CATCH_EXCEPTION(pipeline, transform = readInputTransform<Dimension>(options.transformArg));
    }

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

      // Reuse the shared scalar wiring; the moving VectorImage's own geometry is
      // a valid itk::ImageBase reference for each single-component output grid.
      auto resampleFilter = MakeResampleFilter<ScalarImageType>(extractFilter->GetOutput(),
                                                                referenceGeometry.GetPointer(),
                                                                transform.GetPointer(),
                                                                options.interpolator,
                                                                options.defaultPixelValue);
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
    "resample-to-reference",
    "Resample an image onto a reference image's grid with an optional transform and a selectable interpolator.",
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

/*=========================================================================

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

#include "itkDiscreteGaussianImageFilter.h"
#include "itkLinearInterpolateImageFunction.h"
#include "itkResampleImageFilter.h"
#include "itkVectorIndexSelectionCastImageFilter.h"
#include "itkComposeImageFilter.h"

#include "downsampleSigma.h"

// Scalar image processing
template <typename TImage>
int
DownsampleScalarImage(itk::wasm::Pipeline & pipeline, const TImage * inputImage)
{
  using ImageType = TImage;
  constexpr unsigned int ImageDimension = ImageType::ImageDimension;

  pipeline.get_option("input")->required()->type_name("INPUT_IMAGE");

  std::vector<unsigned int> shrinkFactors{ 2, 2 };
  pipeline.add_option("-s,--shrink-factors", shrinkFactors, "Shrink factors")->required()->type_size(ImageDimension);

  std::vector<unsigned int> cropRadius;
  pipeline.add_option("-r,--crop-radius", cropRadius, "Optional crop radius in pixel units.")
    ->type_size(ImageDimension);

  using OutputImageType = itk::wasm::OutputImage<ImageType>;
  OutputImageType downsampledImage;
  pipeline.add_option("downsampled", downsampledImage, "Output downsampled image")
    ->required()
    ->type_name("OUTPUT_IMAGE");

  ITK_WASM_PARSE(pipeline);

  auto sigmaValues = downsampleSigma(shrinkFactors);

  using GaussianFilterType = itk::DiscreteGaussianImageFilter<ImageType, ImageType>;
  auto gaussianFilter = GaussianFilterType::New();
  gaussianFilter->SetInput(inputImage);
  typename GaussianFilterType::ArrayType sigmaArray;
  for (unsigned int i = 0; i < ImageDimension; ++i)
  {
    sigmaArray[i] = sigmaValues[i];
  }
  gaussianFilter->SetSigmaArray(sigmaArray);
  gaussianFilter->SetUseImageSpacingOff();

  const auto inputOrigin = inputImage->GetOrigin();
  const auto inputSpacing = inputImage->GetSpacing();
  const auto inputSize = inputImage->GetLargestPossibleRegion().GetSize();

  typename ImageType::PointType   outputOrigin;
  typename ImageType::SpacingType outputSpacing;
  typename ImageType::SizeType    outputSize;
  for (unsigned int i = 0; i < ImageDimension; ++i)
  {
    const double cropRadiusValue = cropRadius.size() ? cropRadius[i] : 0.0;

    outputOrigin[i] = inputOrigin[i] + cropRadiusValue * inputSpacing[i];
    outputSpacing[i] = inputSpacing[i] * shrinkFactors[i];
    outputSize[i] = std::max<itk::SizeValueType>(0, (inputSize[i] - 2 * cropRadiusValue) / shrinkFactors[i]);
  }

  using InterpolatorType = itk::LinearInterpolateImageFunction<ImageType, double>;
  auto interpolator = InterpolatorType::New();

  using ResampleFilterType = itk::ResampleImageFilter<ImageType, ImageType>;
  auto shrinkFilter = ResampleFilterType::New();
  shrinkFilter->SetInput(gaussianFilter->GetOutput());
  shrinkFilter->SetInterpolator(interpolator);
  shrinkFilter->SetOutputOrigin(outputOrigin);
  shrinkFilter->SetOutputSpacing(outputSpacing);
  shrinkFilter->SetOutputDirection(inputImage->GetDirection());
  shrinkFilter->SetSize(outputSize);
  shrinkFilter->SetOutputStartIndex(inputImage->GetLargestPossibleRegion().GetIndex());

  ITK_WASM_CATCH_EXCEPTION(pipeline, shrinkFilter->UpdateLargestPossibleRegion());

  typename ImageType::ConstPointer result = shrinkFilter->GetOutput();
  downsampledImage.Set(result);

  return EXIT_SUCCESS;
}

template <typename TImage>
class PipelineFunctor
{
public:
  int
  operator()(itk::wasm::Pipeline & pipeline)
  {
    using ImageType = TImage;
    constexpr unsigned int ImageDimension = ImageType::ImageDimension;

    using InputImageType = itk::wasm::InputImage<ImageType>;
    InputImageType inputImage;
    pipeline.add_option("input", inputImage, "Input image")->type_name("INPUT_IMAGE");

    ITK_WASM_PRE_PARSE(pipeline);

    typename ImageType::ConstPointer image = inputImage.Get();
    return DownsampleScalarImage<ImageType>(pipeline, image);
  }
};

// Specialization for VectorImage types
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

    using InputImageType = itk::wasm::InputImage<VectorImageType>;
    InputImageType inputImage;
    pipeline.add_option("input", inputImage, "Input image")->required()->type_name("INPUT_IMAGE");

    std::vector<unsigned int> shrinkFactors{ 2, 2 };
    pipeline.add_option("-s,--shrink-factors", shrinkFactors, "Shrink factors")->required()->type_size(Dimension);

    std::vector<unsigned int> cropRadius;
    pipeline.add_option("-r,--crop-radius", cropRadius, "Optional crop radius in pixel units.")
      ->type_size(Dimension);

    using OutputImageType = itk::wasm::OutputImage<VectorImageType>;
    OutputImageType downsampledImage;
    pipeline.add_option("downsampled", downsampledImage, "Output downsampled image")
      ->required()
      ->type_name("OUTPUT_IMAGE");

    ITK_WASM_PARSE(pipeline);

    // Get number of components
    const unsigned int numberOfComponents = inputImage.Get()->GetNumberOfComponentsPerPixel();

    // Extract, process, and compose each component
    using ExtractFilterType = itk::VectorIndexSelectionCastImageFilter<VectorImageType, ScalarImageType>;
    using ComposeFilterType = itk::ComposeImageFilter<ScalarImageType>;

    auto sigmaValues = downsampleSigma(shrinkFactors);

    const auto inputOrigin = inputImage.Get()->GetOrigin();
    const auto inputSpacing = inputImage.Get()->GetSpacing();
    const auto inputSize = inputImage.Get()->GetLargestPossibleRegion().GetSize();

    typename VectorImageType::PointType   outputOrigin;
    typename VectorImageType::SpacingType outputSpacing;
    typename VectorImageType::SizeType    outputSize;
    for (unsigned int i = 0; i < Dimension; ++i)
    {
      const double cropRadiusValue = cropRadius.size() ? cropRadius[i] : 0.0;

      outputOrigin[i] = inputOrigin[i] + cropRadiusValue * inputSpacing[i];
      outputSpacing[i] = inputSpacing[i] * shrinkFactors[i];
      outputSize[i] = std::max<itk::SizeValueType>(0, (inputSize[i] - 2 * cropRadiusValue) / shrinkFactors[i]);
    }

    auto composeFilter = ComposeFilterType::New();

    auto extractFilter = ExtractFilterType::New();
    extractFilter->SetInput(inputImage.Get());

    using GaussianFilterType = itk::DiscreteGaussianImageFilter<ScalarImageType, ScalarImageType>;
    auto gaussianFilter = GaussianFilterType::New();

    for (unsigned int component = 0; component < numberOfComponents; ++component)
    {
      // Extract component
      extractFilter->SetIndex(component);

      // Smooth component
      gaussianFilter->SetInput(extractFilter->GetOutput());
      typename GaussianFilterType::ArrayType sigmaArray;
      for (unsigned int i = 0; i < Dimension; ++i)
      {
        sigmaArray[i] = sigmaValues[i];
      }
      gaussianFilter->SetSigmaArray(sigmaArray);
      gaussianFilter->SetUseImageSpacingOff();

      // Resample component
      using InterpolatorType = itk::LinearInterpolateImageFunction<ScalarImageType, double>;
      auto interpolator = InterpolatorType::New();

      using ResampleFilterType = itk::ResampleImageFilter<ScalarImageType, ScalarImageType>;
      auto shrinkFilter = ResampleFilterType::New();
      shrinkFilter->SetInput(gaussianFilter->GetOutput());
      shrinkFilter->SetInterpolator(interpolator);
      shrinkFilter->SetOutputOrigin(outputOrigin);
      shrinkFilter->SetOutputSpacing(outputSpacing);
      shrinkFilter->SetOutputDirection(inputImage.Get()->GetDirection());
      shrinkFilter->SetSize(outputSize);
      shrinkFilter->SetOutputStartIndex(inputImage.Get()->GetLargestPossibleRegion().GetIndex());
      shrinkFilter->UpdateLargestPossibleRegion();

      // Add to compose filter
      composeFilter->SetInput(component, shrinkFilter->GetOutput());
    }

    ITK_WASM_CATCH_EXCEPTION(pipeline, composeFilter->UpdateLargestPossibleRegion());

    downsampledImage.Set(composeFilter->GetOutput());

    return EXIT_SUCCESS;
  }
};

int
main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline(
    "downsample", "Apply a smoothing anti-alias filter and subsample the input image.", argc, argv);

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
                                           itk::VariableLengthVector<double>
                                           >::Dimensions<2U, 3U, 4U, 5U>("input", pipeline);
}
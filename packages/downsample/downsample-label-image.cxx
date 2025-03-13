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

#include "itkLabelImageGenericInterpolateImageFunction.h"
#include "itkLinearInterpolateImageFunction.h"
#include "itkResampleImageFilter.h"

#include "downsampleSigma.h"

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
    pipeline.add_option("input", inputImage, "Input image")->required()->type_name("INPUT_IMAGE");

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

    const auto inputOrigin = inputImage.Get()->GetOrigin();
    const auto inputSpacing = inputImage.Get()->GetSpacing();
    const auto inputSize = inputImage.Get()->GetLargestPossibleRegion().GetSize();

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

    using InterpolatorType =
      itk::LabelImageGenericInterpolateImageFunction<ImageType, itk::LinearInterpolateImageFunction>;
    auto interpolator = InterpolatorType::New();

    using ResampleFilterType = itk::ResampleImageFilter<ImageType, ImageType>;
    auto shrinkFilter = ResampleFilterType::New();
    shrinkFilter->SetInput(inputImage.Get());
    shrinkFilter->SetInterpolator(interpolator);
    shrinkFilter->SetOutputOrigin(outputOrigin);
    shrinkFilter->SetOutputSpacing(outputSpacing);
    shrinkFilter->SetOutputDirection(inputImage.Get()->GetDirection());
    shrinkFilter->SetSize(outputSize);
    shrinkFilter->SetOutputStartIndex(inputImage.Get()->GetLargestPossibleRegion().GetIndex());

    ITK_WASM_CATCH_EXCEPTION(pipeline, shrinkFilter->UpdateLargestPossibleRegion());

    typename ImageType::ConstPointer result = shrinkFilter->GetOutput();
    downsampledImage.Set(result);

    return EXIT_SUCCESS;
  }
};

int
main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("downsample-label-image",
                               "Subsample the input label image a according to weighted voting of local labels.",
                               argc,
                               argv);

  return itk::wasm::SupportInputImageTypes<PipelineFunctor,
                                           int8_t,
                                           uint8_t,
                                           int16_t,
                                           uint16_t,
                                           int32_t,
                                           uint32_t,
                                           int64_t,
                                           uint64_t,
                                           float>::Dimensions<2U, 3U, 4U, 5U>("input", pipeline);
}

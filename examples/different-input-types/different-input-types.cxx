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
#include "itkLabelObject.h"
#include "itkLabelMap.h"
#include "itkLabelImageToLabelMapFilter.h"
#include "itkLabelMapOverlayImageFilter.h"

template<typename TImage, typename TLabelImage>
int
OverlayLabelMap(itk::wasm::Pipeline & pipeline, const TImage * inputImage, const TLabelImage * labelImage)
{
  using ImageType = TImage;
  using LabelImageType = TLabelImage;
  constexpr unsigned int Dimension = ImageType::ImageDimension;

  using LabelType = typename LabelImageType::PixelType;
  using LabelObjectType = itk::LabelObject<LabelType, Dimension>;
  using LabelMapType = itk::LabelMap<LabelObjectType>;

  using ConverterType = itk::LabelImageToLabelMapFilter<LabelImageType, LabelMapType>;
  using FilterType = itk::LabelMapOverlayImageFilter<LabelMapType, ImageType>;

  pipeline.get_option("input-image")->required()->type_name("INPUT_IMAGE");
  pipeline.get_option("label-image")->required()->type_name("INPUT_IMAGE");

  using OutputImageType = itk::wasm::OutputImage<typename FilterType::OutputImageType>;
  OutputImageType outputImage;
  pipeline.add_option("output-image", outputImage, "The output image")->required()->type_name("OUTPUT_IMAGE");

  ITK_WASM_PARSE(pipeline);

  auto converter = ConverterType::New();
  converter->SetInput(labelImage);

  auto filter = FilterType::New();
  filter->SetInput(converter->GetOutput());
  filter->SetFeatureImage(inputImage);
  filter->SetOpacity(0.5);

  filter->UpdateLargestPossibleRegion();

  outputImage.Set(filter->GetOutput());

  return EXIT_SUCCESS;
}

template<typename TImage>
class InputImagePipelineFunctor
{
public:
  int operator()(itk::wasm::Pipeline & pipeline)
  {
    using InputImageType = itk::wasm::InputImage<TImage>;
    InputImageType inputImage;
    pipeline.add_option("input-image", inputImage, "The input image");

    ITK_WASM_PRE_PARSE(pipeline);

    typename TImage::ConstPointer image = inputImage.Get();
    parsedImage = image;
    return itk::wasm::SupportInputImageTypes<LabelImagePipelineFunctor,
      uint8_t>
      ::template Dimensions<TImage::ImageDimension>("label-image", pipeline);
  }

private:
  template<typename TLabelImage>
  class LabelImagePipelineFunctor
  {
  public:
    int operator()(itk::wasm::Pipeline & pipeline)
    {
      using LabelImageType = itk::wasm::InputImage<TLabelImage>;
      LabelImageType labelImage;
      pipeline.add_option("label-image", labelImage, "The label image");

      ITK_WASM_PRE_PARSE(pipeline);

      typename TLabelImage::ConstPointer label = labelImage.Get();
      return OverlayLabelMap<TImage, TLabelImage>(pipeline, parsedImage, label);
    }
  };

  static inline const TImage * parsedImage;
};

int main( int argc, char * argv[] )
{
  // Create the pipeline for parsing arguments. Provide a description.
  itk::wasm::Pipeline pipeline("different-input-types", "An itk-wasm pipeline example that demonstrates accepting different input types", argc, argv);

  return itk::wasm::SupportInputImageTypes<InputImagePipelineFunctor,
   uint8_t,
   uint16_t>
  ::Dimensions<2U>("input-image", pipeline);
}

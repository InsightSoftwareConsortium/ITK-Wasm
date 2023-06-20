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
#include "itkMedianImageFilter.h"

template<typename TImage>
int
MedianFilter(itk::wasm::Pipeline & pipeline, const TImage * inputImage)
{
  using ImageType = TImage;

  // For running the pipeline, mark the input image as required
  // and specify its type name
  pipeline.get_option("input-image")->required()->type_name("INPUT_IMAGE");

  // Add a flag to specify the radius of the median filter.
  unsigned int radius = 1;
  pipeline.add_option("-r,--radius", radius, "Kernel radius in pixels");

  // Add an output image argument.
  using OutputImageType = itk::wasm::OutputImage<ImageType>;
  OutputImageType outputImage;
  pipeline.add_option("output-image", outputImage, "The output image")->required()->type_name("OUTPUT_IMAGE");

  ITK_WASM_PARSE(pipeline);

  // Process our data
  using FilterType = itk::MedianImageFilter< ImageType, ImageType >;
  auto filter = FilterType::New();
  filter->SetInput(inputImage);
  filter->SetRadius(radius);
  filter->Update();

  // Set the output image before the program completes.
  outputImage.Set(filter->GetOutput());

  return EXIT_SUCCESS;
}

template<typename TImage>
class PipelineFunctor
{
public:
  int operator()(itk::wasm::Pipeline & pipeline)
  {
    using ImageType = TImage;

    using InputImageType = itk::wasm::InputImage<ImageType>;
    InputImageType inputImage;
    pipeline.add_option("input-image", inputImage, "The input image");

    // Use the ITK_WASM_PRE_PARSE macro, which checks only the defined options.
    ITK_WASM_PRE_PARSE(pipeline);

    typename ImageType::ConstPointer image = inputImage.Get();
    return MedianFilter<ImageType>(pipeline, image);
  }
};

int main( int argc, char * argv[] )
{
  itk::wasm::Pipeline pipeline("different-input-types", "An itk-wasm pipeline example that demonstrates accepting different input types", argc, argv);

  // Specify
  //   1) Input image pixel types we want to support
  //   2) Input image dimensions we want to support
  return itk::wasm::SupportInputImageTypes<PipelineFunctor,
   uint8_t,
   uint16_t>
  ::Dimensions<2U>("input-image", pipeline);
}

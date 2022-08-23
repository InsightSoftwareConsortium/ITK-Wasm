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

#include "itkImage.h"
#include "itkMedianImageFilter.h"

int main(int argc, char * argv[]) {
  // Create the pipeline for parsing arguments. Provide a description.
  itk::wasm::Pipeline pipeline("Smooth an image with a median filter", argc, argv);

  constexpr unsigned int Dimension = 2;
  using PixelType = unsigned char;
  using ImageType = itk::Image<PixelType, Dimension>;


  // Add a flag to specify the radius of the median filter.
  unsigned int radius = 1;
  pipeline.add_option("-r,--radius", radius, "Kernel radius in pixels");

  // Add a input image argument.
  using InputImageType = itk::wasm::InputImage<ImageType>;
  InputImageType inputImage;
  pipeline.add_option("InputImage", inputImage, "The input image")->required();

  // Add an output image argument.
  using OutputImageType = itk::wasm::OutputImage<ImageType>;
  OutputImageType outputImage;
  pipeline.add_option("OutputImage", outputImage, "The output image")->required();

  // Parse the arguments. If `-r` or `--radius` is set, the `radius` variable will be set to its integer value.
  // The `inputImage` variable is populated from the filesystem if built as a native executable.
  // When running in the browser or in a wrapped language, `inputImage` is read from WebAssembly memory without file IO.
  ITK_WASM_PARSE(pipeline);

  // Process our data
  using FilterType = itk::MedianImageFilter< ImageType, ImageType >;
  auto filter = FilterType::New();
  filter->SetInput(inputImage.Get());
  filter->SetRadius(radius);
  filter->Update();

  // Set the output image before the program completes.
  outputImage.Set(filter->GetOutput());

  return EXIT_SUCCESS;
}

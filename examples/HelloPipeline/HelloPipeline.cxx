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
#include "itkImage.h"

int main(int argc, char * argv[]) {
  // Create the pipeline for parsing arguments. Provide a description.
  itk::wasm::Pipeline pipeline("A hello world itk::wasm::Pipeline", argc, argv);

  // Add a flag to the pipeline.
  bool quiet = false;
  pipeline.add_flag("-q,--quiet", quiet, "Do not print image information");

  constexpr unsigned int Dimension = 2;
  using PixelType = unsigned char;
  using ImageType = itk::Image<PixelType, Dimension>;

  // Add a input image argument.
  using InputImageType = itk::wasm::InputImage<ImageType>;
  InputImageType inputImage;
  pipeline.add_option("InputImage", inputImage, "The input image")->required();

  // Parse the arguments. If `-q` or `--quiet` is set, the `quiet` variable will be set to `true`.
  // The `inputImage` variable is populated from the filesystem if built as a native executable.
  // When running in the browser or in a wrapped language, `inputImage` is read from WebAssembly memory without file IO.
  ITK_WASM_PARSE(pipeline);

  std::cout << "Hello pipeline world!\n" << std::endl;

  if (!quiet)
  {
    // Obtain the itk::Image * from the itk::wasm::InputImage with `.Get()`.
    std::cout << "Input image: " << *inputImage.Get() << std::endl;
  }

  return EXIT_SUCCESS;
}

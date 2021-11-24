/*=========================================================================
 *
 *  Copyright NumFOCUS
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *=========================================================================*/
#include "itkTestingMacros.h"
#include "itkPipeline.h"
#include <vector>
#include "itkImage.h"
#include "itkInputImage.h"
#include "itkWASMOutputImage.h"

int
itkPipelineTest(int argc, char * argv[])
{

  itk::wasm::Pipeline pipeline("A test ITK WASM Pipeline", argc, argv);

  std::string example_string_option = "default";
  pipeline.add_option("-s,--string", example_string_option, "A help string");

  int example_int_option = 3;
  pipeline.add_option("-i,--int", example_int_option, "Example int option");

  double example_double_option = 3.5;
  pipeline.add_option("-d,--double", example_double_option, "Example double option");

  std::vector<double> example_vector_double_option = {3.5, 8.8};
  pipeline.add_option("-v,--vector", example_vector_double_option, "Example double vector option");

  bool flag = false;
  pipeline.add_flag("-f,--flag", flag, "A flag");

  constexpr unsigned int Dimension = 2;
  using PixelType = float;
  using ImageType = itk::Image<PixelType, Dimension>;

  using InputImageType = itk::wasm::InputImage<ImageType>;
  InputImageType inputImage;
  pipeline.add_option("inputImage", inputImage, "The inputImage")->required();

  using WASMOutputImageType = itk::WASMOutputImage<ImageType>;
  // WASMOutputImageType::Pointer inputImage;
  WASMOutputImageType outputImage;
  pipeline.add_option("outputImage", outputImage, "The outputImage")->required();

  ITK_WASM_PARSE(pipeline, argc, argv);

  outputImage.SetImage(inputImage.GetImage());

  return EXIT_SUCCESS;
}

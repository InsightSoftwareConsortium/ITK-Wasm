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
#include "itkImage.h"
#include "itkInputImage.h"
#include "itkOutputImage.h"
#include "itkWASMImage.h"
#include "itkImageToWASMImageFilter.h"
#include "itkWASMExports.h"
#include <cstring>

#include "itkImageFileReader.h"

int
itkPipelineMemoryIOTest(int argc, char * argv[])
{
  constexpr unsigned int Dimension = 2;
  using PixelType = float;
  using ImageType = itk::Image<PixelType, Dimension>;

  const char * inputImageFile = argv[2];
  auto readInputImage = itk::ReadImage<ImageType>(inputImageFile);
  using ImageToWASMImageFilterType = itk::ImageToWASMImageFilter<ImageType>;
  auto imageToWASMImageFilter = ImageToWASMImageFilterType::New();
  imageToWASMImageFilter->SetInput(readInputImage);
  imageToWASMImageFilter->Update();
  auto readWASMImage = imageToWASMImageFilter->GetOutput();

  auto readWASMImageData = reinterpret_cast< const void * >(readWASMImage->GetImage()->GetBufferPointer());
  const auto readWASMImageDataSize = readWASMImage->GetImage()->GetPixelContainer()->Size();
  const size_t readWASMImageDataPointerAddress = itk_wasm_input_array_alloc(0, 0, readWASMImageDataSize);
  auto readWASMImageDataPointer = reinterpret_cast< void * >(readWASMImageDataPointerAddress);
  std::memcpy(readWASMImageDataPointer, readWASMImageData, readWASMImageDataSize);

  // auto direction = reinterpret_cast< const void * >( readWASMImage->GetImage()->GetDirection().GetVnlMatrix().begin() );
  // const auto directionSize = readWASMImage->GetImage()->GetDirection().GetVnlMatrix().size() * sizeof(double);
  // const size_t readWASMImageDirectionPointerAddress = itk_wasm_array_alloc(0, 1, directionSize);
  // auto readWASMImageDirectionPointer = reinterpret_cast< void * >(readWASMImageDirectionPointerAddress);
  // std::memcpy(readWASMImageDirectionPointer, direction, directionSize);

  auto readImageJSON = readWASMImage->GetJSON();
  void * readWASMImagePointer = reinterpret_cast< void * >( itk_wasm_input_json_alloc(0, readImageJSON.size()));
  std::memcpy(readWASMImagePointer, readImageJSON.data(), readImageJSON.size());

  const char * mockArgv[] = {"itkPipelineMemoryIOTest", "--memory-io", "0", "0", NULL};
  itk::wasm::Pipeline pipeline("A test ITK WASM Pipeline", 4, const_cast< char ** >(mockArgv));

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

  using InputImageType = itk::wasm::InputImage<ImageType>;
  InputImageType inputImage;
  pipeline.add_option("inputImage", inputImage, "The inputImage")->required();

  using OutputImageType = itk::wasm::OutputImage<ImageType>;
  OutputImageType outputImage;
  pipeline.add_option("outputImage", outputImage, "The outputImage")->required();

  ITK_WASM_PARSE(pipeline);

  outputImage.Set(inputImage.Get());

  return EXIT_SUCCESS;
}

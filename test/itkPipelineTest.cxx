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
#include "itkOutputImage.h"
#include "itkInputTextStream.h"
#include "itkOutputTextStream.h"
#include "itkInputBinaryStream.h"
#include "itkOutputBinaryStream.h"
#include "itkInputMesh.h"
#include "itkOutputMesh.h"
#include "itkMesh.h"

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
  using MeshType = itk::Mesh<PixelType, 3>;

  using InputImageType = itk::wasm::InputImage<ImageType>;
  InputImageType inputImage;
  pipeline.add_option("InputImage", inputImage, "The input image")->required();

  using OutputImageType = itk::wasm::OutputImage<ImageType>;
  OutputImageType outputImage;
  pipeline.add_option("OutputImage", outputImage, "The output image")->required();

  itk::wasm::InputTextStream inputTextStream;
  pipeline.add_option("InputText", inputTextStream, "The input text")->required();

  itk::wasm::OutputTextStream outputTextStream;
  pipeline.add_option("OutputText", outputTextStream, "The output text")->required();

  itk::wasm::InputBinaryStream inputBinaryStream;
  pipeline.add_option("InputBinary", inputBinaryStream, "The input text")->required();

  using InputImageType = itk::wasm::InputImage<ImageType>;
  itk::wasm::OutputBinaryStream outputBinaryStream;
  pipeline.add_option("OutputBinary", outputBinaryStream, "The output binary")->required();

  using InputMeshType = itk::wasm::InputMesh<MeshType>;
  InputMeshType inputMesh;
  pipeline.add_option("InputMesh", inputMesh, "The input mesh")->required();

  using OutputMeshType = itk::wasm::OutputMesh<MeshType>;
  OutputMeshType outputMesh;
  pipeline.add_option("OutputMesh", outputMesh, "The output mesh")->required();

  ITK_WASM_PARSE(pipeline);

  outputImage.Set(inputImage.Get());

  const std::string inputTextStreamContent{ std::istreambuf_iterator<char>(inputTextStream.Get()),
                                            std::istreambuf_iterator<char>() };
  ITK_TEST_EXPECT_TRUE(inputTextStreamContent == "test 123\n");

  outputTextStream.Get() << inputTextStreamContent;

  const std::string inputBinaryStreamContent{ std::istreambuf_iterator<char>(inputBinaryStream.Get()),
                                            std::istreambuf_iterator<char>() };
  ITK_TEST_EXPECT_TRUE(inputBinaryStreamContent == "test 123\n");

  outputBinaryStream.Get() << inputBinaryStreamContent;

  outputMesh.Set(inputMesh.Get());

  return EXIT_SUCCESS;
}

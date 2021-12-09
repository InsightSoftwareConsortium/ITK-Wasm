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
#include "itkInputTextStream.h"
#include "itkOutputTextStream.h"
#include "itkInputBinaryStream.h"
#include "itkOutputBinaryStream.h"
#include "itkWASMImage.h"
#include "itkImageToWASMImageFilter.h"
#include "itkWASMMesh.h"
#include "itkMeshToWASMMeshFilter.h"
#include "itkWASMExports.h"
#include <cstring>
#include "itkInputMesh.h"
#include "itkOutputMesh.h"
#include "itkMesh.h"
#include "itkInputPolyData.h"
#include "itkPolyData.h"
#include "itkPolyDataToWASMPolyDataFilter.h"
#include "itkOutputPolyData.h"

#include "itkImageFileReader.h"
#include "itkMeshFileReader.h"
#include "itkMeshToPolyDataFilter.h"
#include "itkPolyDataToMeshFilter.h"

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
  const size_t readWASMImageDataPointerAddress = itk_wasm_input_array_alloc(0, 0, 0, readWASMImageDataSize);
  auto readWASMImageDataPointer = reinterpret_cast< void * >(readWASMImageDataPointerAddress);
  std::memcpy(readWASMImageDataPointer, readWASMImageData, readWASMImageDataSize);

  // auto direction = reinterpret_cast< const void * >( readWASMImage->GetImage()->GetDirection().GetVnlMatrix().begin() );
  // const auto directionSize = readWASMImage->GetImage()->GetDirection().GetVnlMatrix().size() * sizeof(double);
  // const size_t readWASMImageDirectionPointerAddress = itk_wasm_array_alloc(0, 0, 1, directionSize);
  // auto readWASMImageDirectionPointer = reinterpret_cast< void * >(readWASMImageDirectionPointerAddress);
  // std::memcpy(readWASMImageDirectionPointer, direction, directionSize);

  auto readImageJSON = readWASMImage->GetJSON();
  void * readWASMImagePointer = reinterpret_cast< void * >( itk_wasm_input_json_alloc(0, 0, readImageJSON.size()));
  std::memcpy(readWASMImagePointer, readImageJSON.data(), readImageJSON.size());

  std::ifstream mockTextFStream( argv[4] );
  const std::string mockTextStream{ std::istreambuf_iterator<char>(mockTextFStream),
                                    std::istreambuf_iterator<char>() };
  const size_t textStreamInputAddress = itk_wasm_input_array_alloc(0, 2, 0, mockTextStream.size());
  auto textStreamInputPointer = reinterpret_cast< void * >(textStreamInputAddress);
  std::memcpy(textStreamInputPointer, mockTextStream.data(), mockTextStream.size());

  std::ostringstream textStreamStream;
  textStreamStream << "{ \"data\": \"data:application/vnd.itk.address,0:";
  textStreamStream << textStreamInputAddress;
  textStreamStream << "\", \"size\": ";
  textStreamStream << mockTextStream.size();
  textStreamStream << "}";
  void * textStreamInputJSONPointer = reinterpret_cast< void * >( itk_wasm_input_json_alloc(0, 2, textStreamStream.str().size()));
  std::memcpy(textStreamInputJSONPointer, textStreamStream.str().data(), textStreamStream.str().size());

  const size_t binaryStreamInputAddress = itk_wasm_input_array_alloc(0, 1, 0, mockTextStream.size());
  auto binaryStreamInputPointer = reinterpret_cast< void * >(textStreamInputAddress);
  std::memcpy(binaryStreamInputPointer, mockTextStream.data(), mockTextStream.size());

  void * binaryStreamInputJSONPointer = reinterpret_cast< void * >( itk_wasm_input_json_alloc(0, 1, textStreamStream.str().size()));
  std::memcpy(binaryStreamInputJSONPointer, textStreamStream.str().data(), textStreamStream.str().size());

  const char * inputMeshFile = argv[8];
  using MeshType = itk::Mesh<float, 3>;
  using MeshReaderType = itk::MeshFileReader<MeshType>;
  auto meshReader = MeshReaderType::New();
  meshReader->SetFileName(inputMeshFile);
  meshReader->Update();
  auto readInputMesh = meshReader->GetOutput();
  using MeshToWASMMeshFilterType = itk::MeshToWASMMeshFilter<MeshType>;
  auto meshToWASMMeshFilter = MeshToWASMMeshFilterType::New();
  meshToWASMMeshFilter->SetInput(readInputMesh);
  meshToWASMMeshFilter->Update();
  auto readWASMMesh = meshToWASMMeshFilter->GetOutput();

  auto readMeshJSON = readWASMMesh->GetJSON();
  void * readWASMMeshPointer = reinterpret_cast< void * >( itk_wasm_input_json_alloc(0, 3, readMeshJSON.size()));
  std::memcpy(readWASMMeshPointer, readMeshJSON.data(), readMeshJSON.size());

  using PolyDataType = itk::PolyData<float>;
  using MeshToPolyDataFilterType = itk::MeshToPolyDataFilter<MeshType>;
  auto meshToPolyData = MeshToPolyDataFilterType::New();
  meshToPolyData->SetInput(meshReader->GetOutput());
  using PolyDataToWASMPolyDataFilterType = itk::PolyDataToWASMPolyDataFilter<PolyDataType>;
  auto polyDataToWASMPolyDataFilter = PolyDataToWASMPolyDataFilterType::New();
  polyDataToWASMPolyDataFilter->SetInput(meshToPolyData->GetOutput());
  polyDataToWASMPolyDataFilter->Update();
  auto readWASMPolyData = polyDataToWASMPolyDataFilter->GetOutput();

  auto readPolyDataJSON = readWASMPolyData->GetJSON();
  void * readWASMPolyDataPointer = reinterpret_cast< void * >( itk_wasm_input_json_alloc(0, 4, readPolyDataJSON.size()));
  std::memcpy(readWASMPolyDataPointer, readPolyDataJSON.data(), readPolyDataJSON.size());

  const char * mockArgv[] = {"itkPipelineMemoryIOTest", "--memory-io", "0", "0", "1", "1", "2", "2", "3", "3", "4", "4", NULL};
  itk::wasm::Pipeline pipeline("A test ITK WASM Pipeline", 12, const_cast< char ** >(mockArgv));

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

  itk::wasm::InputTextStream inputTextStream;
  pipeline.add_option("InputText", inputTextStream, "The input text")->required();

  itk::wasm::OutputTextStream outputTextStream;
  pipeline.add_option("OutputText", outputTextStream, "The output text")->required();

  itk::wasm::InputBinaryStream inputBinaryStream;
  pipeline.add_option("InputBinary", inputBinaryStream, "The input text")->required();

  itk::wasm::OutputBinaryStream outputBinaryStream;
  pipeline.add_option("OutputBinary", outputBinaryStream, "The output binary")->required();

  using InputMeshType = itk::wasm::InputMesh<MeshType>;
  InputMeshType inputMesh;
  pipeline.add_option("InputMesh", inputMesh, "The input mesh")->required();

  using OutputMeshType = itk::wasm::OutputMesh<MeshType>;
  OutputMeshType outputMesh;
  pipeline.add_option("OutputMesh", outputMesh, "The output mesh")->required();

  using InputPolyDataType = itk::wasm::InputPolyData<PolyDataType>;
  InputPolyDataType inputPolyData;
  pipeline.add_option("InputPolyData", inputPolyData, "The input polydata")->required();

  using OutputPolyDataType = itk::wasm::OutputPolyData<PolyDataType>;
  OutputPolyDataType outputPolyData;
  pipeline.add_option("OutputPolyData", outputPolyData, "The output polydata")->required();

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

  outputPolyData.Set(inputPolyData.Get());

  return EXIT_SUCCESS;
}

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
#include "itkPolyDataToWASMPolyDataFilter.h"
#include "itkWASMPolyDataToPolyDataFilter.h"

#include "itkMesh.h"
#include "itkPolyData.h"
#include "itkMeshFileReader.h"
#include "itkMeshFileWriter.h"
#include "itkTestingMacros.h"
#include "itkMeshToPolyDataFilter.h"
#include "itkPolyDataToMeshFilter.h"

int
itkWASMPolyDataInterfaceTest(int argc, char * argv[])
{
  if (argc < 3)
  {
    std::cerr << "Missing parameters" << std::endl;
    std::cerr << "Usage: " << itkNameOfTestExecutableMacro(argv) << " InputMesh OutputMesh" << std::endl;
    return EXIT_FAILURE;
  }
  const char * inputMeshFile = argv[1];
  const char * outputMeshFile = argv[2];

  constexpr unsigned int Dimension = 3;
  using PixelType = unsigned char;
  using MeshType = itk::Mesh<PixelType, Dimension>;
  using MeshPointer = MeshType::Pointer;

  using PolyDataType = itk::PolyData<PixelType>;

  using ReaderType = itk::MeshFileReader<MeshType>;
  auto reader = ReaderType::New();
  reader->SetFileName(inputMeshFile);
  ITK_TRY_EXPECT_NO_EXCEPTION(reader->Update());
  MeshPointer inputMesh = reader->GetOutput();
  std::cout << "inputMesh: " << inputMesh << std::endl;

  using MeshToPolyDataType = itk::MeshToPolyDataFilter<MeshType>;
  auto meshToPolyData = MeshToPolyDataType::New();
  meshToPolyData->SetInput(inputMesh);
  meshToPolyData->Update();
  auto inputPolyData = meshToPolyData->GetOutput();
  std::cout << "inputPolyData: ";
  inputPolyData->Print(std::cout);

  using PolyDataToWASMPolyDataFilterType = itk::PolyDataToWASMPolyDataFilter<PolyDataType>;
  auto polyDataToWASMFilter = PolyDataToWASMPolyDataFilterType::New();
  polyDataToWASMFilter->SetInput(inputPolyData);
  ITK_TRY_EXPECT_NO_EXCEPTION(polyDataToWASMFilter->Update());
  auto polyDataWASM = polyDataToWASMFilter->GetOutput();

  std::cout << "PolyData JSON: " << polyDataWASM->GetJSON() << std::endl;

  using WASMPolyDataToPolyDataFilterType = itk::WASMPolyDataToPolyDataFilter<PolyDataType>;
  auto wasmToPolyDataFilter = WASMPolyDataToPolyDataFilterType::New();
  wasmToPolyDataFilter->SetInput(polyDataWASM);
  ITK_TRY_EXPECT_NO_EXCEPTION(wasmToPolyDataFilter->Update());
  PolyDataType::Pointer convertedPolyData = wasmToPolyDataFilter->GetOutput();
  std::cout << "convertedPolyData: " << convertedPolyData << std::endl;

  using PolyDataToMeshType = itk::PolyDataToMeshFilter<PolyDataType>;
  auto polyDataToMesh = PolyDataToMeshType::New();
  polyDataToMesh->SetInput(convertedPolyData);

  using WriterType = itk::MeshFileWriter<MeshType>;
  auto writer = WriterType::New();
  writer->SetFileName(outputMeshFile);
  writer->SetInput(polyDataToMesh->GetOutput());
  ITK_TRY_EXPECT_NO_EXCEPTION(writer->Update());

  return EXIT_SUCCESS;
}

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
#include "itkMeshToWASMMeshFilter.h"
#include "itkWASMMeshToMeshFilter.h"

#include "itkMesh.h"
#include "itkMeshFileReader.h"
#include "itkMeshFileWriter.h"
#include "itkTestingMacros.h"

int
itkWASMMeshInterfaceTest(int argc, char * argv[])
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

  using ReaderType = itk::MeshFileReader<MeshType>;
  auto reader = ReaderType::New();
  reader->SetFileName(inputMeshFile);
  ITK_TRY_EXPECT_NO_EXCEPTION(reader->Update());
  MeshPointer inputMesh = reader->GetOutput();
  std::cout << "inputMesh: " << inputMesh << std::endl;

  using MeshToWASMMeshFilterType = itk::MeshToWASMMeshFilter<MeshType>;
  auto meshToJSONFilter = MeshToWASMMeshFilterType::New();
  meshToJSONFilter->SetInput(inputMesh);
  ITK_TRY_EXPECT_NO_EXCEPTION(meshToJSONFilter->Update());
  auto meshJSON = meshToJSONFilter->GetOutput();

  std::cout << "Mesh JSON: " << meshJSON->GetJSON() << std::endl;

  using WASMMeshToMeshFilterType = itk::WASMMeshToMeshFilter<MeshType>;
  auto jsonToMeshFilter = WASMMeshToMeshFilterType::New();
  jsonToMeshFilter->SetInput(meshJSON);
  ITK_TRY_EXPECT_NO_EXCEPTION(jsonToMeshFilter->Update());
  MeshType::Pointer convertedMesh = jsonToMeshFilter->GetOutput();
  std::cout << "convertedMesh: " << convertedMesh << std::endl;

  using WriterType = itk::MeshFileWriter<MeshType>;
  auto writer = WriterType::New();
  writer->SetFileName(outputMeshFile);
  writer->SetInput(convertedMesh);
  ITK_TRY_EXPECT_NO_EXCEPTION(writer->Update());

  return EXIT_SUCCESS;
}

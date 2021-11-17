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
#include "itkJSONFromMesh.h"
#include "itkMeshFromJSON.h"

#include "itkMesh.h"
#include "itkMeshFileReader.h"
#include "itkMeshFileWriter.h"
#include "itkTestingMacros.h"

int
itkJSONMeshInterfaceTest(int argc, char * argv[])
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

  const std::string imageInterface = itk::JSONFromMesh<MeshType>(inputMesh);
  std::cout << "imageInterface: " << imageInterface << std::endl;
/*
  MeshType::Pointer convertedMesh = itk::MeshFromJSON<MeshType>(imageInterface);
  std::cout << "convertedMesh: " << convertedMesh << std::endl;

  ITK_TRY_EXPECT_NO_EXCEPTION(itk::WriteMesh(convertedMesh, outputMeshFile));
  */

  return EXIT_SUCCESS;
}

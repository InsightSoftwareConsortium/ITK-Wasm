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
#include "itkWasmMeshIOFactory.h"
#include "itkWasmMeshIO.h"
#include "itkMeshFileReader.h"
#include "itkMeshFileWriter.h"
#include "itkTestingMacros.h"
#include "itkMesh.h"

int
itkWasmMeshIOTest(int argc, char * argv[])
{
  if (argc < 6)
  {
    std::cerr << "Missing parameters" << std::endl;
    std::cerr << "Usage: " << itkNameOfTestExecutableMacro(argv) << " InputMesh MeshDirectory ConvertedDirectory MeshZip ConvertedZip" << std::endl;
    return EXIT_FAILURE;
  }
  const char * inputMeshFile = argv[1];
  const char * meshDirectory = argv[2];
  const char * convertedDirectoryFile = argv[3];
  const char * meshZip = argv[4];
  const char * convertedZipFile = argv[5];

  itk::WasmMeshIOFactory::RegisterOneFactory();

  constexpr unsigned int Dimension = 3;
  using PixelType = unsigned char;
  using MeshType = itk::Mesh<PixelType, Dimension>;
  using MeshPointer = MeshType::Pointer;

  using ReaderType = itk::MeshFileReader<MeshType>;
  auto meshReader = ReaderType::New(); 
  meshReader->SetFileName(inputMeshFile);
  ITK_TRY_EXPECT_NO_EXCEPTION(meshReader->Update());
  auto inputMesh = meshReader->GetOutput();
  std::cout << "inputMesh: " << inputMesh << std::endl;
  inputMesh->Print(std::cout);

  auto meshIO = itk::WasmMeshIO::New();

  using WriterType = itk::MeshFileWriter<MeshType>;
  auto wasmWriter = WriterType::New();
  //wasmWriter->SetMeshIO( meshIO );
  wasmWriter->SetFileName( meshDirectory );
  wasmWriter->SetInput( inputMesh );

  ITK_TRY_EXPECT_NO_EXCEPTION(wasmWriter->Update());

  auto wasmReader = ReaderType::New();
  //wasmReader->SetMeshIO( meshIO );
  wasmReader->SetFileName( meshDirectory );

  ITK_TRY_EXPECT_NO_EXCEPTION(wasmReader->Update());

  auto meshWriter = WriterType::New();
  meshWriter->SetInput(wasmReader->GetOutput());
  meshWriter->SetFileName(convertedDirectoryFile);
  ITK_TRY_EXPECT_NO_EXCEPTION(meshWriter->Update());

  wasmWriter->SetFileName( meshZip );
  ITK_TRY_EXPECT_NO_EXCEPTION(wasmWriter->Update());

  wasmReader->SetFileName( meshZip );
  ITK_TRY_EXPECT_NO_EXCEPTION(wasmReader->Update());

  meshWriter->SetFileName(convertedZipFile);
  ITK_TRY_EXPECT_NO_EXCEPTION(meshWriter->Update());

  return EXIT_SUCCESS;
}

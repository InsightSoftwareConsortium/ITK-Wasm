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
#include "itkMeshFileReader.h"
#include "itkMeshFileWriter.h"
#include "itkMesh.h"

int main( int argc, char * argv[] )
{
  if( argc < 3 )
    {
    std::cerr << "Usage: " << argv[0] << " <inputMesh> <outputMesh> " << std::endl;
    return EXIT_FAILURE;
    }
  const char * inputMeshFile = argv[1];
  const char * outputMeshFile = argv[2];

  using PixelType = float;
  constexpr unsigned int Dimension = 3;
  using MeshType = itk::Mesh< PixelType, Dimension >;

  using ReaderType = itk::MeshFileReader< MeshType >;
  auto reader = ReaderType::New();
  reader->SetFileName( inputMeshFile );

  using WriterType = itk::MeshFileWriter< MeshType >;
  auto writer = WriterType::New();
  writer->SetInput( reader->GetOutput() );
  writer->SetFileName( outputMeshFile );

  try
    {
      reader->Update();
      std::cout << "reader output cell buffer size: " << reader->GetOutput()->GetNumberOfCells() << std::endl;
    writer->Update();
    }
  catch( itk::ExceptionObject & error )
    {
    std::cerr << "Error: " << error << std::endl;
    return EXIT_FAILURE;
    }

  return EXIT_SUCCESS;
}

/*=========================================================================
 *
 *  Copyright Insight Software Consortium
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
#include "itkMesh.h"
#include "itkMeshToVTKUnstructuredGridFilter.h"
#include "vtkGeometryFilter.h"
#include "vtkJSONDataSetWriter.h"
#include "vtkArchiver.h"
#include "vtkNew.h"

int main( int argc, char * argv[] )
{
  if( argc < 3 )
    {
    std::cerr << "Usage: " << argv[0] << " <inputMesh> <outputPolyData> " << std::endl;
    return EXIT_FAILURE;
    }
  const char * inputMeshFile = argv[1];
  const char * outputPolyDataFile = argv[2];

  using PixelType = float;
  constexpr unsigned int Dimension = 3;
  using MeshType = itk::Mesh< PixelType, Dimension >;
  using MeshReaderType = itk::MeshFileReader< MeshType >;
  MeshReaderType::Pointer meshReader = MeshReaderType::New();
  meshReader->SetFileName( inputMeshFile );

  using ConverterType = itk::MeshToVTKUnstructuredGridFilter< MeshType >;
  ConverterType::Pointer converter = ConverterType::New();
  converter->SetInput( meshReader->GetOutput() );

  try
    {
    converter->Update();

    vtkNew< vtkGeometryFilter > geometryFilter;
    geometryFilter->SetInputData( converter->GetOutput() );

    vtkNew<vtkArchiver> archiver;
    archiver->SetArchiveName(outputPolyDataFile);
    vtkNew<vtkJSONDataSetWriter> writer;
    writer->SetArchiver(archiver);
    writer->SetInputConnection( geometryFilter->GetOutputPort() );
    writer->Update();
    }
  catch( const std::exception & error )
    {
    std::cerr << "Error: " << error.what() << std::endl;
    return EXIT_FAILURE;
    }

  return EXIT_SUCCESS;
}

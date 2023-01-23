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
#include "itkCommonEnums.h"
#include "itkMeshIOBase.h"
#include "itkMesh.h"
#include "itkInputMeshIO.h"

#ifndef MESH_IO_CLASS
#error "MESH_IO_CLASS definition must be provided"
#endif

#if MESH_IO_CLASS == 0
#include "itkBYUMeshIO.h"
#elif MESH_IO_CLASS == 1
#include "itkFreeSurferAsciiMeshIO.h"
#elif MESH_IO_CLASS == 2
#include "itkFreeSurferBinaryMeshIO.h"
#elif MESH_IO_CLASS == 3
#include "itkVTKPolyDataMeshIO.h"
#elif MESH_IO_CLASS == 4
#include "itkOBJMeshIO.h"
#elif MESH_IO_CLASS == 5
#include "itkOFFMeshIO.h"
#elif MESH_IO_CLASS == 6
#include "itkSTLMeshIO.h"
#elif MESH_IO_CLASS == 7
#include "itkSWCMeshIO.h"
#elif MESH_IO_CLASS == 8
#elif MESH_IO_CLASS == 9
#include "itkWasmZstdMeshIO.h"
#elif MESH_IO_CLASS == 21
#elif MESH_IO_CLASS == 22
#include "itkWasmZstdMeshIO.h"
#else
#error "Unsupported MESH_IO_CLASS"
#endif
#include "itkWasmMeshIO.h"

#include "itkPipeline.h"
#include "itkOutputMesh.h"
#include "itkWasmMeshIOBase.h"
#include "itkMeshIOBase.h"

template <typename TMeshIO>
int writeMesh(itk::wasm::InputMeshIO & inputMeshIO, const std::string & outputFileName, bool quiet, bool useCompression, bool binaryFileType)
{
  using MeshIOType = TMeshIO;

  auto meshIO = MeshIOType::New();
  meshIO->SetUseCompression(useCompression);
  if (binaryFileType)
  {
    meshIO->SetFileTypeToBinary();
  }
  meshIO->SetByteOrderToLittleEndian();

  if(!meshIO->CanWriteFile(outputFileName.c_str()))
  {
    if(!quiet)
    {
      std::cerr << "Could not write file: " << outputFileName << std::endl;
    }
    return EXIT_FAILURE;
  }

  meshIO->SetFileName(outputFileName);

  const itk::WasmMeshIOBase * inputWasmMeshIOBase = inputMeshIO.Get();
  const itk::MeshIOBase * inputMeshIOBase = inputWasmMeshIOBase->GetMeshIO();

  const unsigned int dimension = inputMeshIOBase->GetPointDimension();
  meshIO->SetPointDimension(dimension);
  meshIO->SetPointComponentType(inputMeshIOBase->GetPointComponentType());
  meshIO->SetPointPixelType(inputMeshIOBase->GetPointPixelType());
  meshIO->SetPointPixelComponentType(inputMeshIOBase->GetPointPixelComponentType());
  meshIO->SetNumberOfPointPixelComponents(inputMeshIOBase->GetNumberOfPointPixelComponents());
  meshIO->SetCellComponentType(inputMeshIOBase->GetCellComponentType());
  meshIO->SetCellPixelType(inputMeshIOBase->GetCellPixelType());
  meshIO->SetCellPixelComponentType(inputMeshIOBase->GetCellPixelComponentType());
  meshIO->SetNumberOfCellPixelComponents(inputMeshIOBase->GetNumberOfCellPixelComponents());
  meshIO->SetNumberOfPoints(inputMeshIOBase->GetNumberOfPoints());
  if (meshIO->GetNumberOfPoints())
  {
    meshIO->SetUpdatePoints(true);
  }
  meshIO->SetNumberOfPointPixels(inputMeshIOBase->GetNumberOfPointPixels());
  if (meshIO->GetNumberOfPointPixels())
  {
    meshIO->SetUpdatePointData(true);
  }
  meshIO->SetNumberOfCells(inputMeshIOBase->GetNumberOfCells());
  if (meshIO->GetNumberOfCells())
  {
    meshIO->SetUpdateCells(true);
  }
  meshIO->SetNumberOfCellPixels(inputMeshIOBase->GetNumberOfCellPixels());
  if (meshIO->GetNumberOfCellPixels())
  {
    meshIO->SetUpdateCellData(true);
  }
  meshIO->SetCellBufferSize(inputMeshIOBase->GetCellBufferSize());

  meshIO->WriteMeshInformation();

  if (meshIO->GetNumberOfPoints())
  {
    meshIO->WritePoints( reinterpret_cast< void * >( const_cast< char * >(&(inputWasmMeshIOBase->GetPointsContainer()->at(0))) ));
  }
  if (meshIO->GetNumberOfCells())
  {
    meshIO->WriteCells( reinterpret_cast< void * >( const_cast< char * >(&(inputWasmMeshIOBase->GetCellsContainer()->at(0))) ));
  }
  if (meshIO->GetNumberOfPointPixels())
  {
    meshIO->WritePointData( reinterpret_cast< void * >( const_cast< char * >(&(inputWasmMeshIOBase->GetPointDataContainer()->at(0))) ));
  }
  if (meshIO->GetNumberOfCellPixels())
  {
    meshIO->WriteCellData( reinterpret_cast< void * >( const_cast< char * >(&(inputWasmMeshIOBase->GetCellDataContainer()->at(0))) ));
  }

  meshIO->Write();

  return EXIT_SUCCESS;
}

int main (int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("write-mesh", "Write an mesh in the itk-wasm file format to another file format", argc, argv);

  itk::wasm::InputMeshIO inputMeshIO;
  pipeline.add_option("input-mesh", inputMeshIO, "Input mesh")->required();

  std::string outputFileName;
  pipeline.add_option("output-mesh", outputFileName, "Output mesh")->required();

  bool quiet = false;
  pipeline.add_flag("-q,--quiet", quiet, "Less verbose output");

  bool useCompression = false;
  pipeline.add_flag("-c,--use-compression", quiet, "Use compression in the written file, if supported");

  bool binaryFileType = false;
  pipeline.add_flag("-b,--binary-file-type", quiet, "Use a binary file type in the written file, if supported");

  ITK_WASM_PARSE(pipeline);

#if MESH_IO_CLASS == 0
  return writeMesh<itk::BYUMeshIO>(inputMeshIO, outputFileName, quiet, useCompression, binaryFileType);
#elif MESH_IO_CLASS == 1
  return writeMesh<itk::FreeSurferAsciiMeshIO>(inputMeshIO, outputFileName, quiet, useCompression, binaryFileType);
#elif MESH_IO_CLASS == 2
  return writeMesh<itk::FreeSurferBinaryMeshIO>(inputMeshIO, outputFileName, quiet, useCompression, binaryFileType);
#elif MESH_IO_CLASS == 3
  return writeMesh<itk::VTKPolyDataMeshIO>(inputMeshIO, outputFileName, quiet, useCompression, binaryFileType);
#elif MESH_IO_CLASS == 4
  return writeMesh<itk::OBJMeshIO>(inputMeshIO, outputFileName, quiet, useCompression, binaryFileType);
#elif MESH_IO_CLASS == 5
  return writeMesh<itk::OFFMeshIO>(inputMeshIO, outputFileName, quiet, useCompression, binaryFileType);
#elif MESH_IO_CLASS == 6
  return writeMesh<itk::STLMeshIO>(inputMeshIO, outputFileName, quiet, useCompression, binaryFileType);
#elif MESH_IO_CLASS == 7
  return writeMesh<itk::SWCMeshIO>(inputMeshIO, outputFileName, quiet, useCompression, binaryFileType);
#elif MESH_IO_CLASS == 8
  return writeMesh<itk::WasmMeshIO>(inputMeshIO, outputFileName, quiet, useCompression, binaryFileType);
#elif MESH_IO_CLASS == 9
  return writeMesh<itk::WasmZstdMeshIO>(inputMeshIO, outputFileName, quiet, useCompression, binaryFileType);
#else
#error "Unsupported MESH_IO_CLASS"
#endif
  return EXIT_SUCCESS;
}

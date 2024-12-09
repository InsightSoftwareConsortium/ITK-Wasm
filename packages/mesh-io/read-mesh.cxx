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
#include "itkOutputMeshIO.h"
#include "itkOutputTextStream.h"

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
#elif MESH_IO_CLASS == 10
#include "itkMZ3MeshIO.h"
#else
#error "Unsupported MESH_IO_CLASS"
#endif
#include "itkWasmMeshIO.h"

#define VALUE(string) #string
#define TO_LITERAL(string) VALUE(string)

#include "itkPipeline.h"
#include "itkOutputMesh.h"

template <typename TMeshIO>
int readMesh(const std::string & inputFileName, itk::wasm::OutputTextStream & couldRead, itk::wasm::OutputMeshIO & outputMeshIO, bool informationOnly)
{
  using MeshIOType = TMeshIO;

  auto meshIO = MeshIOType::New();

  outputMeshIO.SetInformationOnly(informationOnly);

  if (meshIO->CanReadFile(inputFileName.c_str()))
  {
    couldRead.Get() << "true\n";
  }
  else
  {
    couldRead.Get() << "false\n";
    return EXIT_FAILURE;
  }

  meshIO->SetFileName(inputFileName);
  outputMeshIO.Set(meshIO);

  return EXIT_SUCCESS;
}

int main (int argc, char * argv[])
{
  const char * pipelineName = TO_LITERAL(MESH_IO_KEBAB_NAME) "-read-mesh";
  itk::wasm::Pipeline pipeline(pipelineName, "Read a mesh file format and convert it to the itk-wasm file format", argc, argv);

  std::string inputFileName;
  pipeline.add_option("serialized-mesh", inputFileName, "Input mesh serialized in the file format")->required()->check(CLI::ExistingFile)->type_name("INPUT_BINARY_FILE");

  itk::wasm::OutputTextStream couldRead;
  pipeline.add_option("could-read", couldRead, "Whether the input could be read. If false, the output mesh is not valid.")->required()->type_name("OUTPUT_JSON");

  itk::wasm::OutputMeshIO outputMeshIO;
  pipeline.add_option("mesh", outputMeshIO, "Output mesh")->required()->type_name("OUTPUT_MESH");

  bool informationOnly = false;
  pipeline.add_flag("-i,--information-only", informationOnly, "Only read mesh metadata -- do not read pixel data.");

  ITK_WASM_PARSE(pipeline);

#if MESH_IO_CLASS == 0
  return readMesh<itk::BYUMeshIO>(inputFileName, couldRead, outputMeshIO, informationOnly);
#elif MESH_IO_CLASS == 1
  return readMesh<itk::FreeSurferAsciiMeshIO>(inputFileName, couldRead, outputMeshIO, informationOnly);
#elif MESH_IO_CLASS == 2
  return readMesh<itk::FreeSurferBinaryMeshIO>(inputFileName, couldRead, outputMeshIO, informationOnly);
#elif MESH_IO_CLASS == 3
  return readMesh<itk::VTKPolyDataMeshIO>(inputFileName, couldRead, outputMeshIO, informationOnly);
#elif MESH_IO_CLASS == 4
  return readMesh<itk::OBJMeshIO>(inputFileName, couldRead, outputMeshIO, informationOnly);
#elif MESH_IO_CLASS == 5
  return readMesh<itk::OFFMeshIO>(inputFileName, couldRead, outputMeshIO, informationOnly);
#elif MESH_IO_CLASS == 6
  return readMesh<itk::STLMeshIO>(inputFileName, couldRead, outputMeshIO, informationOnly);
#elif MESH_IO_CLASS == 7
  return readMesh<itk::SWCMeshIO>(inputFileName, couldRead, outputMeshIO, informationOnly);
#elif MESH_IO_CLASS == 8
  return readMesh<itk::WasmMeshIO>(inputFileName, couldRead, outputMeshIO, informationOnly);
#elif MESH_IO_CLASS == 9
  return readMesh<itk::WasmZstdMeshIO>(inputFileName, couldRead, outputMeshIO, informationOnly);
#elif MESH_IO_CLASS == 10
  return readMesh<itk::MZ3MeshIO>(inputFileName, couldRead, outputMeshIO, informationOnly);
#else
#error "Unsupported MESH_IO_CLASS"
#endif
  return EXIT_SUCCESS;
}

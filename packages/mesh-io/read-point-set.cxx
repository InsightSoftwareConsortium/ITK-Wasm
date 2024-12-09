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
#include "itkOutputPointSetIO.h"
#include "itkOutputTextStream.h"

#ifndef MESH_IO_CLASS
#error "MESH_IO_CLASS definition must be provided"
#endif

#if MESH_IO_CLASS == 0
#include "itkVTKPolyDataMeshIO.h"
#elif MESH_IO_CLASS == 1
#include "itkOBJMeshIO.h"
#elif MESH_IO_CLASS == 2
#include "itkOFFMeshIO.h"
#elif MESH_IO_CLASS == 3
#elif MESH_IO_CLASS == 4
#include "itkWasmZstdMeshIO.h"
#elif MESH_IO_CLASS == 5
#include "itkMZ3MeshIO.h"
#else
#error "Unsupported MESH_IO_CLASS"
#endif
#include "itkWasmMeshIO.h"

#define VALUE(string) #string
#define TO_LITERAL(string) VALUE(string)

#include "itkPipeline.h"

template <typename TMeshIO>
int readPointSet(const std::string & inputFileName, itk::wasm::OutputTextStream & couldRead, itk::wasm::OutputPointSetIO & pointSetIO, bool informationOnly)
{
  using MeshIOType = TMeshIO;

  auto meshIO = MeshIOType::New();

  pointSetIO.SetInformationOnly(informationOnly);

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
  pointSetIO.Set(meshIO);

  return EXIT_SUCCESS;
}

int main (int argc, char * argv[])
{
  const char * pipelineName = TO_LITERAL(POINT_SET_IO_KEBAB_NAME) "-read-point-set";
  itk::wasm::Pipeline pipeline(pipelineName, "Read a point set file format and convert it to the itk-wasm file format", argc, argv);

  std::string inputFileName;
  pipeline.add_option("serialized-point-set", inputFileName, "Input point set serialized in the file format")->required()->check(CLI::ExistingFile)->type_name("INPUT_BINARY_FILE");

  itk::wasm::OutputTextStream couldRead;
  pipeline.add_option("could-read", couldRead, "Whether the input could be read. If false, the output point set is not valid.")->required()->type_name("OUTPUT_JSON");

  itk::wasm::OutputPointSetIO pointSetIO;
  pipeline.add_option("point-set", pointSetIO, "Output point set")->required()->type_name("OUTPUT_POINT_SET");

  bool informationOnly = false;
  pipeline.add_flag("-i,--information-only", informationOnly, "Only read point set metadata -- do not read pixel data.");

  ITK_WASM_PARSE(pipeline);

#if MESH_IO_CLASS == 0
  return readPointSet<itk::VTKPolyDataMeshIO>(inputFileName, couldRead, pointSetIO, informationOnly);
#elif MESH_IO_CLASS == 1
  return readPointSet<itk::OBJMeshIO>(inputFileName, couldRead, pointSetIO, informationOnly);
#elif MESH_IO_CLASS == 2
  return readPointSet<itk::OFFMeshIO>(inputFileName, couldRead, pointSetIO, informationOnly);
#elif MESH_IO_CLASS == 3
  return readPointSet<itk::WasmMeshIO>(inputFileName, couldRead, pointSetIO, informationOnly);
#elif MESH_IO_CLASS == 4
  return readPointSet<itk::WasmZstdMeshIO>(inputFileName, couldRead, pointSetIO, informationOnly);
#elif MESH_IO_CLASS == 5
  return readPointSet<itk::MZ3MeshIO>(inputFileName, couldRead, pointSetIO, informationOnly);
#else
#error "Unsupported MESH_IO_CLASS"
#endif
  return EXIT_SUCCESS;
}

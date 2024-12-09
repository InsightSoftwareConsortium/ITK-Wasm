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
#include "itkInputPointSetIO.h"
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
#include "itkWasmPointSetIOBase.h"
#include "itkMeshIOBase.h"

template <typename TMeshIO>
int writePointSet(itk::wasm::InputPointSetIO &inputPointSetIO, itk::wasm::OutputTextStream &couldWrite, const std::string &outputFileName, bool informationOnly, bool useCompression, bool binaryFileType)
{
  using MeshIOType = TMeshIO;

  auto meshIO = MeshIOType::New();

  if (meshIO->CanWriteFile(outputFileName.c_str()))
  {
    couldWrite.Get() << "true\n";
  }
  else
  {
    couldWrite.Get() << "false\n";
    return EXIT_FAILURE;
  }

  meshIO->SetUseCompression(useCompression);
  if (binaryFileType)
  {
    meshIO->SetFileTypeToBinary();
  }
  meshIO->SetByteOrderToLittleEndian();

  meshIO->SetFileName(outputFileName);

  const itk::WasmPointSetIOBase *inputWasmPointSetIOBase = inputPointSetIO.Get();
  const itk::MeshIOBase *inputPointSetIOBase = inputWasmPointSetIOBase->GetMeshIO();

  const unsigned int dimension = inputPointSetIOBase->GetPointDimension();
  meshIO->SetPointDimension(dimension);
  meshIO->SetPointComponentType(inputPointSetIOBase->GetPointComponentType());
  meshIO->SetPointPixelType(inputPointSetIOBase->GetPointPixelType());
  meshIO->SetPointPixelComponentType(inputPointSetIOBase->GetPointPixelComponentType());
  meshIO->SetNumberOfPointPixelComponents(inputPointSetIOBase->GetNumberOfPointPixelComponents());
  meshIO->SetNumberOfPoints(inputPointSetIOBase->GetNumberOfPoints());
  if (meshIO->GetNumberOfPoints())
  {
    meshIO->SetUpdatePoints(true);
  }
  meshIO->SetNumberOfPointPixels(inputPointSetIOBase->GetNumberOfPointPixels());
  if (meshIO->GetNumberOfPointPixels())
  {
    meshIO->SetUpdatePointData(true);
  }

  meshIO->WriteMeshInformation();

  if (!informationOnly)
  {
    if (meshIO->GetNumberOfPoints())
    {
      meshIO->WritePoints(reinterpret_cast<void *>(const_cast<char *>(&(inputWasmPointSetIOBase->GetPointsContainer()->at(0)))));
    }
    if (meshIO->GetNumberOfPointPixels())
    {
      meshIO->WritePointData(reinterpret_cast<void *>(const_cast<char *>(&(inputWasmPointSetIOBase->GetPointDataContainer()->at(0)))));
    }

    meshIO->Write();
  }

  return EXIT_SUCCESS;
}

int main(int argc, char *argv[])
{
  const char *pipelineName = TO_LITERAL(POINT_SET_IO_KEBAB_NAME) "-write-point-set";
  itk::wasm::Pipeline pipeline(pipelineName, "Write an ITK-Wasm file format converted to a point set file format", argc, argv);

  itk::wasm::InputPointSetIO inputPointSetIO;
  pipeline.add_option("point-set", inputPointSetIO, "Input point set")->required()->type_name("INPUT_POINT_SET");

  itk::wasm::OutputTextStream couldWrite;
  pipeline.add_option("could-write", couldWrite, "Whether the input could be written. If false, the output mesh is not valid.")->type_name("OUTPUT_JSON");

  std::string outputFileName;
  pipeline.add_option("serialized-point-set", outputFileName, "Output point set")->required()->type_name("OUTPUT_BINARY_FILE");
  ;

  bool informationOnly = false;
  pipeline.add_flag("-i,--information-only", informationOnly, "Only write point set metadata -- do not write pixel data.");

  bool useCompression = false;
  pipeline.add_flag("-c,--use-compression", useCompression, "Use compression in the written file, if supported");

  bool binaryFileType = false;
  pipeline.add_flag("-b,--binary-file-type", binaryFileType, "Use a binary file type in the written file, if supported");

  ITK_WASM_PARSE(pipeline);

#if MESH_IO_CLASS == 0
  return writePointSet<itk::VTKPolyDataMeshIO>(inputPointSetIO, couldWrite, outputFileName, informationOnly, useCompression, binaryFileType);
#elif MESH_IO_CLASS == 1
  return writePointSet<itk::OBJMeshIO>(inputPointSetIO, couldWrite, outputFileName, informationOnly, useCompression, binaryFileType);
#elif MESH_IO_CLASS == 2
  return writePointSet<itk::OFFMeshIO>(inputPointSetIO, couldWrite, outputFileName, informationOnly, useCompression, binaryFileType);
#elif MESH_IO_CLASS == 3
  return writePointSet<itk::WasmMeshIO>(inputPointSetIO, couldWrite, outputFileName, informationOnly, useCompression, binaryFileType);
#elif MESH_IO_CLASS == 4
  return writePointSet<itk::WasmZstdMeshIO>(inputPointSetIO, couldWrite, outputFileName, informationOnly, useCompression, binaryFileType);
#elif MESH_IO_CLASS == 5
  return writePointSet<itk::MZ3MeshIO>(inputPointSetIO, couldWrite, outputFileName, informationOnly, useCompression, binaryFileType);
#else
#error "Unsupported MESH_IO_CLASS"
#endif
  return EXIT_SUCCESS;
}

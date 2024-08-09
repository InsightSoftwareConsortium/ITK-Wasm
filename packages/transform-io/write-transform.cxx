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
#include "itkTransformIOBase.h"
#include "itkTransform.h"
#include "itkInputTransformIO.h"
#include "itkOutputTextStream.h"

#ifndef TRANSFORM_IO_CLASS
#error "TRANSFORM_IO_CLASS definition must be provided"
#endif

#if TRANSFORM_IO_CLASS == 0
#include "itkHDF5TransformIO.h"
#elif TRANSFORM_IO_CLASS == 1
#include "itkTxtTransformIO.h"
#elif TRANSFORM_IO_CLASS == 2
#include "itkMatlabTransformIO.h"
#elif TRANSFORM_IO_CLASS == 3
#include "itkMINCTransformIO.h"
#elif TRANSFORM_IO_CLASS == 4
#elif TRANSFORM_IO_CLASS == 5
#include "itkWasmZstdTransformIO.h"
#else
#error "Unsupported TRANSFORM_IO_CLASS"
#endif
#include "itkWasmTransformIO.h"

#define VALUE(string) #string
#define TO_LITERAL(string) VALUE(string)

#include "itkPipeline.h"
#include "itkOutputTransform.h"
#include "itkWasmTransformIOBase.h"
#include "itkTransformIOBase.h"

template <typename TTransformIO>
int writeTransform(itk::wasm::Pipeline & pipeline)
{
  using TransformIOType = TTransformIO;
  using ParametersValueType = typename TransformIOType::ParametersValueType;

  itk::wasm::InputTransformIO<ParametersValueType> inputTransformIO;
  pipeline.add_option("transform", inputTransformIO, "Input transform")->required()->type_name("INPUT_TRANSFORM");

  itk::wasm::OutputTextStream couldWrite;
  pipeline.add_option("could-write", couldWrite, "Whether the input could be written. If false, the output transform is not valid.")->type_name("OUTPUT_JSON");

  std::string outputFileName;
  pipeline.add_option("serialized-transform", outputFileName, "Output transform serialized in the file format.")->required()->type_name("OUTPUT_BINARY_FILE");

  bool useCompression = false;
  pipeline.add_flag("-c,--use-compression", useCompression, "Use compression in the written file");

  ITK_WASM_PARSE(pipeline);

  auto transformIO = TransformIOType::New();

  if (transformIO->CanWriteFile(outputFileName.c_str()))
  {
    couldWrite.Get() << "true\n";
  }
  else
  {
    couldWrite.Get() << "false\n";
    return EXIT_FAILURE;
  }

  transformIO->SetFileName(outputFileName);
  transformIO->SetUseCompression(useCompression);

  using WasmTransformIOType = itk::WasmTransformIOBase<ParametersValueType>;
  WasmTransformIOType * inputWasmTransformIOBase = const_cast<WasmTransformIOType *>(inputTransformIO.Get());
  using TransformIOBaseType = itk::TransformIOBaseTemplate<ParametersValueType>;
  TransformIOBaseType * inputTransformIOBase = const_cast<TransformIOBaseType *>(inputWasmTransformIOBase->GetTransformIO());

  transformIO->SetTransformList(*(reinterpret_cast<typename TransformIOType::ConstTransformListType *>(&(inputTransformIOBase->GetTransformList()))));
  ITK_WASM_CATCH_EXCEPTION(pipeline, transformIO->Write());

  return EXIT_SUCCESS;
}

int main (int argc, char * argv[])
{
  const char * pipelineName = TO_LITERAL(TRANSFORM_IO_KEBAB_NAME) "-write-transform";
  itk::wasm::Pipeline pipeline(pipelineName, "Write an ITK-Wasm transform file format converted to a transform file format", argc, argv);

  bool floatParameters = false;
  pipeline.add_flag("-f,--float-parameters", floatParameters, "Use float for the parameter value type. The default is double.");

  ITK_WASM_PRE_PARSE(pipeline);

#if TRANSFORM_IO_CLASS == 0
  if (floatParameters)
  {
    return writeTransform<itk::HDF5TransformIOTemplate<float>>(pipeline);
  }
  else
  {
    return writeTransform<itk::HDF5TransformIOTemplate<double>>(pipeline);
  }
#elif TRANSFORM_IO_CLASS == 1
  if (floatParameters)
  {
    return writeTransform<itk::TxtTransformIOTemplate<float>>(pipeline);
  }
  else
  {
    return writeTransform<itk::TxtTransformIOTemplate<double>>(pipeline);
  }
#elif TRANSFORM_IO_CLASS == 2
  if (floatParameters)
  {
    return writeTransform<itk::MatlabTransformIOTemplate<float>>(pipeline);
  }
  else
  {
    return writeTransform<itk::MatlabTransformIOTemplate<double>>(pipeline);
  }
#elif TRANSFORM_IO_CLASS == 3
  if (floatParameters)
  {
    return writeTransform<itk::MINCTransformIOTemplate<float>>(pipeline);
  }
  else
  {
    return writeTransform<itk::MINCTransformIOTemplate<double>>(pipeline);
  }
#elif TRANSFORM_IO_CLASS == 4
  if (floatParameters)
  {
    return writeTransform<itk::WasmTransformIOTemplate<float>>(pipeline);
  }
  else
  {
    return writeTransform<itk::WasmTransformIOTemplate<double>>(pipeline);
  }
#elif TRANSFORM_IO_CLASS == 5
  if (floatParameters)
  {
    return writeTransform<itk::WasmZstdTransformIOTemplate<float>>(pipeline);
  }
  else
  {
    return writeTransform<itk::WasmZstdTransformIOTemplate<double>>(pipeline);
  }
#else
#error "Unsupported TRANSFORM_IO_CLASS"
#endif
  return EXIT_SUCCESS;
}
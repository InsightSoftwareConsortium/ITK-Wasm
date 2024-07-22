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
#include "itkOutputTransformIO.h"
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

template <typename TTransformIO>
int readTransform(itk::wasm::Pipeline & pipeline, const std::string & inputFileName, itk::wasm::OutputTextStream & couldRead)
{
  using TransformIOType = TTransformIO;
  using ParametersValueType = typename TransformIOType::ParametersValueType;

  pipeline.get_option("serialized-transform")->required()->check(CLI::ExistingFile)->type_name("INPUT_BINARY_FILE");

  itk::wasm::OutputTransformIO<ParametersValueType> outputTransformIO;
  pipeline.add_option("transform", outputTransformIO, "Output transform")->required()->type_name("OUTPUT_TRANSFORM");

  ITK_WASM_PARSE(pipeline);

  auto transformIO = TransformIOType::New();

  if (transformIO->CanReadFile(inputFileName.c_str()))
  {
    couldRead.Get() << "true\n";
  }
  else
  {
    couldRead.Get() << "false\n";
    return EXIT_FAILURE;
  }

  transformIO->SetFileName(inputFileName);
  outputTransformIO.Set(transformIO);

  return EXIT_SUCCESS;
}

int main (int argc, char * argv[])
{
  const char * pipelineName = TO_LITERAL(TRANSFORM_IO_KEBAB_NAME) "-read-transform";
  itk::wasm::Pipeline pipeline(pipelineName, "Read an transform file format and convert it to the ITK-Wasm transform file format", argc, argv);

  std::string inputFileName;
  pipeline.add_option("serialized-transform", inputFileName, "Input transform serialized in the file format");

  itk::wasm::OutputTextStream couldRead;
  pipeline.add_option("could-read", couldRead, "Whether the input could be read. If false, the output transform is not valid.")->required()->type_name("OUTPUT_JSON");

  bool floatParameters = false;
  pipeline.add_flag("-f,--float-parameters", floatParameters, "Use float for the parameter value type. The default is double.");

  ITK_WASM_PRE_PARSE(pipeline);

#if TRANSFORM_IO_CLASS == 0
  if (floatParameters)
  {
    return readTransform<itk::HDF5TransformIOTemplate<float>>(pipeline, inputFileName, couldRead);
  }
  else
  {
    return readTransform<itk::HDF5TransformIOTemplate<double>>(pipeline, inputFileName, couldRead);
  }
#elif TRANSFORM_IO_CLASS == 1
  if (floatParameters)
  {
    return readTransform<itk::TxtTransformIOTemplate<float>>(pipeline, inputFileName, couldRead);
  }
  else
  {
    return readTransform<itk::TxtTransformIOTemplate<double>>(pipeline, inputFileName, couldRead);
  }
#elif TRANSFORM_IO_CLASS == 2
  if (floatParameters)
  {
    return readTransform<itk::MatlabTransformIOTemplate<float>>(pipeline, inputFileName, couldRead);
  }
  else
  {
    return readTransform<itk::MatlabTransformIOTemplate<double>>(pipeline, inputFileName, couldRead);
  }
#elif TRANSFORM_IO_CLASS == 3
  if (floatParameters)
  {
    return readTransform<itk::MINCTransformIOTemplate<float>>(pipeline, inputFileName, couldRead);
  }
  else
  {
    return readTransform<itk::MINCTransformIOTemplate<double>>(pipeline, inputFileName, couldRead);
  }
#elif TRANSFORM_IO_CLASS == 4
  if (floatParameters)
  {
    return readTransform<itk::WasmTransformIOTemplate<float>>(pipeline, inputFileName, couldRead);
  }
  else
  {
    return readTransform<itk::WasmTransformIOTemplate<double>>(pipeline, inputFileName, couldRead);
  }
#elif TRANSFORM_IO_CLASS == 5
  if (floatParameters)
  {
    return readTransform<itk::WasmZstdTransformIOTemplate<float>>(pipeline, inputFileName, couldRead);
  }
  else
  {
    return readTransform<itk::WasmZstdTransformIOTemplate<double>>(pipeline, inputFileName, couldRead);
  }
#else
#error "Unsupported TRANSFORM_IO_CLASS"
#endif
  return EXIT_SUCCESS;
}
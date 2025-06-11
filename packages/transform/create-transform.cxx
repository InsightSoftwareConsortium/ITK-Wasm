/*=========================================================================

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

#include "itkPipeline.h"
#include "itkOutputTransform.h"
#include "itkTransformJSON.h"
#include "itkWasmTransform.h"
#include "itkInputTextStream.h"

template <typename TParameterValues>
int CreateTransformParameterValues(
  itk::wasm::Pipeline & pipeline,
  const std::string & inputFileName,
  itk::wasm::OutputTextStream & outputStream)
{
  using TransformType = itk::Transform<TParameterValues, 3, 3>;
}

int
main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("create-transform", "Create a spatial transformation.", argc, argv);

  itk::wasm::InputTextStream transformType;
  pipeline.add_option("transform-type", transformType, "Desired TransformType")->type_name("INPUT_JSON");

  ITK_WASM_PRE_PARSE(pipeline);

  const std::string transformTypeString(std::istreambuf_iterator<char>(transformType.Get()), {});
  auto deserializedAttempt = glz::read_json<itk::TransformTypeJSON>(transformTypeString);
  if (!deserializedAttempt)
  {
    const std::string descriptiveError = glz::format_error(deserializedAttempt, transformTypeString);
    std::cerr << "Failed to deserialize transform type: " << descriptiveError << std::endl;
    return EXIT_FAILURE;
  }
  const auto transformType = deserializedAttempt.value();


  return EXIT_SUCCESS;
}

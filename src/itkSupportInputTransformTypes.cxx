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
#include "itkSupportInputTransformTypes.h"
#include "itkWasmExports.h"

#include "itkjsonFromIOComponentEnum.h"
#include "itkjsonFromIOPixelEnum.h"
#include "itkTransformJSON.h"

namespace itk
{

bool
lexical_cast(const std::string & input, TransformTypeJSON & transformType)
{
  if (wasm::Pipeline::get_use_memory_io())
  {
#ifndef ITK_WASM_NO_MEMORY_IO
    const unsigned int index = std::stoi(input);
    auto               json = wasm::getMemoryStoreInputJSON(0, index);
    std::string        deserialized;
    auto               deserializedAttempt = glz::read_json<itk::TransformJSON>(json);
    if (!deserializedAttempt)
    {
      const std::string descriptiveError = glz::format_error(deserializedAttempt, json);
      throw std::runtime_error("Failed to deserialize TransformJSON: " + descriptiveError);
    }
    auto transformJSON = deserializedAttempt.value();
    transformType = transformJSON.transformType;
#else
    return false;
#endif
  }
  else
  {
#ifndef ITK_WASM_NO_FILESYSTEM_IO
    using TransformIOFactoryFloatType = itk::TransformIOFactoryTemplate<float>;
    TransformIOBaseTemplate<float>::Pointer transformIOFloat = TransformIOFactoryFloatType::CreateTransformIO(input.c_str(), CommonEnums::IOFileMode::ReadMode);
    if (transformIOFloat.IsNull())
    {
      std::cerr << "IO not available for: " << input << std::endl;
      return false;
    }

    transformIOFloat->SetFileName(input);
    transformIOFloat->Read();

    const auto transformList = transformIOFloat->GetReadTransformList();
    const auto firstTransform = transformList.front();
    const std::string transformName = firstTransform->GetTransformTypeAsString();
    // if the transformName contains "float", then set the transformType to float
    if (transformName.find("float") != std::string::npos)
    {
      transformType.parametersValueType = JSONFloatTypesEnum::float32;
    }
    else
    {
      transformType.parametersValueType = JSONFloatTypesEnum::float64;
    }
    transformType.inputDimension = firstTransform->GetInputSpaceDimension();
    transformType.outputDimension = firstTransform->GetOutputSpaceDimension();
    // transformType.transformParameterization = firstTransform->GetNameOfClass();
#else
    return false;
#endif
  }
  return true;
}

} // end namespace itk

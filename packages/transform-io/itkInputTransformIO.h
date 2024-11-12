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
#ifndef itkInputTransformIO_h
#define itkInputTransformIO_h

#include "itkPipeline.h"
#include "itkWasmTransformIOBase.h"
#include "itkWasmTransformIO.h"

#ifndef ITK_WASM_NO_MEMORY_IO
#include "itkWasmExports.h"
#endif
#ifndef ITK_WASM_NO_FILESYSTEM_IO
#endif

namespace itk
{
namespace wasm
{

/**
 *\class InputTransformIO
 * \brief Input transform for an itk::wasm::Pipeline from an itk::TransformIOBase
 *
 * This transform is read from the filesystem or memory when ITK_WASM_PARSE_ARGS is called.
 *
 * This class is for the WriteTransform ITK-Wasm pipeline. Most pipelines will use itk::wasm::InputTransform.
 *
 * \ingroup WebAssemblyInterface
 */
template <typename TParametersValueType>
class InputTransformIO
{
public:
  using ParametersValueType = TParametersValueType;
  using WasmTransformIOBaseType = WasmTransformIOBase<ParametersValueType>;

  void Set(const WasmTransformIOBaseType * transformIO) {
    this->m_WasmTransformIOBase = transformIO;
  }

  const WasmTransformIOBaseType * Get() const {
    return this->m_WasmTransformIOBase.GetPointer();
  }

  InputTransformIO() = default;
  ~InputTransformIO() = default;
protected:
  typename WasmTransformIOBaseType::ConstPointer m_WasmTransformIOBase;
};


template <typename TParametersValueType>
bool lexical_cast(const std::string &input, InputTransformIO<TParametersValueType> &inputTransformIO)
{
  using ParametersValueType = TParametersValueType;
  using WasmTransformIOType = itk::WasmTransformIOTemplate<ParametersValueType>;
  using WasmTransformIOBaseType = WasmTransformIOBase<ParametersValueType>;
  using FixedParametersType = typename WasmTransformIOType::FixedParametersType;

  if (input.empty())
  {
    return false;
  }

  if (wasm::Pipeline::get_use_memory_io())
  {
#ifndef ITK_WASM_NO_MEMORY_IO
    const unsigned int index = std::stoi(input);
    auto json = getMemoryStoreInputJSON(0, index);
    auto        deserializedAttempt = glz::read_json<itk::TransformListJSON>(json);
    if (!deserializedAttempt)
    {
      const std::string descriptiveError = glz::format_error(deserializedAttempt, json);
      throw std::runtime_error("Failed to deserialize TransformJSON: " + descriptiveError);
    }
    auto transformListJSON = deserializedAttempt.value();
    if (transformListJSON.size() < 1)
    {
      throw std::runtime_error("Expected at least one transform in the list");
    }

    auto wasmTransformIO = WasmTransformIOType::New();
    constexpr bool inMemory = true;
    wasmTransformIO->SetJSON(transformListJSON, inMemory);

    auto wasmTransformIOBase = WasmTransformIOBaseType::New();
    wasmTransformIOBase->SetTransformIO(wasmTransformIO, inMemory);

    inputTransformIO.Set(wasmTransformIOBase);
#else
    return false;
#endif
  }
  else
  {
#ifndef ITK_WASM_NO_FILESYSTEM_IO
    auto wasmTransformIO = WasmTransformIOType::New();
    wasmTransformIO->SetFileName(input);
    wasmTransformIO->Read();

    auto wasmTransformIOBase = WasmTransformIOBaseType::New();
    wasmTransformIOBase->SetTransformIO(wasmTransformIO);

    inputTransformIO.Set(wasmTransformIOBase);
#else
    return false;
#endif
  }
  return true;
}

} // end namespace wasm
} // end namespace itk

#endif

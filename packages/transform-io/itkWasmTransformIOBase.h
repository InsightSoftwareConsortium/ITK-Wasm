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
#ifndef itkWasmTransformIOBase_h
#define itkWasmTransformIOBase_h
#include "WebAssemblyInterfaceExport.h"

#include "itkTransformIOBase.h"

#include "itkWasmDataObject.h"
#include "itkTransformJSON.h"
#include "itkWasmTransformIO.h"

namespace itk
{
/**
 *\class WasmTransformIOBase
 * \brief JSON representation for an itk::TransformIOBase
 *
 * JSON representation for an itk::TransformIOBase for interfacing across programming languages and runtimes.
 *
 * Pixel and Direction binary array buffer's are stored as strings with memory addresses or paths on disks or a virtual filesystem.
 *
 * Arrays:
 *
 * - 0: FixedParameters 0 buffer
 * - 1: Parameters 0 buffer
 * - 2: FixedParameters 1 buffer
 * - 3: Parameters 1 buffer
 * - 4: FixedParameters 2 buffer
 * - 5: Parameters 2 buffer
 * [...]
 *
 * \ingroup WebAssemblyInterface
 */
template<typename TParametersValueType>
class WebAssemblyInterface_EXPORT WasmTransformIOBase : public WasmDataObject
{
public:
  using ParametersValueType = TParametersValueType;
  using TransformIOBaseType = itk::TransformIOBaseTemplate<ParametersValueType>;

  ITK_DISALLOW_COPY_AND_MOVE(WasmTransformIOBase);

  /** Standard class type aliases. */
  using Self = WasmTransformIOBase;
  using Superclass = WasmDataObject;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  using WasmTransformIOType = itk::WasmTransformIOTemplate<ParametersValueType>;
  using ConstTransformListType = typename WasmTransformIOType::ConstTransformListType;

  itkNewMacro(Self);
  /** Run-time type information (and related methods). */
  itkTypeMacro(WasmTransformIOBase, WasmDataObject);

  void SetTransformIO(TransformIOBaseType * transformIO, bool readTransform = true)
  {
    this->m_TransformIOBase = transformIO;
    if (!readTransform)
    {
      return;
    }

    auto wasmTransformIO = WasmTransformIOType::New();
    wasmTransformIO->SetTransformList(*(reinterpret_cast<ConstTransformListType *>(&(transformIO->GetTransformList()))));

    constexpr bool inMemory = true;
    auto transformJSON = wasmTransformIO->GetJSON(inMemory);

    std::string serialized{};
    auto ec = glz::write<glz::opts{ .prettify = true }>(transformJSON, serialized);
    if (ec)
    {
      itkExceptionMacro("Failed to serialize TransformListJSON");
    }
    this->SetJSON(serialized);
  }

  const TransformIOBaseType * GetTransformIO() const
  {
    return static_cast<const TransformIOBaseType *>(m_TransformIOBase.GetPointer());
  }

  const TransformListJSON & GetTransformListJSON() const
  {
    return this->m_TransformListJSON;
  }
  TransformListJSON & GetTransformListJSON()
  {
    return this->m_TransformListJSON;
  }

protected:
  WasmTransformIOBase() = default;
  ~WasmTransformIOBase() override = default;

  TransformListJSON m_TransformListJSON;

  TransformIOBaseType::ConstPointer m_TransformIOBase;
};

} // namespace itk

#endif

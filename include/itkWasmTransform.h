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
#ifndef itkWasmTransform_h
#define itkWasmTransform_h

#include "itkWasmDataObject.h"
#include "itkDataObjectDecorator.h"

namespace itk
{
/**
 *\class WasmTransform
 * \brief JSON representation for an itk::Transform
 *
 * JSON representation for an itk::Transform for interfacing across programming languages and runtimes.
 *
 * FixedParameters and Parameters binary array buffer's are stored as strings with memory addresses or paths on disks or a virtual filesystem.
 *
 * - 0: FixedParameters for transform 0
 * - 1: Parameters for transform 0
 * - 2: FixedParameters for transform 1
 * - 3: Parameters for transform 1
 * - 4: FixedParameters for transform 2
 * - 5: Parameters for transform 2
 * [...]
 * 
 * where multiple FixedParameters/Parameters pairs are present for CompositeTransform's.
 *
 * \ingroup WebAssemblyInterface
 */
template <typename TTransform>
class ITK_TEMPLATE_EXPORT WasmTransform : public WasmDataObject
{
public:
  ITK_DISALLOW_COPY_AND_MOVE(WasmTransform);

  /** Standard class type aliases. */
  using Self = WasmTransform;
  using Superclass = WasmDataObject;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  itkNewMacro(Self);
  /** Run-time type information (and related methods). */
  itkTypeMacro(WasmTransform, WasmDataObject);

  using TransformType = TTransform;
  using DecoratorType = DataObjectDecorator<TransformType>;

  void SetTransform(const TransformType * transform);

  const TransformType * GetTransform() const {
    return static_cast< const DecoratorType * >(this->GetDataObject())->Get();
  }

protected:
  WasmTransform()
  {}
  ~WasmTransform() override = default;

};

} // namespace itk

#ifndef ITK_MANUAL_INSTANTIATION
#  include "itkWasmTransform.hxx"
#endif

#endif

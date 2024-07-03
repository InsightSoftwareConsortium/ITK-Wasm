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
#ifndef itkTransformToWasmTransformFilter_hxx
#define itkTransformToWasmTransformFilter_hxx

#include "itkWasmMapComponentType.h"
#include "itkWasmMapPixelType.h"
#include "itkTransformJSON.h"

namespace itk
{

template <typename TTransform>
TransformToWasmTransformFilter<TTransform>
::TransformToWasmTransformFilter()
{
  this->SetNumberOfRequiredInputs(1);
  this->SetPrimaryInputName("Transform");

  typename WasmTransformType::Pointer output = static_cast<WasmTransformType *>(this->MakeOutput(0).GetPointer());
  this->ProcessObject::SetNumberOfRequiredOutputs(1);
  this->ProcessObject::SetNthOutput(0, output.GetPointer());
}

template <typename TTransform>
ProcessObject::DataObjectPointer
TransformToWasmTransformFilter<TTransform>
::MakeOutput(ProcessObject::DataObjectPointerArraySizeType)
{
  return WasmTransformType::New().GetPointer();
}

template <typename TTransform>
ProcessObject::DataObjectPointer
TransformToWasmTransformFilter<TTransform>
::MakeOutput(const ProcessObject::DataObjectIdentifierType &)
{
  return WasmTransformType::New().GetPointer();
}

template <typename TTransform>
auto
TransformToWasmTransformFilter<TTransform>
::GetOutput() -> WasmTransformType *
{
  // we assume that the first output is of the templated type
  return itkDynamicCastInDebugMode<WasmTransformType *>(this->GetPrimaryOutput());
}

template <typename TTransform>
auto
TransformToWasmTransformFilter<TTransform>
::GetOutput() const -> const WasmTransformType *
{
  // we assume that the first output is of the templated type
  return itkDynamicCastInDebugMode<const WasmTransformType *>(this->GetPrimaryOutput());
}

template <typename TTransform>
auto
TransformToWasmTransformFilter<TTransform>
::GetOutput(unsigned int idx) -> WasmTransformType *
{
  auto * out = dynamic_cast<WasmTransformType *>(this->ProcessObject::GetOutput(idx));

  if (out == nullptr && this->ProcessObject::GetOutput(idx) != nullptr)
  {
    itkWarningMacro(<< "Unable to convert output number " << idx << " to type " << typeid(WasmTransformType).name());
  }
  return out;
}

template <typename TTransform>
void
TransformToWasmTransformFilter<TTransform>
::GenerateData()
{
  // Get the input and output pointers
  const TransformType * transform = this->GetTransform();
  WasmTransformType * wasmTransform = this->GetOutput();

  wasmTransform->SetTransform(transform);

  using TransformType = TTransform;
  using ParametersValueType = typename TransformType::ParametersValueType;
  using TransformBaseType = TransformBaseTemplate<ParametersValueType>;
  std::list<typename TransformBaseType::ConstPointer> transformList { transform };
  constexpr bool inMemory = true;
  const TransformListJSON transformListJSON = transformListToTransformListJSON<TransformBaseType>(transformList, inMemory);

  std::string serialized{};
  auto ec = glz::write<glz::opts{ .prettify = true }>(transformListJSON, serialized);
  if (ec)
  {
    itkExceptionMacro("Failed to serialize TransformListJSON");
  }

  wasmTransform->SetJSON(serialized);
}

template <typename TTransform>
void
TransformToWasmTransformFilter<TTransform>
::PrintSelf(std::ostream & os, Indent indent) const
{
  Superclass::PrintSelf(os, indent);
}
} // end namespace itk

#endif

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
#ifndef itkPointSetToWasmPointSetFilter_hxx
#define itkPointSetToWasmPointSetFilter_hxx

#include "itkMetaDataDictionaryJSON.h"

#include "glaze/glaze.hpp"

namespace itk
{

template <typename TPointSet>
PointSetToWasmPointSetFilter<TPointSet>
::PointSetToWasmPointSetFilter()
{
  this->SetNumberOfRequiredInputs(1);

  typename WasmPointSetType::Pointer output = static_cast<WasmPointSetType *>(this->MakeOutput(0).GetPointer());
  this->ProcessObject::SetNumberOfRequiredOutputs(1);
  this->ProcessObject::SetNthOutput(0, output.GetPointer());
}

template <typename TPointSet>
ProcessObject::DataObjectPointer
PointSetToWasmPointSetFilter<TPointSet>
::MakeOutput(ProcessObject::DataObjectPointerArraySizeType)
{
  return WasmPointSetType::New().GetPointer();
}

template <typename TPointSet>
ProcessObject::DataObjectPointer
PointSetToWasmPointSetFilter<TPointSet>
::MakeOutput(const ProcessObject::DataObjectIdentifierType &)
{
  return WasmPointSetType::New().GetPointer();
}

template <typename TPointSet>
auto
PointSetToWasmPointSetFilter<TPointSet>
::GetOutput() -> WasmPointSetType *
{
  // we assume that the first output is of the templated type
  return itkDynamicCastInDebugMode<WasmPointSetType *>(this->GetPrimaryOutput());
}

template <typename TPointSet>
auto
PointSetToWasmPointSetFilter<TPointSet>
::GetOutput() const -> const WasmPointSetType *
{
  // we assume that the first output is of the templated type
  return itkDynamicCastInDebugMode<const WasmPointSetType *>(this->GetPrimaryOutput());
}

template <typename TPointSet>
auto
PointSetToWasmPointSetFilter<TPointSet>
::GetOutput(unsigned int idx) -> WasmPointSetType *
{
  auto * out = dynamic_cast<WasmPointSetType *>(this->ProcessObject::GetOutput(idx));

  if (out == nullptr && this->ProcessObject::GetOutput(idx) != nullptr)
  {
    itkWarningMacro(<< "Unable to convert output number " << idx << " to type " << typeid(WasmPointSetType).name());
  }
  return out;
}

template <typename TPointSet>
void
PointSetToWasmPointSetFilter<TPointSet>
::SetInput(const PointSetType * input)
{
  // Process object is not const-correct so the const_cast is required here
  this->ProcessObject::SetNthInput(0, const_cast<PointSetType *>(input));
}

template <typename TPointSet>
void
PointSetToWasmPointSetFilter<TPointSet>
::SetInput(unsigned int index, const PointSetType * pointSet)
{
  // Process object is not const-correct so the const_cast is required here
  this->ProcessObject::SetNthInput(index, const_cast<PointSetType *>(pointSet));
}

template <typename TPointSet>
const typename PointSetToWasmPointSetFilter<TPointSet>::PointSetType *
PointSetToWasmPointSetFilter<TPointSet>
::GetInput()
{
  return itkDynamicCastInDebugMode<const PointSetType *>(this->GetPrimaryInput());
}

template <typename TPointSet>
const typename PointSetToWasmPointSetFilter<TPointSet>::PointSetType *
PointSetToWasmPointSetFilter<TPointSet>
::GetInput(unsigned int idx)
{
  return itkDynamicCastInDebugMode<const TPointSet *>(this->ProcessObject::GetInput(idx));
}

template <typename TPointSet>
void
PointSetToWasmPointSetFilter<TPointSet>
::GenerateData()
{
  // Get the input and output pointers
  const PointSetType * pointSet = this->GetInput();
  WasmPointSetType * wasmPointSet = this->GetOutput();

  wasmPointSet->SetPointSet(pointSet);
  constexpr bool inMemory = true;
  const auto pointSetJSON = pointSetToPointSetJSON<PointSetType>(pointSet, wasmPointSet, inMemory);
  std::string serialized{};
  auto ec = glz::write<glz::opts{ .prettify = true }>(pointSetJSON, serialized);
  if (ec)
  {
    itkExceptionMacro("Failed to serialize PointSetJSON");
  }

  wasmPointSet->SetJSON(serialized);
}

template <typename TPointSet>
void
PointSetToWasmPointSetFilter<TPointSet>
::PrintSelf(std::ostream & os, Indent indent) const
{
  Superclass::PrintSelf(os, indent);
}
} // end namespace itk

#endif

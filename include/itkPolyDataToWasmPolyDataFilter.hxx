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
#ifndef itkPolyDataToWasmPolyDataFilter_hxx
#define itkPolyDataToWasmPolyDataFilter_hxx

#include "itkPolyDataToWasmPolyDataFilter.h"

#include "itkMeshConvertPixelTraits.h"

#include "itkWasmMapComponentType.h"
#include "itkWasmMapPixelType.h"

#include "itkPolyDataJSON.h"

namespace itk
{

template <typename TPolyData>
PolyDataToWasmPolyDataFilter<TPolyData>
::PolyDataToWasmPolyDataFilter()
{
  this->SetNumberOfRequiredInputs(1);

  typename WasmPolyDataType::Pointer output = static_cast<WasmPolyDataType *>(this->MakeOutput(0).GetPointer());
  this->ProcessObject::SetNumberOfRequiredOutputs(1);
  this->ProcessObject::SetNthOutput(0, output.GetPointer());
}

template <typename TPolyData>
ProcessObject::DataObjectPointer
PolyDataToWasmPolyDataFilter<TPolyData>
::MakeOutput(ProcessObject::DataObjectPointerArraySizeType)
{
  return WasmPolyDataType::New().GetPointer();
}

template <typename TPolyData>
ProcessObject::DataObjectPointer
PolyDataToWasmPolyDataFilter<TPolyData>
::MakeOutput(const ProcessObject::DataObjectIdentifierType &)
{
  return WasmPolyDataType::New().GetPointer();
}

template <typename TPolyData>
auto
PolyDataToWasmPolyDataFilter<TPolyData>
::GetOutput() -> WasmPolyDataType *
{
  // we assume that the first output is of the templated type
  return itkDynamicCastInDebugMode<WasmPolyDataType *>(this->GetPrimaryOutput());
}

template <typename TPolyData>
auto
PolyDataToWasmPolyDataFilter<TPolyData>
::GetOutput() const -> const WasmPolyDataType *
{
  // we assume that the first output is of the templated type
  return itkDynamicCastInDebugMode<const WasmPolyDataType *>(this->GetPrimaryOutput());
}

template <typename TPolyData>
auto
PolyDataToWasmPolyDataFilter<TPolyData>
::GetOutput(unsigned int idx) -> WasmPolyDataType *
{
  auto * out = dynamic_cast<WasmPolyDataType *>(this->ProcessObject::GetOutput(idx));

  if (out == nullptr && this->ProcessObject::GetOutput(idx) != nullptr)
  {
    itkWarningMacro(<< "Unable to convert output number " << idx << " to type " << typeid(WasmPolyDataType).name());
  }
  return out;
}

template <typename TPolyData>
void
PolyDataToWasmPolyDataFilter<TPolyData>
::SetInput(const PolyDataType * input)
{
  // Process object is not const-correct so the const_cast is required here
  this->ProcessObject::SetNthInput(0, const_cast<PolyDataType *>(input));
}

template <typename TPolyData>
void
PolyDataToWasmPolyDataFilter<TPolyData>
::SetInput(unsigned int index, const PolyDataType * polyData)
{
  // Process object is not const-correct so the const_cast is required here
  this->ProcessObject::SetNthInput(index, const_cast<PolyDataType *>(polyData));
}

template <typename TPolyData>
const typename PolyDataToWasmPolyDataFilter<TPolyData>::PolyDataType *
PolyDataToWasmPolyDataFilter<TPolyData>
::GetInput()
{
  return itkDynamicCastInDebugMode<const PolyDataType *>(this->GetPrimaryInput());
}

template <typename TPolyData>
const typename PolyDataToWasmPolyDataFilter<TPolyData>::PolyDataType *
PolyDataToWasmPolyDataFilter<TPolyData>
::GetInput(unsigned int idx)
{
  return itkDynamicCastInDebugMode<const TPolyData *>(this->ProcessObject::GetInput(idx));
}

template <typename TPolyData>
void
PolyDataToWasmPolyDataFilter<TPolyData>
::GenerateData()
{
  // Get the input and output pointers
  const PolyDataType * polyData = this->GetInput();
  WasmPolyDataType * wasmPolyData = this->GetOutput();

  wasmPolyData->SetPolyData(polyData);

  constexpr bool inMemory = true;
  const auto polyDataJSON = polyDataToPolyDataJSON<PolyDataType>(polyData, inMemory);
  std::string serialized{};
  auto ec = glz::write<glz::opts{ .prettify = true }>(polyDataJSON, serialized);
  if (ec)
  {
    itkExceptionMacro("Failed to serialize PolyDataJSON");
  }

  wasmPolyData->SetJSON(serialized);
}

template <typename TPolyData>
void
PolyDataToWasmPolyDataFilter<TPolyData>
::PrintSelf(std::ostream & os, Indent indent) const
{
  Superclass::PrintSelf(os, indent);
}
} // end namespace itk

#endif

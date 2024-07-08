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
#ifndef itkMeshToWasmMeshFilter_hxx
#define itkMeshToWasmMeshFilter_hxx

#include "glaze/glaze.hpp"

namespace itk
{

template <typename TMesh>
MeshToWasmMeshFilter<TMesh>
::MeshToWasmMeshFilter()
{
  this->SetNumberOfRequiredInputs(1);

  typename WasmMeshType::Pointer output = static_cast<WasmMeshType *>(this->MakeOutput(0).GetPointer());
  this->ProcessObject::SetNumberOfRequiredOutputs(1);
  this->ProcessObject::SetNthOutput(0, output.GetPointer());
}

template <typename TMesh>
ProcessObject::DataObjectPointer
MeshToWasmMeshFilter<TMesh>
::MakeOutput(ProcessObject::DataObjectPointerArraySizeType)
{
  return WasmMeshType::New().GetPointer();
}

template <typename TMesh>
ProcessObject::DataObjectPointer
MeshToWasmMeshFilter<TMesh>
::MakeOutput(const ProcessObject::DataObjectIdentifierType &)
{
  return WasmMeshType::New().GetPointer();
}

template <typename TMesh>
auto
MeshToWasmMeshFilter<TMesh>
::GetOutput() -> WasmMeshType *
{
  // we assume that the first output is of the templated type
  return itkDynamicCastInDebugMode<WasmMeshType *>(this->GetPrimaryOutput());
}

template <typename TMesh>
auto
MeshToWasmMeshFilter<TMesh>
::GetOutput() const -> const WasmMeshType *
{
  // we assume that the first output is of the templated type
  return itkDynamicCastInDebugMode<const WasmMeshType *>(this->GetPrimaryOutput());
}

template <typename TMesh>
auto
MeshToWasmMeshFilter<TMesh>
::GetOutput(unsigned int idx) -> WasmMeshType *
{
  auto * out = dynamic_cast<WasmMeshType *>(this->ProcessObject::GetOutput(idx));

  if (out == nullptr && this->ProcessObject::GetOutput(idx) != nullptr)
  {
    itkWarningMacro(<< "Unable to convert output number " << idx << " to type " << typeid(WasmMeshType).name());
  }
  return out;
}

template <typename TMesh>
void
MeshToWasmMeshFilter<TMesh>
::SetInput(const MeshType * input)
{
  // Process object is not const-correct so the const_cast is required here
  this->ProcessObject::SetNthInput(0, const_cast<MeshType *>(input));
}

template <typename TMesh>
void
MeshToWasmMeshFilter<TMesh>
::SetInput(unsigned int index, const MeshType * mesh)
{
  // Process object is not const-correct so the const_cast is required here
  this->ProcessObject::SetNthInput(index, const_cast<MeshType *>(mesh));
}

template <typename TMesh>
const typename MeshToWasmMeshFilter<TMesh>::MeshType *
MeshToWasmMeshFilter<TMesh>
::GetInput()
{
  return itkDynamicCastInDebugMode<const MeshType *>(this->GetPrimaryInput());
}

template <typename TMesh>
const typename MeshToWasmMeshFilter<TMesh>::MeshType *
MeshToWasmMeshFilter<TMesh>
::GetInput(unsigned int idx)
{
  return itkDynamicCastInDebugMode<const TMesh *>(this->ProcessObject::GetInput(idx));
}

template <typename TMesh>
void
MeshToWasmMeshFilter<TMesh>
::GenerateData()
{
  // Get the input and output pointers
  const MeshType * mesh = this->GetInput();
  WasmMeshType * wasmMesh = this->GetOutput();

  wasmMesh->SetMesh(mesh);
  constexpr bool inMemory = true;
  const auto meshJSON = meshToMeshJSON<MeshType>(mesh, wasmMesh, inMemory);
  std::string serialized{};
  auto ec = glz::write<glz::opts{ .prettify = true }>(meshJSON, serialized);
  if (ec)
  {
    itkExceptionMacro("Failed to serialize MeshJSON");
  }

  wasmMesh->SetJSON(serialized);
}

template <typename TMesh>
void
MeshToWasmMeshFilter<TMesh>
::PrintSelf(std::ostream & os, Indent indent) const
{
  Superclass::PrintSelf(os, indent);
}
} // end namespace itk

#endif

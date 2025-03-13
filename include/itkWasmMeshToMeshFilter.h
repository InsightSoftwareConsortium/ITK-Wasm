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
#ifndef itkWasmMeshToMeshFilter_h
#define itkWasmMeshToMeshFilter_h

#include "itkProcessObject.h"
#include "itkWasmMesh.h"

namespace itk
{
/**
 *\class WasmMeshToMeshFilter
 * \brief Convert an WasmMesh to a Mesh or QuadEdgeMesh object.
 *
 * TMesh must match the type stored in the JSON representation or an exception will be shown.
 *
 * \ingroup WebAssemblyInterface
 */
template <typename TMesh>
class ITK_TEMPLATE_EXPORT WasmMeshToMeshFilter : public ProcessObject
{
public:
  ITK_DISALLOW_COPY_AND_MOVE(WasmMeshToMeshFilter);

  /** Standard class type aliases. */
  using Self = WasmMeshToMeshFilter;
  using Superclass = ProcessObject;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  /** Method for creation through the object factory. */
  itkNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkOverrideGetNameOfClassMacro(WasmMeshToMeshFilter);

  using DataObjectIdentifierType = Superclass::DataObjectIdentifierType;
  using DataObjectPointerArraySizeType = Superclass::DataObjectPointerArraySizeType;

  using MeshType = TMesh;
  using WasmMeshType = WasmMesh<MeshType>;

  /** Set/Get the path input of this process object.  */
  using Superclass::SetInput;
  virtual void
  SetInput(const WasmMeshType * mesh);

  virtual void
  SetInput(unsigned int, const WasmMeshType * mesh);

  const WasmMeshType *
  GetInput();

  const WasmMeshType *
  GetInput(unsigned int idx);

  MeshType *
  GetOutput();
  const MeshType *
  GetOutput() const;

  MeshType *
  GetOutput(unsigned int idx);

protected:
  WasmMeshToMeshFilter();
  ~WasmMeshToMeshFilter() override = default;

  ProcessObject::DataObjectPointer
  MakeOutput(ProcessObject::DataObjectPointerArraySizeType idx) override;
  ProcessObject::DataObjectPointer
  MakeOutput(const ProcessObject::DataObjectIdentifierType &) override;

  void
  GenerateOutputInformation() override
  {} // do nothing
  void
  GenerateData() override;

  void
  PrintSelf(std::ostream & os, Indent indent) const override;
};

template <typename TPixel, unsigned int VDimension>
class ITK_TEMPLATE_EXPORT WasmMeshToMeshFilter<QuadEdgeMesh<TPixel, VDimension>> : public ProcessObject
{
public:
  ITK_DISALLOW_COPY_AND_MOVE(WasmMeshToMeshFilter);

  /** Standard class type aliases. */
  using Self = WasmMeshToMeshFilter;
  using Superclass = ProcessObject;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  /** Method for creation through the object factory. */
  itkNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkTypeMacro(WasmMeshToMeshFilter, ProcessObject);

  using DataObjectIdentifierType = Superclass::DataObjectIdentifierType;
  using DataObjectPointerArraySizeType = Superclass::DataObjectPointerArraySizeType;

  using MeshType = QuadEdgeMesh<TPixel, VDimension>;
  using WasmMeshType = WasmMesh<MeshType>;

  /** Set/Get the path input of this process object.  */
  using Superclass::SetInput;
  virtual void
  SetInput(const WasmMeshType * mesh);

  virtual void
  SetInput(unsigned int, const WasmMeshType * mesh);

  const WasmMeshType *
  GetInput();

  const WasmMeshType *
  GetInput(unsigned int idx);

  MeshType *
  GetOutput();
  const MeshType *
  GetOutput() const;

  MeshType *
  GetOutput(unsigned int idx);

protected:
  WasmMeshToMeshFilter();
  ~WasmMeshToMeshFilter() override = default;

  ProcessObject::DataObjectPointer
  MakeOutput(ProcessObject::DataObjectPointerArraySizeType idx) override;
  ProcessObject::DataObjectPointer
  MakeOutput(const ProcessObject::DataObjectIdentifierType &) override;

  void
  GenerateOutputInformation() override
  {} // do nothing
  void
  GenerateData() override;

  void
  PrintSelf(std::ostream & os, Indent indent) const override;
};
} // end namespace itk

#ifndef ITK_MANUAL_INSTANTIATION
#  include "itkWasmMeshToMeshFilter.hxx"
#endif

#endif

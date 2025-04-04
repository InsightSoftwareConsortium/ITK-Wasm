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
#ifndef itkMeshToWasmMeshFilter_h
#define itkMeshToWasmMeshFilter_h

#include "itkProcessObject.h"
#include "itkWasmMesh.h"
#include "itkMeshJSON.h"
#include "itkQuadEdgeMesh.h"

namespace itk
{
/**
 *\class MeshToWasmMeshFilter
 * \brief Convert an Mesh to an WasmMesh object.
 *
 * \ingroup WebAssemblyInterface
 */
template <typename TMesh>
class ITK_TEMPLATE_EXPORT MeshToWasmMeshFilter : public ProcessObject
{
public:
  ITK_DISALLOW_COPY_AND_MOVE(MeshToWasmMeshFilter);

  /** Standard class type aliases. */
  using Self = MeshToWasmMeshFilter;
  using Superclass = ProcessObject;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  /** Method for creation through the object factory. */
  itkNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkOverrideGetNameOfClassMacro(MeshToWasmMeshFilter);

  using DataObjectIdentifierType = Superclass::DataObjectIdentifierType;
  using DataObjectPointerArraySizeType = Superclass::DataObjectPointerArraySizeType;

  using MeshType = TMesh;
  using WasmMeshType = WasmMesh<MeshType>;

  /** Set/Get the path input of this process object.  */
  using Superclass::SetInput;
  virtual void
  SetInput(const MeshType * mesh);

  virtual void
  SetInput(unsigned int, const MeshType * mesh);

  const MeshType *
  GetInput();

  const MeshType *
  GetInput(unsigned int idx);

  WasmMeshType *
  GetOutput();
  const WasmMeshType *
  GetOutput() const;

  WasmMeshType *
  GetOutput(unsigned int idx);

protected:
  MeshToWasmMeshFilter();
  ~MeshToWasmMeshFilter() override = default;

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
class ITK_TEMPLATE_EXPORT MeshToWasmMeshFilter<QuadEdgeMesh<TPixel, VDimension>> : public ProcessObject
{
public:
  ITK_DISALLOW_COPY_AND_MOVE(MeshToWasmMeshFilter);

  /** Standard class type aliases. */
  using Self = MeshToWasmMeshFilter;
  using Superclass = ProcessObject;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  /** Method for creation through the object factory. */
  itkNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkTypeMacro(MeshToWasmMeshFilter, ProcessObject);

  using DataObjectIdentifierType = Superclass::DataObjectIdentifierType;
  using DataObjectPointerArraySizeType = Superclass::DataObjectPointerArraySizeType;

  using MeshType = QuadEdgeMesh<TPixel, VDimension>;
  using WasmMeshType = WasmMesh<MeshType>;

  /** Set/Get the path input of this process object.  */
  using Superclass::SetInput;
  virtual void
  SetInput(const MeshType * mesh);

  virtual void
  SetInput(unsigned int, const MeshType * mesh);

  const MeshType *
  GetInput();

  const MeshType *
  GetInput(unsigned int idx);

  WasmMeshType *
  GetOutput();
  const WasmMeshType *
  GetOutput() const;

  WasmMeshType *
  GetOutput(unsigned int idx);

protected:
  MeshToWasmMeshFilter();
  ~MeshToWasmMeshFilter() override = default;

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
#  include "itkMeshToWasmMeshFilter.hxx"
#endif

#endif

/*=========================================================================
 *
 *  Copyright NumFOCUS
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *=========================================================================*/
#ifndef itkMeshToJSONFilter_h
#define itkMeshToJSONFilter_h

#include "itkProcessObject.h"
#include "itkMeshJSON.h"

namespace itk
{
/**
 *\class MeshToJSONFilter
 * \brief Convert an Mesh to an MeshJSON object.
 * 
 * \ingroup WebAssemblyInterface
 */
template <typename TMesh>
class ITK_TEMPLATE_EXPORT MeshToJSONFilter : public ProcessObject
{
public:
  ITK_DISALLOW_COPY_AND_MOVE(MeshToJSONFilter);

  /** Standard class type aliases. */
  using Self = MeshToJSONFilter;
  using Superclass = ProcessObject;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  /** Method for creation through the object factory. */
  itkNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkTypeMacro(MeshToJSONFilter, ProcessObject);

  using DataObjectIdentifierType = Superclass::DataObjectIdentifierType;
  using DataObjectPointerArraySizeType = Superclass::DataObjectPointerArraySizeType;

  using MeshType = TMesh;
  using MeshJSONType = MeshJSON<MeshType>;

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

  MeshJSONType *
  GetOutput();
  const MeshJSONType *
  GetOutput() const;

  MeshJSONType *
  GetOutput(unsigned int idx);

protected:
  MeshToJSONFilter();
  ~MeshToJSONFilter() override = default;

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
#  include "itkMeshToJSONFilter.hxx"
#endif

#endif

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
#ifndef itkJSONToMeshFilter_h
#define itkJSONToMeshFilter_h

#include "itkProcessObject.h"
#include "itkMeshJSON.h"

namespace itk
{
/**
 *\class JSONToMeshFilter
 * \brief Convert an MeshJSON to an Mesh object.
 * 
 * TMesh must match the type stored in the JSON representation or an exception will be shown.
 * 
 * \ingroup WebAssemblyInterface
 */
template <typename TMesh>
class ITK_TEMPLATE_EXPORT JSONToMeshFilter : public ProcessObject
{
public:
  ITK_DISALLOW_COPY_AND_MOVE(JSONToMeshFilter);

  /** Standard class type aliases. */
  using Self = JSONToMeshFilter;
  using Superclass = ProcessObject;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  /** Method for creation through the object factory. */
  itkNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkTypeMacro(JSONToMeshFilter, ProcessObject);

  using DataObjectIdentifierType = Superclass::DataObjectIdentifierType;
  using DataObjectPointerArraySizeType = Superclass::DataObjectPointerArraySizeType;

  using MeshType = TMesh;
  using MeshJSONType = MeshJSON<MeshType>;

  /** Set/Get the path input of this process object.  */
  using Superclass::SetInput;
  virtual void
  SetInput(const MeshJSONType * mesh);

  virtual void
  SetInput(unsigned int, const MeshJSONType * mesh);

  const MeshJSONType *
  GetInput();

  const MeshJSONType *
  GetInput(unsigned int idx);

  MeshType *
  GetOutput();
  const MeshType *
  GetOutput() const;

  MeshType *
  GetOutput(unsigned int idx);

protected:
  JSONToMeshFilter();
  ~JSONToMeshFilter() override = default;

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
#  include "itkJSONToMeshFilter.hxx"
#endif

#endif

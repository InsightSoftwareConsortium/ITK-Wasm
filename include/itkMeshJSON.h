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
#ifndef itkMeshJSON_h
#define itkMeshJSON_h

#include "itkDataJSON.h"
#include "itkVectorContainer.h"

namespace itk
{
/**
 *\class MeshJSON
 * \brief JSON representation for an itk::Mesh
 *
 * JSON representation for an itk::Mesh for interfacing across programming languages and runtimes.
 * 
 * Point, CellBuffer, PointData, and CellData binary array buffer's are stored as strings with memory addresses or paths on disks or a virtual filesystem.
 * 
 * \ingroup WebAssemblyInterface
 */
template <typename TMesh>
class ITK_TEMPLATE_EXPORT MeshJSON : public DataJSON
{
public:
  ITK_DISALLOW_COPY_AND_MOVE(MeshJSON);

  /** Standard class type aliases. */
  using Self = MeshJSON;
  using Superclass = DataJSON;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  itkNewMacro(Self);
  /** Run-time type information (and related methods). */
  itkTypeMacro(MeshJSON, DataJSON);

  using MeshType = TMesh;

  using PointIdentifier = typename MeshType::PointIdentifier;
  using CellIdentifier = typename MeshType::CellIdentifier;
  using CellBufferContainerType = VectorContainer<SizeValueType, CellIdentifier>;

  void SetMesh(const MeshType * mesh);

  const MeshType * GetMesh() const {
    return static_cast< const MeshType * >(this->GetDataObject());
  }

  const CellBufferContainerType * GetCellBuffer() const {
    return this->m_CellBufferContainer.GetPointer();
  }

protected:
  MeshJSON()
  {
    this->m_CellBufferContainer = CellBufferContainerType::New();
  }
  ~MeshJSON() override = default;

  typename CellBufferContainerType::Pointer m_CellBufferContainer;
};

} // namespace itk

#ifndef ITK_MANUAL_INSTANTIATION
#  include "itkMeshJSON.hxx"
#endif

#endif

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
#ifndef itkWasmPointSetIOBase_h
#define itkWasmPointSetIOBase_h
#include "WebAssemblyInterfaceExport.h"

#include "itkWasmDataObject.h"
#include "itkMeshIOBase.h"
#include "itkVectorContainer.h"

namespace itk
{
/**
 *\class WasmPointSetIOBase
 * \brief JSON representation for an itk::PointSetIOBase
 *
 * JSON representation for an itk::PointSetIOBase for interfacing across programming languages and runtimes.
 *
 * Points, Cells, PointData, CellData binary array buffer's are stored as strings with memory addresses or paths on disks or a virtual filesystem.
 *
 * Arrays:
 *
 * - 0: Points
 * - 1: PointData
 *
 * \ingroup WebAssemblyInterface
 */
class WebAssemblyInterface_EXPORT WasmPointSetIOBase : public WasmDataObject
{
public:
  ITK_DISALLOW_COPY_AND_MOVE(WasmPointSetIOBase);

  /** Standard class type aliases. */
  using Self = WasmPointSetIOBase;
  using Superclass = WasmDataObject;
  using Pointer = SmartPointer<Self>;
  using ConstPointer = SmartPointer<const Self>;

  itkNewMacro(Self);
  /** Run-time type information (and related methods). */
  itkTypeMacro(WasmPointSetIOBase, WasmDataObject);

  using DataContainerType = VectorContainer<SizeValueType, char>;

  void SetMeshIO(MeshIOBase * meshIO, bool readPointSet = true);
  const MeshIOBase * GetMeshIO() const {
    return m_MeshIOBase.GetPointer();
  }

  const DataContainerType * GetPointsContainer() const
  {
    return this->m_PointsContainer.GetPointer();
  }
  DataContainerType * GetPointsContainer()
  {
    return this->m_PointsContainer.GetPointer();
  }

  const DataContainerType * GetPointDataContainer() const
  {
    return this->m_PointDataContainer.GetPointer();
  }
  DataContainerType * GetPointDataContainer()
  {
    return this->m_PointDataContainer.GetPointer();
  }

protected:
  WasmPointSetIOBase();
  ~WasmPointSetIOBase() override = default;

  void
  PrintSelf(std::ostream & os, Indent indent) const override;

  DataContainerType::Pointer m_PointsContainer;
  DataContainerType::Pointer m_PointDataContainer;

  MeshIOBase::ConstPointer m_MeshIOBase;
};

} // namespace itk

#endif

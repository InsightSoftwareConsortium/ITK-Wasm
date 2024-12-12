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
#ifndef itkWasmMesh_hxx
#define itkWasmMesh_hxx

#include "itkWasmMesh.h"

namespace itk
{

template <typename TMesh>
void
WasmMesh<TMesh>
::SetMesh(const MeshType * mesh)
{
  this->m_CellBufferContainer = const_cast<MeshType *>(mesh)->GetCellsArray();
  this->SetDataObject(const_cast<MeshType *>(mesh));
}

template <typename TPixel, unsigned int VDimension>
void
WasmMesh<itk::QuadEdgeMesh<TPixel, VDimension>>
::SetMesh(const MeshType * mesh)
{
  m_PointsBufferContainer.resize(mesh->GetNumberOfPoints() * VDimension);
  for (unsigned int i = 0; i < mesh->GetNumberOfPoints(); ++i)
  {
    const auto & point = mesh->GetPoint(i);
    for (unsigned int d = 0; d < VDimension; ++d)
    {
      m_PointsBufferContainer[i * VDimension + d] = point[d];
    }
  }

  this->m_CellBufferContainer = const_cast<MeshType *>(mesh)->GetCellsArray();

  m_PointDataBufferContainer.resize(mesh->GetPointData()->Size());
  for (SizeValueType i = 0; i < mesh->GetPointData()->Size(); ++i)
  {
    m_PointDataBufferContainer[i] = mesh->GetPointData()->ElementAt(i);
  }

  m_CellDataBufferContainer.resize(mesh->GetCellData()->Size());
  for (SizeValueType i = 0; i < mesh->GetCellData()->Size(); ++i)
  {
    m_CellDataBufferContainer[i] = mesh->GetCellData()->ElementAt(i);
  }

  this->SetDataObject(const_cast<MeshType *>(mesh));
}


} // end namespace itk

#endif

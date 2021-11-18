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
#ifndef itkMeshJSON_hxx
#define itkMeshJSON_hxx

#include "itkMeshJSON.h"

namespace itk
{

template <typename TMesh>
void
MeshJSON<TMesh>
::SetMesh(const MeshType * mesh)
{
    SizeValueType cellBufferSize = 2 * mesh->GetNumberOfCells();
    for (typename MeshType::CellsContainerConstIterator ct = mesh->GetCells()->Begin(); ct != mesh->GetCells()->End(); ++ct)
    {
      cellBufferSize += ct->Value()->GetNumberOfPoints();
    }
    this->m_CellBufferContainer->resize(cellBufferSize);

    const typename MeshType::CellsContainer * cells = mesh->GetCells();

    typename MeshType::PointIdentifier const * ptIds;
    typename MeshType::CellType *              cellPtr;

    // For each cell
    SizeValueType                                    index = NumericTraits<SizeValueType>::ZeroValue();
    typename MeshType::CellsContainerConstIterator cter = cells->Begin();
    while (cter != cells->End())
    {
      cellPtr = cter.Value();

      // Write the cell type
      switch (cellPtr->GetType())
      {
        case CellGeometryEnum::VERTEX_CELL:
          this->m_CellBufferContainer[index++] = static_cast<PointIdentifierType>(CellGeometryEnum::VERTEX_CELL);
          break;
        case CellGeometryEnum::LINE_CELL:
          this->m_CellBufferContainer[index++] = static_cast<PointIdentifierType>(CellGeometryEnum::LINE_CELL);
          break;
        case CellGeometryEnum::TRIANGLE_CELL:
          this->m_CellBufferContainer[index++] = static_cast<PointIdentifierType>(CellGeometryEnum::TRIANGLE_CELL);
          break;
        case CellGeometryEnum::QUADRILATERAL_CELL:
          this->m_CellBufferContainer[index++] = static_cast<PointIdentifierType>(CellGeometryEnum::QUADRILATERAL_CELL);
          break;
        case CellGeometryEnum::POLYGON_CELL:
          this->m_CellBufferContainer[index++] = static_cast<PointIdentifierType>(CellGeometryEnum::POLYGON_CELL);
          break;
        case CellGeometryEnum::TETRAHEDRON_CELL:
          this->m_CellBufferContainer[index++] = static_cast<PointIdentifierType>(CellGeometryEnum::TETRAHEDRON_CELL);
          break;
        case CellGeometryEnum::HEXAHEDRON_CELL:
          this->m_CellBufferContainer[index++] = static_cast<PointIdentifierType>(CellGeometryEnum::HEXAHEDRON_CELL);
          break;
        case CellGeometryEnum::QUADRATIC_EDGE_CELL:
          this->m_CellBufferContainer[index++] = static_cast<PointIdentifierType>(CellGeometryEnum::QUADRATIC_EDGE_CELL);
          break;
        case CellGeometryEnum::QUADRATIC_TRIANGLE_CELL:
          this->m_CellBufferContainer[index++] = static_cast<PointIdentifierType>(CellGeometryEnum::QUADRATIC_TRIANGLE_CELL);
          break;
        default:
          itkExceptionMacro(<< "Unknown mesh cell");
      }

      // The second element is number of points for each cell
      this->m_CellBufferContainer[index++] = cellPtr->GetNumberOfPoints();

      // Others are point identifiers in the cell
      ptIds = cellPtr->GetPointIds();
      unsigned int numberOfPoints = cellPtr->GetNumberOfPoints();
      for (unsigned int ii = 0; ii < numberOfPoints; ++ii)
      {
        this->m_CellBufferContainer[index++] = static_cast<PointIdentifierType>(ptIds[ii]);
      }

      ++cter;
    }
    this->SetDataObject(const_cast<MeshType *>(mesh));
}

} // end namespace itk

#endif

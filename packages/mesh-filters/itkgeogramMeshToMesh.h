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
#ifndef itkgeogramMeshToMesh_h
#define itkgeogramMeshToMesh_h

#include "itkTriangleCell.h"
#include "itkQuadrilateralCell.h"
#include "itkPolygonCell.h"

#include "geogram/mesh/mesh.h"
#include "itkMesh.h"

namespace itk
{

template <typename TMesh>
void
geogramMeshToMesh(const GEO::Mesh & geoMesh, TMesh * itkMesh)
{
  using MeshType = TMesh;
  using PixelType = typename MeshType::PixelType;
  static constexpr unsigned int Dimension = MeshType::PointDimension;

  using PointType = typename MeshType::PointType;
  using PointIdentifier = typename MeshType::PointIdentifier;
  using CellIdentifier = typename MeshType::CellIdentifier;
  using CellType = typename MeshType::CellType;
  using CellAutoPointer = typename CellType::CellAutoPointer;
  using CoordinateType = typename MeshType::CoordRepType;

  using TriangleCellType = TriangleCell<CellType>;
  using QuadCellType = QuadrilateralCell<CellType>;
  using PolygonCellType = PolygonCell<CellType>;

  const bool singlePrecision = geoMesh.vertices.single_precision();

  // Copy vertices
  if (singlePrecision)
  {
    for(GEO::index_t v = 0; v < geoMesh.vertices.nb(); ++v)
    {
      PointType point;
      for (unsigned int d = 0; d < Dimension; ++d)
        {
        point[d] = static_cast<CoordinateType>(geoMesh.vertices.single_precision_point_ptr(v)[d]);
        }
      itkMesh->SetPoint(v, point);
    }
  }
  else
  {
    for(GEO::index_t v = 0; v < geoMesh.vertices.nb(); ++v)
    {
      PointType point;
      for (unsigned int d = 0; d < Dimension; ++d)
      {
        point[d] = static_cast<CoordinateType>(geoMesh.vertices.point_ptr(v)[d]);
      }
      itkMesh->SetPoint(v, point);
    }
  }

  // Copy facets
  for(GEO::index_t f = 0; f < geoMesh.facets.nb(); ++f) {
    auto numVertices = geoMesh.facets.nb_vertices(f);
    CellAutoPointer cell;

    if(numVertices == 3)
    {
      auto * triangleCell = new TriangleCellType;
      for(GEO::index_t lv = 0; lv < 3; ++lv)
      {
        triangleCell->SetPointId(lv, geoMesh.facets.vertex(f, lv));
      }
      cell.TakeOwnership(triangleCell);
    }
    else if(numVertices == 4)
    {
      auto * quadCell = new QuadCellType;
      for(GEO::index_t lv = 0; lv < 4; ++lv)
      {
        quadCell->SetPointId(lv, geoMesh.facets.vertex(f, lv));
      }
      cell.TakeOwnership(quadCell);
    }
    else
    {
      auto * polygonCell = new PolygonCellType;
      for(GEO::index_t lv = 0; lv < numVertices; ++lv)
      {
        polygonCell->SetPointId(lv, geoMesh.facets.vertex(f, lv));
      }
    }
    itkMesh->SetCell(f, cell);
  }

  // Copy vertex attributes if they exist
  if(geoMesh.vertices.attributes().is_defined("PointData"))
  {
    auto vertexAttribute = GEO::Attribute<PixelType>(geoMesh.vertices.attributes(), "PointData");
    for(GEO::index_t v = 0; v < geoMesh.vertices.nb(); ++v)
    {
      itkMesh->SetPointData(v, static_cast<PixelType>(vertexAttribute[v]));
    }
  }

  // Copy facet attributes if they exist
  if(geoMesh.facets.attributes().is_defined("CellData"))
  {
    auto facetAttribute = GEO::Attribute<PixelType>(geoMesh.facets.attributes(), "CellData");
    for(GEO::index_t f = 0; f < geoMesh.facets.nb(); ++f)
    {
      itkMesh->SetCellData(f, static_cast<PixelType>(facetAttribute[f]));
    }
  }
}

} // end namespace itk

#endif // itkgeogramMeshToMesh_h

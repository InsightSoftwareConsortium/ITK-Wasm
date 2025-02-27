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
#ifndef itkmeshToGeogramMesh_h
#define itkmeshToGeogramMesh_h

#include "geogram/mesh/mesh.h"

namespace itk
{

template <typename TMesh>
void
meshToGeogramMesh(const TMesh * itkMesh, GEO::Mesh & geoMesh)
{
  using MeshType = TMesh;
  using PixelType = typename MeshType::PixelType;
  static constexpr unsigned int Dimension = MeshType::PointDimension;
  static constexpr bool ITKSinglePrecision = std::is_same<typename MeshType::CoordRepType, float>::value;

  // Copy vertices
  auto points = itkMesh->GetPoints();
  geoMesh.vertices.create_vertices(points->Size());

  if (geoMesh.vertices.single_precision() && ITKSinglePrecision)
  {
    using CoordType = float;
    for(auto it = points->Begin(); it != points->End(); ++it)
    {
      const auto& point = it.Value();
      GEO::index_t v = it.Index();
      for (unsigned int d = 0; d < Dimension; ++d)
      {
        geoMesh.vertices.single_precision_point_ptr(v)[d] = static_cast<CoordType>(point[d]);
      }
    }
  }
  else
  {
    using CoordType = double;
    for(auto it = points->Begin(); it != points->End(); ++it)
    {
      const auto& point = it.Value();
      GEO::index_t v = it.Index();
      for (unsigned int d = 0; d < Dimension; ++d)
      {
        geoMesh.vertices.point_ptr(v)[d] = static_cast<CoordType>(point[d]);
      }
    }
  }

  // Copy faces/cells
  auto cells = itkMesh->GetCells();
  for(auto it = cells->Begin(); it != cells->End(); ++it)
  {
    const auto& cell = it.Value();
    GEO::vector<GEO::index_t> vertices;
    for(auto* pit = cell->PointIdsBegin(); pit != cell->PointIdsEnd(); ++pit) {
        vertices.push_back(*pit);
    }
    if (vertices.size() == 3)
    {
      geoMesh.facets.create_triangle(vertices[0], vertices[1], vertices[2]);
    }
    else if (vertices.size() == 4)
    {
      geoMesh.facets.create_quad(vertices[0], vertices[1], vertices[2], vertices[3]);
    }
    else
    {
    geoMesh.facets.create_polygon(vertices);
    }
  }

  // Copy point data
  auto pointData = itkMesh->GetPointData();
  if (pointData && pointData->Size() > 0)
  {
    GEO::Attribute<PixelType> vertexAttribute(geoMesh.vertices.attributes(), "PointData");
    for(auto it = pointData->Begin(); it != pointData->End(); ++it)
    {
      vertexAttribute[it.Index()] = static_cast<PixelType>(it.Value());
    }
  }

  // Copy cell data
  auto cellData = itkMesh->GetCellData();
  if (cellData && cellData->Size() > 0)
  {
    GEO::Attribute<PixelType> facetAttribute(geoMesh.facets.attributes(), "CellData");
    for(auto it = cellData->Begin(); it != cellData->End(); ++it)
    {
      facetAttribute[it.Index()] = static_cast<PixelType>(it.Value());
    }
  }

  geoMesh.facets.connect();
}

} // namespace itk

#endif // itkmeshToGeogramMesh_h

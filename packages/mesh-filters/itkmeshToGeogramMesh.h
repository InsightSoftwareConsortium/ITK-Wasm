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

#include <memory>

#include "geogram/mesh/mesh.h"

namespace itk
{

template <typename TMesh>
auto
meshToGeogramMesh(const TMesh * itkMesh) -> std::unique_ptr<GEO::Mesh>
{
  using MeshType = TMesh;
  using PixelType = typename MeshType::PixelType;
  static constexpr unsigned int Dimension = MeshType::PointDimension;
  static constexpr bool SinglePrecision = std::is_same<typename MeshType::CoordRepType, float>::value;
  std::unique_ptr<GEO::Mesh> geoMesh = std::make_unique<GEO::Mesh>(Dimension, SinglePrecision);

  // Copy vertices
  auto points = itkMesh->GetPoints();
  geoMesh->vertices.create_vertices(points->Size());

  for(auto it = points->Begin(); it != points->End(); ++it)
  {
    const auto& point = it.Value();
    GEO::index_t v = it.Index();
    for (unsigned int d = 0; d < Dimension; ++d)
    {
      geoMesh->vertices.point(v)[d] = point[d];
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
    geoMesh->facets.create_polygon(vertices);
  }

  // Copy point data
  auto pointData = itkMesh->GetPointData();
  if (pointData && pointData->Size() > 0)
  {
    GEO::Attribute<PixelType> vertexAttribute(geoMesh->vertices.attributes(), "PointData");
    for(auto it = pointData->Begin(); it != pointData->End(); ++it)
    {
      vertexAttribute[it.Index()] = static_cast<PixelType>(it.Value());
    }
  }

  // Copy cell data
  auto cellData = itkMesh->GetCellData();
  if (cellData && cellData->Size() > 0)
  {
    GEO::Attribute<PixelType> facetAttribute(geoMesh->facets.attributes(), "CellData");
    for(auto it = cellData->Begin(); it != cellData->End(); ++it)
    {
      facetAttribute[it.Index()] = static_cast<PixelType>(it.Value());
    }
  }

  return geoMesh;
}

} // namespace itk

#endif // itkmeshToGeogramMesh_h

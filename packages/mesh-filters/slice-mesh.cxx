/*=========================================================================

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

#include "itkPipeline.h"
#include "itkInputMesh.h"
#include "itkOutputMesh.h"
#include "itkSupportInputMeshTypes.h"
#include "itkInputTextStream.h"
#include "itkPolyLineCell.h"

#include "MeshPlaneIntersect.hpp"

#include "glaze/glaze.hpp"

template <typename TMesh>
int sliceMesh(itk::wasm::Pipeline &pipeline, const TMesh *inputMesh)
{
  using MeshType = TMesh;
  constexpr unsigned int Dimension = MeshType::PointDimension;
  using PixelType = typename MeshType::PixelType;
  using PointIdentifierType = typename MeshType::PointIdentifier;
  using CellIdentifierType = typename MeshType::CellIdentifier;

  using FloatType = typename MeshType::CoordRepType;
  using IndexType = typename MeshType::CellIdentifier;
  using MeshPlaneIntersectType = MeshPlaneIntersect<FloatType, IndexType>;
  using Vec3D = typename MeshPlaneIntersectType::Vec3D;
  using Face = typename MeshPlaneIntersectType::Face;
  using Plane = typename MeshPlaneIntersectType::Plane;
  using Planes = std::vector<Plane>;

  using OutputMeshType = itk::Mesh<uint16_t, Dimension>;
  using CellAutoPointer = typename OutputMeshType::CellAutoPointer;
  using PolyLineCellType = itk::PolyLineCell<typename OutputMeshType::CellType>;
  using PointDataContainer = typename OutputMeshType::PointDataContainer;
  using CellDataContainer = typename OutputMeshType::CellDataContainer;

  pipeline.get_option("input-mesh")->required()->type_name("INPUT_MESH");

  itk::wasm::InputTextStream planesJson;
  pipeline.add_option("planes", planesJson, "An array of plane locations to slice the mesh. Each plane is defined by an array of 'origin' and 'spacing' values.")->required()->type_name("INPUT_JSON");

  itk::wasm::OutputMesh<OutputMeshType> outputMesh;
  pipeline.add_option("polylines", outputMesh, "The output mesh comprised of polylines. Cell data indicates whether part of a closed line. Point data indicates the slice index.")->type_name("OUTPUT_MESH");

  ITK_WASM_PARSE(pipeline);

  std::vector<Vec3D> vertices;
  vertices.resize(inputMesh->GetNumberOfPoints());
  for (itk::SizeValueType i = 0; i < inputMesh->GetNumberOfPoints(); ++i)
  {
    typename MeshType::PointType point = inputMesh->GetPoint(i);
    Vec3D vertex;
    for (unsigned int d = 0; d < Dimension; d++)
    {
      vertex[d] = point[d];
    }
    vertices[i] = vertex;
  }

  std::vector<Face> faces;
  faces.resize(inputMesh->GetNumberOfCells());
  using CellIterator = typename MeshType::CellsContainer::ConstIterator;
  CellIterator cellIterator = inputMesh->GetCells()->Begin();
  CellIterator cellEnd = inputMesh->GetCells()->End();

  while (cellIterator != cellEnd)
  {
    const auto cell = cellIterator.Value();
    if (cell->GetNumberOfPoints() != 3)
    {
      std::cerr << "Only triangle cells are supported." << std::endl;
      return EXIT_FAILURE;
    }
    typename MeshType::CellType::PointIdIterator pointIdIterator = cell->PointIdsBegin();
    Face face;
    for (unsigned int j = 0; j < cell->GetNumberOfPoints(); ++j)
    {
      face[j] = *pointIdIterator;
      ++pointIdIterator;
    }
    faces[cellIterator.Index()] = face;
    ++cellIterator;
  }

  const std::string planesJsonString(std::istreambuf_iterator<char>(planesJson.Get()), {});
  auto deserializedAttempt = glz::read_json<Planes>(planesJsonString);
  if (!deserializedAttempt)
  {
    const std::string descriptiveError = glz::format_error(deserializedAttempt, planesJsonString);
    std::cerr << "Failed to deserialize planes: " << descriptiveError << std::endl;
    return EXIT_FAILURE;
  }
  const auto planes = deserializedAttempt.value();

  typename OutputMeshType::Pointer outputMeshPtr = OutputMeshType::New();

  PointIdentifierType pointId = 0;
  CellIdentifierType cellId = 0;
  size_t sliceIndex = 0;
  PointDataContainer *pointData = outputMeshPtr->GetPointData();
  CellDataContainer *cellData = outputMeshPtr->GetCellData();

  typename MeshPlaneIntersectType::Mesh meshPlaneIntersect(vertices, faces);
  for (const auto &plane : planes)
  {
    const auto paths = meshPlaneIntersect.Intersect(plane);
    for (const auto &path : paths)
    {
      CellAutoPointer cell;
      cell.TakeOwnership(new PolyLineCellType);
      PointIdentifierType polyPointId = 0;
      const auto initialPointId = pointId;
      for (const auto &point : path.points)
      {
        typename OutputMeshType::PointType outputPoint;
        for (unsigned int d = 0; d < Dimension; d++)
        {
          outputPoint[d] = point[d];
        }
        outputMeshPtr->SetPoint(pointId, outputPoint);
        cell->SetPointId(polyPointId++, pointId);
        pointId++;
        pointData->push_back(static_cast<uint16_t>(sliceIndex));
      }
      if (path.isClosed)
      {
        cell->SetPointId(polyPointId++, initialPointId);
      }
      outputMeshPtr->SetCell(cellId++, cell);
      const uint16_t isClosed = path.isClosed ? 1 : 0;
      cellData->push_back(isClosed);
    }
    ++sliceIndex;
  }

  outputMesh.Set(outputMeshPtr);

  return EXIT_SUCCESS;
}

template <typename TMesh>
class PipelineFunctor
{
public:
  int operator()(itk::wasm::Pipeline &pipeline)
  {
    using MeshType = TMesh;

    itk::wasm::InputMesh<MeshType> testMesh;
    pipeline.add_option("input-mesh", testMesh, "The input triangle mesh.")->type_name("INPUT_MESH");

    ITK_WASM_PRE_PARSE(pipeline);

    typename MeshType::ConstPointer inputMeshRef = testMesh.Get();
    return sliceMesh<MeshType>(pipeline, inputMeshRef);
  }
};

int main(int argc, char *argv[])
{
  itk::wasm::Pipeline pipeline("slice-mesh", "Slice a mesh along planes into polylines.", argc, argv);

  return itk::wasm::SupportInputMeshTypes<PipelineFunctor,
                                          uint8_t,
                                          int8_t,
                                          uint16_t,
                                          int16_t,
                                          uint32_t,
                                          int32_t,
                                          float,
                                          double>::Dimensions<
      3U>("input-mesh", pipeline);
}

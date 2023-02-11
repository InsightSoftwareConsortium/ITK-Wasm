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
#ifndef itkWasmMeshToMeshFilter_hxx
#define itkWasmMeshToMeshFilter_hxx

#include "itkWasmMeshToMeshFilter.h"
#include "itkNumericTraits.h"
#include "itkCommonEnums.h"
#include "itkHexahedronCell.h"
#include "itkLineCell.h"
#include "itkPolygonCell.h"
#include "itkQuadrilateralCell.h"
#include "itkQuadraticEdgeCell.h"
#include "itkQuadraticTriangleCell.h"
#include "itkTetrahedronCell.h"
#include "itkTriangleCell.h"
#include "itkVertexCell.h"

#include <exception>
#include "itkWasmMapComponentType.h"
#include "itkWasmMapPixelType.h"
#include "itkMeshConvertPixelTraits.h"

#include "rapidjson/document.h"

namespace
{

template<typename TMesh, typename TCellBufferType>
void
populateCells(TMesh * mesh, itk::SizeValueType cellBufferSize, TCellBufferType * cellsBufferPtr)
{
  using MeshType = TMesh;

  using CellIdentifier = typename MeshType::CellIdentifier;
  using PointIdentifier = typename MeshType::PointIdentifier;
  using CellType = typename MeshType::CellType;
  using VertexCellType = itk::VertexCell<CellType>;
  using LineCellType = itk::LineCell<CellType>;
  using TriangleCellType = itk::TriangleCell<CellType>;
  using PolygonCellType = itk::PolygonCell<CellType>;
  using TetrahedronCellType = itk::TetrahedronCell<CellType>;
  using HexahedronCellType = itk::HexahedronCell<CellType>;
  using QuadrilateralCellType = itk::QuadrilateralCell<CellType>;
  using QuadraticEdgeCellType = itk::QuadraticEdgeCell<CellType>;
  using QuadraticTriangleCellType = itk::QuadraticTriangleCell<CellType>;
  using CellAutoPointer = typename MeshType::CellAutoPointer;
  itk::SizeValueType index = itk::NumericTraits<itk::SizeValueType>::ZeroValue();
  CellIdentifier id = itk::NumericTraits<CellIdentifier>::ZeroValue();
  while (index < cellBufferSize)
  {
    auto type = static_cast<itk::CellGeometryEnum>(static_cast<int>(cellsBufferPtr[index++]));
    switch (type)
    {
      case itk::CellGeometryEnum::VERTEX_CELL:
      {
        auto cellPoints = static_cast<unsigned int>(cellsBufferPtr[index++]);
        if (cellPoints != VertexCellType::NumberOfPoints)
        {
          throw std::runtime_error("Invalid Vertex Cell number of points");
        }
        CellAutoPointer cell;
        auto *                vertexCell = new VertexCellType;
        for (unsigned int jj = 0; jj < VertexCellType::NumberOfPoints; ++jj)
        {
          vertexCell->SetPointId(jj, static_cast<PointIdentifier>(cellsBufferPtr[index++]));
        }

        cell.TakeOwnership(vertexCell);
        mesh->SetCell(id++, cell);
        break;
      }
      case itk::CellGeometryEnum::LINE_CELL:
      {
        // for polylines will be loaded as individual edges.
        auto cellPoints = static_cast<unsigned int>(cellsBufferPtr[index++]);
        if (cellPoints < 2)
        {
          throw std::runtime_error("Invalid Line Cell number of points");
        }
        auto pointIDBuffer = static_cast<PointIdentifier>(cellsBufferPtr[index++]);
        for (unsigned int jj = 1; jj < cellPoints; ++jj)
        {
          CellAutoPointer cell;
          auto *                lineCell = new LineCellType;
          lineCell->SetPointId(0, pointIDBuffer);
          pointIDBuffer = static_cast<PointIdentifier>(cellsBufferPtr[index++]);
          lineCell->SetPointId(1, pointIDBuffer);
          cell.TakeOwnership(lineCell);
          mesh->SetCell(id++, cell);
        }
        break;
      }
      case itk::CellGeometryEnum::TRIANGLE_CELL:
      {
        auto cellPoints = static_cast<unsigned int>(cellsBufferPtr[index++]);
        if (cellPoints != TriangleCellType::NumberOfPoints)
        {
          throw std::runtime_error("Invalid Triangle Cell number of points");
        }

        CellAutoPointer cell;
        auto *                triangleCell = new TriangleCellType;
        for (unsigned int jj = 0; jj < TriangleCellType::NumberOfPoints; ++jj)
        {
          triangleCell->SetPointId(jj, static_cast<PointIdentifier>(cellsBufferPtr[index++]));
        }

        cell.TakeOwnership(triangleCell);
        mesh->SetCell(id++, cell);
        break;
      }
      case itk::CellGeometryEnum::QUADRILATERAL_CELL:
      {
        auto cellPoints = static_cast<unsigned int>(cellsBufferPtr[index++]);
        if (cellPoints != QuadrilateralCellType::NumberOfPoints)
        {
          throw std::runtime_error("Invalid Quadrilateral Cell with number of points");
        }

        CellAutoPointer cell;
        auto *                quadrilateralCell = new QuadrilateralCellType;
        for (unsigned int jj = 0; jj < QuadrilateralCellType::NumberOfPoints; ++jj)
        {
          quadrilateralCell->SetPointId(jj, static_cast<PointIdentifier>(cellsBufferPtr[index++]));
        }

        cell.TakeOwnership(quadrilateralCell);
        mesh->SetCell(id++, cell);
        break;
      }
      case itk::CellGeometryEnum::POLYGON_CELL:
      {
        // For polyhedron, if the number of points is 3, then we treat it as
        // triangle cell
        CellAutoPointer cell;
        auto                  cellPoints = static_cast<unsigned int>(cellsBufferPtr[index++]);
        if (cellPoints == TriangleCellType::NumberOfPoints)
        {
          auto * triangleCell = new TriangleCellType;
          for (unsigned int jj = 0; jj < TriangleCellType::NumberOfPoints; ++jj)
          {
            triangleCell->SetPointId(jj, static_cast<PointIdentifier>(cellsBufferPtr[index++]));
          }
          cell.TakeOwnership(triangleCell);
        }
        else
        {
          auto * polygonCell = new PolygonCellType;
          for (unsigned int jj = 0; jj < cellPoints; ++jj)
          {
            polygonCell->SetPointId(jj, static_cast<PointIdentifier>(cellsBufferPtr[index++]));
          }
          cell.TakeOwnership(polygonCell);
        }

        mesh->SetCell(id++, cell);
        break;
      }
      case itk::CellGeometryEnum::TETRAHEDRON_CELL:
      {
        auto cellPoints = static_cast<unsigned int>(cellsBufferPtr[index++]);
        if (cellPoints != TetrahedronCellType::NumberOfPoints)
        {
          throw std::runtime_error("Invalid Tetrahedron Cell number of points");
        }

        CellAutoPointer cell;
        auto *                tetrahedronCell = new TetrahedronCellType;
        for (unsigned int jj = 0; jj < TetrahedronCellType::NumberOfPoints; ++jj)
        {
          tetrahedronCell->SetPointId(jj, static_cast<PointIdentifier>(cellsBufferPtr[index++]));
        }

        cell.TakeOwnership(tetrahedronCell);
        mesh->SetCell(id++, cell);
        break;
      }
      case itk::CellGeometryEnum::HEXAHEDRON_CELL:
      {
        auto cellPoints = static_cast<unsigned int>(cellsBufferPtr[index++]);
        if (cellPoints != HexahedronCellType::NumberOfPoints)
        {
          throw std::runtime_error("Invalid Hexahedron Cell number of points");
        }

        CellAutoPointer cell;
        auto *                hexahedronCell = new HexahedronCellType;
        for (unsigned int jj = 0; jj < HexahedronCellType::NumberOfPoints; ++jj)
        {
          hexahedronCell->SetPointId(jj, static_cast<PointIdentifier>(cellsBufferPtr[index++]));
        }

        cell.TakeOwnership(hexahedronCell);
        mesh->SetCell(id++, cell);
        break;
      }
      case itk::CellGeometryEnum::QUADRATIC_EDGE_CELL:
      {
        auto cellPoints = static_cast<unsigned int>(cellsBufferPtr[index++]);
        if (cellPoints != QuadraticEdgeCellType::NumberOfPoints)
        {
          throw std::runtime_error("Invalid Quadratic edge Cell number of points");
        }

        CellAutoPointer cell;
        auto *                quadraticEdgeCell = new QuadraticEdgeCellType;
        for (unsigned int jj = 0; jj < QuadraticEdgeCellType::NumberOfPoints; ++jj)
        {
          quadraticEdgeCell->SetPointId(jj, static_cast<PointIdentifier>(cellsBufferPtr[index++]));
        }

        cell.TakeOwnership(quadraticEdgeCell);
        mesh->SetCell(id++, cell);
        break;
      }
      case itk::CellGeometryEnum::QUADRATIC_TRIANGLE_CELL:
      {
        auto cellPoints = static_cast<unsigned int>(cellsBufferPtr[index++]);
        if (cellPoints != QuadraticTriangleCellType::NumberOfPoints)
        {
          throw std::runtime_error("Invalid Quadratic triangle Cell number of points");
        }

        CellAutoPointer cell;
        auto *                quadraticTriangleCell = new QuadraticTriangleCellType;
        for (unsigned int jj = 0; jj < QuadraticTriangleCellType::NumberOfPoints; ++jj)
        {
          quadraticTriangleCell->SetPointId(jj, static_cast<PointIdentifier>(cellsBufferPtr[index++]));
        }

        cell.TakeOwnership(quadraticTriangleCell);
        mesh->SetCell(id++, cell);
        break;
      }
      default:
      {
        throw std::runtime_error("Unknown cell type");
      }
    }
  }
}

} // end anonymous namespace

namespace itk
{

template <typename TMesh>
WasmMeshToMeshFilter<TMesh>
::WasmMeshToMeshFilter()
{
  this->SetNumberOfRequiredInputs(1);

  typename MeshType::Pointer output = static_cast<MeshType *>(this->MakeOutput(0).GetPointer());
  this->ProcessObject::SetNumberOfRequiredOutputs(1);
  this->ProcessObject::SetNthOutput(0, output.GetPointer());
}

template <typename TMesh>
ProcessObject::DataObjectPointer
WasmMeshToMeshFilter<TMesh>
::MakeOutput(ProcessObject::DataObjectPointerArraySizeType)
{
  return MeshType::New().GetPointer();
}

template <typename TMesh>
ProcessObject::DataObjectPointer
WasmMeshToMeshFilter<TMesh>
::MakeOutput(const ProcessObject::DataObjectIdentifierType &)
{
  return MeshType::New().GetPointer();
}

template <typename TMesh>
auto
WasmMeshToMeshFilter<TMesh>
::GetOutput() -> MeshType *
{
  // we assume that the first output is of the templated type
  return itkDynamicCastInDebugMode<MeshType *>(this->GetPrimaryOutput());
}

template <typename TMesh>
auto
WasmMeshToMeshFilter<TMesh>
::GetOutput() const -> const MeshType *
{
  // we assume that the first output is of the templated type
  return itkDynamicCastInDebugMode<const MeshType *>(this->GetPrimaryOutput());
}

template <typename TMesh>
auto
WasmMeshToMeshFilter<TMesh>
::GetOutput(unsigned int idx) -> MeshType *
{
  auto * out = dynamic_cast<MeshType *>(this->ProcessObject::GetOutput(idx));

  if (out == nullptr && this->ProcessObject::GetOutput(idx) != nullptr)
  {
    itkWarningMacro(<< "Unable to convert output number " << idx << " to type " << typeid(MeshType).name());
  }
  return out;
}

template <typename TMesh>
void
WasmMeshToMeshFilter<TMesh>
::SetInput(const WasmMeshType * input)
{
  // Process object is not const-correct so the const_cast is required here
  this->ProcessObject::SetNthInput(0, const_cast<WasmMeshType *>(input));
}

template <typename TMesh>
void
WasmMeshToMeshFilter<TMesh>
::SetInput(unsigned int index, const WasmMeshType * mesh)
{
  // Process object is not const-correct so the const_cast is required here
  this->ProcessObject::SetNthInput(index, const_cast<WasmMeshType *>(mesh));
}

template <typename TMesh>
const typename WasmMeshToMeshFilter<TMesh>::WasmMeshType *
WasmMeshToMeshFilter<TMesh>
::GetInput()
{
  return itkDynamicCastInDebugMode<const WasmMeshType *>(this->GetPrimaryInput());
}

template <typename TMesh>
const typename WasmMeshToMeshFilter<TMesh>::WasmMeshType *
WasmMeshToMeshFilter<TMesh>
::GetInput(unsigned int idx)
{
  return itkDynamicCastInDebugMode<const TMesh *>(this->ProcessObject::GetInput(idx));
}

template <typename TMesh>
void
WasmMeshToMeshFilter<TMesh>
::GenerateData()
{
  // Get the input and output pointers
  const WasmMeshType * meshJSON = this->GetInput();
  const std::string json(meshJSON->GetJSON());
  MeshType * mesh = this->GetOutput();

  using PointPixelType = typename MeshType::PixelType;
  using ConvertPointPixelTraits = MeshConvertPixelTraits<PointPixelType>;
  using CellPixelType = typename MeshType::CellPixelType;
  using ConvertCellPixelTraits = MeshConvertPixelTraits<CellPixelType>;

  rapidjson::Document document;
  if (document.Parse(json.c_str()).HasParseError())
    {
    throw std::runtime_error("Could not parse JSON");
    }

  const rapidjson::Value & meshType = document["meshType"];

  const rapidjson::Value & numberOfPointsJson = document["numberOfPoints"];
  const SizeValueType numberOfPoints = numberOfPointsJson.GetInt();

  const rapidjson::Value & numberOfPointPixelsJson = document["numberOfPointPixels"];
  const SizeValueType numberOfPointPixels = numberOfPointPixelsJson.GetInt();
  // const rapidjson::Value & pointPixelComponentsJson = meshType["pointPixelComponents"];
  // const SizeValueType pointPixelComponents = pointPixelComponentsJson.GetInt();

  const rapidjson::Value & numberOfCellPixelsJson = document["numberOfCellPixels"];
  const SizeValueType numberOfCellPixels = numberOfCellPixelsJson.GetInt();
  // const rapidjson::Value & cellPixelComponentsJson = meshType["cellPixelComponents"];
  // const SizeValueType cellPixelComponents = cellPixelComponentsJson.GetInt();

  const int dimension = meshType["dimension"].GetInt();
  if (dimension != MeshType::PointDimension)
  {
    throw std::runtime_error("Unexpected dimension");
  }
  const std::string pointPixelComponentType( meshType["pointPixelComponentType"].GetString() );
  if (numberOfPointPixels && pointPixelComponentType != itk::wasm::MapComponentType<typename ConvertPointPixelTraits::ComponentType>::ComponentString )
  {
    throw std::runtime_error("Unexpected point pixel component type");
  }

  const std::string pointPixelType( meshType["pointPixelType"].GetString() );
  if (numberOfPointPixels && pointPixelType != itk::wasm::MapPixelType<PointPixelType>::PixelString )
  {
    throw std::runtime_error("Unexpected point pixel type");
  }

  const std::string cellPixelComponentType( meshType["cellPixelComponentType"].GetString() );
  if (numberOfCellPixels && cellPixelComponentType != itk::wasm::MapComponentType<typename ConvertCellPixelTraits::ComponentType>::ComponentString )
  {
    throw std::runtime_error("Unexpected cell pixel component type");
  }

  const std::string cellPixelType( meshType["cellPixelType"].GetString() );
  if (numberOfCellPixels && cellPixelType != itk::wasm::MapPixelType<CellPixelType>::PixelString )
  {
    throw std::runtime_error("Unexpected cell pixel type");
  }

  mesh->GetPoints()->resize(numberOfPoints);
  using PointType = typename MeshType::PointType;
  const rapidjson::Value & pointsJson = document["points"];
  const std::string pointsString( pointsJson.GetString() );
  const std::string pointComponentType( meshType["pointComponentType"].GetString() );
  if (numberOfPoints)
  {
    if (pointComponentType == itk::wasm::MapComponentType<typename MeshType::CoordRepType>::ComponentString )
    {
      const auto * pointsPtr = reinterpret_cast< PointType * >( std::strtoull(pointsString.substr(35).c_str(), nullptr, 10) );
      mesh->GetPoints()->assign(pointsPtr, pointsPtr + numberOfPoints);
    }
    else if (pointComponentType == itk::wasm::MapComponentType<float>::ComponentString)
    {
      auto * pointsPtr = reinterpret_cast< float * >( std::strtoull(pointsString.substr(35).c_str(), nullptr, 10) );
      const size_t pointComponents = numberOfPoints * dimension;
      auto * pointsContainerPtr = reinterpret_cast<typename MeshType::CoordRepType *>(&(mesh->GetPoints()->at(0)) );
      std::copy(pointsPtr, pointsPtr + pointComponents, pointsContainerPtr);
    }
    else if (pointComponentType == itk::wasm::MapComponentType<double>::ComponentString)
    {
      auto * pointsPtr = reinterpret_cast< double * >( std::strtoull(pointsString.substr(35).c_str(), nullptr, 10) );
      const size_t pointComponents = numberOfPoints * dimension;
      auto * pointsContainerPtr = reinterpret_cast<typename MeshType::CoordRepType *>(&(mesh->GetPoints()->at(0)) );
      std::copy(pointsPtr, pointsPtr + pointComponents, pointsContainerPtr);
    }
    else
    {
      throw std::runtime_error("Unexpected point component type");
    }
  }


  const rapidjson::Value & cellBufferSizeJson = document["cellBufferSize"];
  const SizeValueType cellBufferSize = cellBufferSizeJson.GetInt();
  const rapidjson::Value & cellsJson = document["cells"];
  const std::string cellsString( cellsJson.GetString() );
  using CellBufferType = typename WasmMeshType::CellBufferContainerType::Element;
  CellBufferType * cellsBufferPtr = reinterpret_cast< CellBufferType * >( static_cast< size_t >(std::strtoull(cellsString.substr(35).c_str(), nullptr, 10)) );
  const std::string cellComponentType( meshType["cellComponentType"].GetString() );
  if (cellComponentType == "uint32")
  {
    uint32_t * cellsBufferPtr = reinterpret_cast< uint32_t * >( static_cast< size_t >(std::strtoull(cellsString.substr(35).c_str(), nullptr, 10)) );
    populateCells<MeshType, uint32_t>(mesh, cellBufferSize, cellsBufferPtr);
  }
  else if (cellComponentType == "uint64")
  {
    uint64_t * cellsBufferPtr = reinterpret_cast< uint64_t * >( static_cast< size_t >(std::strtoull(cellsString.substr(35).c_str(), nullptr, 10)) );
    populateCells<MeshType, uint64_t>(mesh, cellBufferSize, cellsBufferPtr);
  }
  else
  {
    throw std::runtime_error("Unexpected cell component type");
  }

  const rapidjson::Value & pointDataJson = document["pointData"];
  using PointPixelType = typename TMesh::PixelType;
  const std::string pointDataString( pointDataJson.GetString() );
  auto pointDataPtr = reinterpret_cast< PointPixelType * >( std::strtoull(pointDataString.substr(35).c_str(), nullptr, 10) );
  mesh->GetPointData()->resize(numberOfPointPixels);
  mesh->GetPointData()->assign(pointDataPtr, pointDataPtr + numberOfPointPixels);

  const rapidjson::Value & cellDataJson = document["cellData"];
  using CellPixelType = typename TMesh::CellPixelType;
  const std::string cellDataString( cellDataJson.GetString() );
  auto cellDataPtr = reinterpret_cast< CellPixelType * >( std::strtoull(cellDataString.substr(35).c_str(), nullptr, 10) );
  if (mesh->GetCellData() == nullptr)
  {
    mesh->SetCellData(MeshType::CellDataContainer::New());
  }
  if (numberOfCellPixels)
  {
    mesh->GetCellData()->resize(numberOfCellPixels);
    mesh->GetCellData()->assign(cellDataPtr, cellDataPtr + numberOfCellPixels);
  }
}

template <typename TMesh>
void
WasmMeshToMeshFilter<TMesh>
::PrintSelf(std::ostream & os, Indent indent) const
{
  Superclass::PrintSelf(os, indent);
}
} // end namespace itk

#endif

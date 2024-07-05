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
#ifndef itkMeshJSON_h
#define itkMeshJSON_h

#include "itkMeshConvertPixelTraits.h"

#include "itkWasmMapComponentType.h"
#include "itkWasmMapPixelType.h"
#include "itkIntTypesJSON.h"
#include "itkFloatTypesJSON.h"
#include "itkPixelTypesJSON.h"
#include "itkWasmMesh.h"

#include "glaze/glaze.hpp"

namespace itk
{
  /** \class MeshTypeJSON
   *
   * \brief Mesh type JSON representation data structure.
   *
   * \ingroup WebAssemblyInterface
   */
  struct MeshTypeJSON
  {
    unsigned int dimension { 2 };
    JSONFloatTypesEnum pointComponentType { JSONFloatTypesEnum::float32 };
    JSONComponentTypesEnum pointPixelComponentType { JSONComponentTypesEnum::float32 };
    JSONPixelTypesEnum pointPixelType { JSONPixelTypesEnum::Scalar };
    unsigned int pointPixelComponents { 1 };
    JSONIntTypesEnum cellComponentType { JSONIntTypesEnum::uint32 };
    JSONComponentTypesEnum cellPixelComponentType { JSONComponentTypesEnum::float32 };
    JSONPixelTypesEnum cellPixelType { JSONPixelTypesEnum::Scalar };
    unsigned int cellPixelComponents { 1 };
  };

  /** \class MeshJSON
   *
   * \brief Mesh JSON representation data structure.
   *
   * \ingroup WebAssemblyInterface
   */
  struct MeshJSON
  {
    MeshTypeJSON meshType;

    std::string name { "mesh"};

    size_t numberOfPoints{ 0 };
    std::string points;

    size_t numberOfPointPixels{ 0 };
    std::string pointData;

    size_t numberOfCells{ 0 };
    std::string cells;
    size_t cellBufferSize{ 0 };

    size_t numberOfCellPixels{ 0 };
    std::string cellData;
  };

template<typename TMesh>
auto meshToMeshJSON(const TMesh * mesh, const WasmMesh<TMesh> * wasmMesh, bool inMemory) -> MeshJSON
{
  using MeshType = TMesh;

  MeshJSON meshJSON;

  meshJSON.meshType.dimension = MeshType::PointDimension;

  meshJSON.meshType.pointComponentType = wasm::MapComponentType<typename MeshType::CoordRepType>::JSONFloatTypeEnum;
  using PointPixelType = typename TMesh::PixelType;
  using ConvertPointPixelTraits = MeshConvertPixelTraits<PointPixelType>;
  meshJSON.meshType.pointPixelComponentType = wasm::MapComponentType<typename ConvertPointPixelTraits::ComponentType>::JSONComponentEnum;
  meshJSON.meshType.pointPixelType = wasm::MapPixelType<PointPixelType>::JSONPixelEnum;
  meshJSON.meshType.pointPixelComponents = ConvertPointPixelTraits::GetNumberOfComponents();
  meshJSON.meshType.cellComponentType = wasm::MapComponentType<typename MeshType::CellIdentifier>::JSONIntTypeEnum;
  using CellPixelType = typename TMesh::CellPixelType;
  using ConvertCellPixelTraits = MeshConvertPixelTraits<CellPixelType>;
  meshJSON.meshType.cellPixelComponentType = wasm::MapComponentType<typename ConvertPointPixelTraits::ComponentType>::JSONComponentEnum;
  meshJSON.meshType.cellPixelType = wasm::MapPixelType<CellPixelType>::JSONPixelEnum;
  meshJSON.meshType.cellPixelComponents = ConvertCellPixelTraits::GetNumberOfComponents();

  meshJSON.name = mesh->GetObjectName();
  meshJSON.numberOfPoints = mesh->GetNumberOfPoints();
  if (mesh->GetPointData() == nullptr)
  {
    meshJSON.numberOfPointPixels = 0;
  }
  else
  {
    meshJSON.numberOfPointPixels = mesh->GetPointData()->Size();
  }
  meshJSON.numberOfCells = mesh->GetNumberOfCells();
  if (mesh->GetCellData() == nullptr)
  {
    meshJSON.numberOfCellPixels = 0;
  }
  else
  {
    meshJSON.numberOfCellPixels = mesh->GetCellData()->Size();
  }
  if (inMemory)
  {
    meshJSON.cellBufferSize = wasmMesh->GetCellBuffer()->Size();

    const auto pointsAddress = reinterpret_cast< size_t >( &(mesh->GetPoints()->at(0)) );
    std::ostringstream pointsStream;
    pointsStream << "data:application/vnd.itk.address,0:";
    pointsStream << pointsAddress;
    meshJSON.points = pointsStream.str();
    size_t cellsAddress = 0;
    if (mesh->GetNumberOfCells() > 0)
    {
      cellsAddress = reinterpret_cast< size_t >( &(wasmMesh->GetCellBuffer()->at(0)) );
    }
    std::ostringstream cellsStream;
    cellsStream << "data:application/vnd.itk.address,0:";
    cellsStream << cellsAddress;
    meshJSON.cells = cellsStream.str();

    size_t pointDataAddress = 0;
    if (mesh->GetPointData() != nullptr && mesh->GetPointData()->Size() > 0)
    {
      pointDataAddress = reinterpret_cast< size_t >( &(mesh->GetPointData()->at(0)) );
    }
    std::ostringstream pointDataStream;
    pointDataStream << "data:application/vnd.itk.address,0:";
    pointDataStream << pointDataAddress;
    meshJSON.pointData = pointDataStream.str();

    size_t cellDataAddress = 0;
    if (mesh->GetCellData() != nullptr && mesh->GetCellData()->Size() > 0)
    {
      cellDataAddress = reinterpret_cast< size_t >( &(mesh->GetCellData()->at(0)) );
    }
    std::ostringstream cellDataStream;
    cellDataStream <<  "data:application/vnd.itk.address,0:";
    cellDataStream << cellDataAddress;
    meshJSON.cellData = cellDataStream.str();
  }
  else
  {
    meshJSON.points = "data:application/vnd.itk.path,data/points.raw";
    meshJSON.cells = "data:application/vnd.itk.path,data/cells.raw";
    meshJSON.pointData = "data:application/vnd.itk.path,data/point-data.raw";
    meshJSON.cellData = "data:application/vnd.itk.path,data/cell-data.raw";
  }

  return meshJSON;
}
} // end namespace itk

#endif // itkMeshJSON_h

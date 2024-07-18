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
#ifndef itkPolyDataJSON_h
#define itkPolyDataJSON_h

#include "itkMeshConvertPixelTraits.h"

#include "itkWasmMapComponentType.h"
#include "itkWasmMapPixelType.h"
#include "itkIntTypesJSON.h"
#include "itkFloatTypesJSON.h"
#include "itkPixelTypesJSON.h"
#include "itkWasmPolyData.h"
#include "itkMetaDataDictionaryJSON.h"

#include "glaze/glaze.hpp"

namespace itk
{
  /** \class PolyDataTypeJSON
   *
   * \brief PolyData type JSON representation data structure.
   *
   * \ingroup WebAssemblyInterface
   */
  struct PolyDataTypeJSON
  {
    JSONComponentTypesEnum pointPixelComponentType { JSONComponentTypesEnum::float32 };
    JSONPixelTypesEnum pointPixelType { JSONPixelTypesEnum::Scalar };
    unsigned int pointPixelComponents { 1 };
    JSONComponentTypesEnum cellPixelComponentType { JSONComponentTypesEnum::float32 };
    JSONPixelTypesEnum cellPixelType { JSONPixelTypesEnum::Scalar };
    unsigned int cellPixelComponents { 1 };
  };

  /** \class PolyDataJSON
   *
   * \brief PolyData JSON representation data structure.
   *
   * \ingroup WebAssemblyInterface
   */
  struct PolyDataJSON
  {
    PolyDataTypeJSON polyDataType;

    std::string name { "PolyData" };

    size_t numberOfPoints{ 0 };
    std::string points;

    size_t verticesBufferSize { 0 };
    std::string vertices;

    size_t linesBufferSize { 0 };
    std::string lines;

    size_t polygonsBufferSize { 0 };
    std::string polygons;

    size_t triangleStripsBufferSize { 0 };
    std::string triangleStrips;

    size_t numberOfPointPixels { 0 };
    std::string pointData;

    size_t numberOfCellPixels { 0 };
    std::string cellData;

    MetadataJSON metadata;
  };

template<typename TPolyData>
auto polyDataToPolyDataJSON(const TPolyData * polyData, bool inMemory) -> PolyDataJSON
{
  using PolyDataType = TPolyData;

  PolyDataJSON polyDataJSON;

  using PointPixelType = typename TPolyData::PixelType;
  using ConvertPointPixelTraits = MeshConvertPixelTraits<PointPixelType>;
  polyDataJSON.polyDataType.pointPixelComponentType = wasm::MapComponentType<typename ConvertPointPixelTraits::ComponentType>::JSONComponentEnum;
  polyDataJSON.polyDataType.pointPixelType = wasm::MapPixelType<PointPixelType>::JSONPixelEnum;
  polyDataJSON.polyDataType.pointPixelComponents = ConvertPointPixelTraits::GetNumberOfComponents();

  using CellPixelType = typename TPolyData::CellPixelType;
  using ConvertCellPixelTraits = MeshConvertPixelTraits<CellPixelType>;
  polyDataJSON.polyDataType.cellPixelComponentType = wasm::MapComponentType<typename ConvertPointPixelTraits::ComponentType>::JSONComponentEnum;
  polyDataJSON.polyDataType.cellPixelType = wasm::MapPixelType<CellPixelType>::JSONPixelEnum;
  polyDataJSON.polyDataType.cellPixelComponents = ConvertCellPixelTraits::GetNumberOfComponents();

  polyDataJSON.name = polyData->GetObjectName();
  polyDataJSON.numberOfPoints = polyData->GetNumberOfPoints();

  if (polyData->GetPointData() != nullptr)
  {
    polyDataJSON.verticesBufferSize = polyData->GetVertices()->Size();
  }

  if (polyData->GetPointData() != nullptr)
  {
    polyDataJSON.linesBufferSize = polyData->GetLines()->Size();
  }

  if (polyData->GetPointData() != nullptr)
  {
    polyDataJSON.polygonsBufferSize = polyData->GetPolygons()->Size();
  }

  if (polyData->GetPointData() != nullptr)
  {
    polyDataJSON.triangleStripsBufferSize = polyData->GetTriangleStrips()->Size();
  }

  if (polyData->GetPointData() != nullptr)
  {
    polyDataJSON.numberOfPointPixels = polyData->GetPointData()->Size();
  }

  if (polyData->GetCellData() != nullptr)
  {
    polyDataJSON.numberOfCellPixels = polyData->GetCellData()->Size();
  }

  size_t pointsAddress = 0;
  if (polyData->GetNumberOfPoints())
  {
    pointsAddress = reinterpret_cast< size_t >( &(polyData->GetPoints()->at(0)) );
  }
  std::ostringstream pointsStream;
  pointsStream << "data:application/vnd.itk.address,0:";
  pointsStream << pointsAddress;
  polyDataJSON.points = pointsStream.str();

  size_t verticesAddress = 0;
  if (polyData->GetVertices() != nullptr && polyData->GetVertices()->Size() > 0)
  {
    verticesAddress = reinterpret_cast< size_t >( &(polyData->GetVertices()->at(0)) );
  }
  std::ostringstream verticesStream;
  verticesStream << "data:application/vnd.itk.address,0:";
  verticesStream << verticesAddress;
  polyDataJSON.vertices = verticesStream.str();

  size_t linesAddress = 0;
  if (polyData->GetLines() != nullptr && polyData->GetLines()->Size() > 0)
  {
    linesAddress = reinterpret_cast< size_t >( &(polyData->GetLines()->at(0)) );
  }
  std::ostringstream linesStream;
  linesStream << "data:application/vnd.itk.address,0:";
  linesStream << linesAddress;
  polyDataJSON.lines = linesStream.str();

  size_t polygonsAddress = 0;
  if (polyData->GetPolygons() != nullptr && polyData->GetPolygons()->Size() > 0)
  {
    polygonsAddress = reinterpret_cast< size_t >( &(polyData->GetPolygons()->at(0)) );
  }
  std::ostringstream polygonsStream;
  polygonsStream << "data:application/vnd.itk.address,0:";
  polygonsStream << polygonsAddress;
  polyDataJSON.polygons = polygonsStream.str();

  size_t triangleStripsAddress = 0;
  if (polyData->GetTriangleStrips() != nullptr && polyData->GetTriangleStrips()->Size() > 0)
  {
    triangleStripsAddress = reinterpret_cast< size_t >( &(polyData->GetTriangleStrips()->at(0)) );
  }
  std::ostringstream triangleStripsStream;
  triangleStripsStream << "data:application/vnd.itk.address,0:";
  triangleStripsStream << triangleStripsAddress;
  polyDataJSON.triangleStrips = triangleStripsStream.str();

  size_t pointDataAddress = 0;
  if (polyData->GetPointData() != nullptr && polyData->GetPointData()->Size() > 0)
  {
    pointDataAddress = reinterpret_cast< size_t >( &(polyData->GetPointData()->at(0)) );
  }
  std::ostringstream pointDataStream;
  pointDataStream << "data:application/vnd.itk.address,0:";
  pointDataStream << pointDataAddress;
  polyDataJSON.pointData = pointDataStream.str();

  size_t cellDataAddress = 0;
  if (polyData->GetCellData() != nullptr && polyData->GetCellData()->Size() > 0)
  {
    cellDataAddress = reinterpret_cast< size_t >( &(polyData->GetCellData()->at(0)) );
  }
  std::ostringstream cellDataStream;
  cellDataStream <<  "data:application/vnd.itk.address,0:";
  cellDataStream << cellDataAddress;
  polyDataJSON.cellData = cellDataStream.str();

  auto dictionary = polyData->GetMetaDataDictionary();
  metaDataDictionaryToJSON(dictionary, polyDataJSON.metadata);

  return polyDataJSON;
}
} // end namespace itk

#endif // itkPolyDataJSON_h

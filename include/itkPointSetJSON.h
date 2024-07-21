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
#ifndef itkPointSetJSON_h
#define itkPointSetJSON_h

#include "itkMeshConvertPixelTraits.h"

#include "itkWasmMapComponentType.h"
#include "itkWasmMapPixelType.h"
#include "itkIntTypesJSON.h"
#include "itkFloatTypesJSON.h"
#include "itkPixelTypesJSON.h"
#include "itkWasmPointSet.h"
#include "itkMetaDataDictionaryJSON.h"

#include "glaze/glaze.hpp"

namespace itk
{
  /** \class PointSetTypeJSON
   *
   * \brief PointSet type JSON representation data structure.
   *
   * \ingroup WebAssemblyInterface
   */
  struct PointSetTypeJSON
  {
    unsigned int dimension { 2 };
    JSONFloatTypesEnum pointComponentType { JSONFloatTypesEnum::float32 };
    JSONComponentTypesEnum pointPixelComponentType { JSONComponentTypesEnum::float32 };
    JSONPixelTypesEnum pointPixelType { JSONPixelTypesEnum::Scalar };
    unsigned int pointPixelComponents { 1 };
  };

  /** \class PointSetJSON
   *
   * \brief PointSet JSON representation data structure.
   *
   * \ingroup WebAssemblyInterface
   */
  struct PointSetJSON
  {
    PointSetTypeJSON pointSetType;

    std::string name { "PointSet"};

    size_t numberOfPoints{ 0 };
    std::string points;

    size_t numberOfPointPixels{ 0 };
    std::string pointData;

    MetadataJSON metadata;
  };

template<typename TPointSet>
auto pointSetToPointSetJSON(const TPointSet * pointSet, const WasmPointSet<TPointSet> * wasmPointSet, bool inMemory) -> PointSetJSON
{
  using PointSetType = TPointSet;

  PointSetJSON pointSetJSON;

  pointSetJSON.pointSetType.dimension = PointSetType::PointDimension;

  pointSetJSON.pointSetType.pointComponentType = wasm::MapComponentType<typename PointSetType::CoordRepType>::JSONFloatTypeEnum;
  using PointPixelType = typename TPointSet::PixelType;
  using ConvertPointPixelTraits = MeshConvertPixelTraits<PointPixelType>;
  pointSetJSON.pointSetType.pointPixelComponentType = wasm::MapComponentType<typename ConvertPointPixelTraits::ComponentType>::JSONComponentEnum;
  pointSetJSON.pointSetType.pointPixelType = wasm::MapPixelType<PointPixelType>::JSONPixelEnum;
  pointSetJSON.pointSetType.pointPixelComponents = ConvertPointPixelTraits::GetNumberOfComponents();

  pointSetJSON.name = pointSet->GetObjectName();
  pointSetJSON.numberOfPoints = pointSet->GetNumberOfPoints();
  if (pointSet->GetPointData() == nullptr)
  {
    pointSetJSON.numberOfPointPixels = 0;
  }
  else
  {
    pointSetJSON.numberOfPointPixels = pointSet->GetPointData()->Size();
  }
  if (inMemory)
  {
    const auto pointsAddress = reinterpret_cast< size_t >( &(pointSet->GetPoints()->at(0)) );
    std::ostringstream pointsStream;
    pointsStream << "data:application/vnd.itk.address,0:";
    pointsStream << pointsAddress;
    pointSetJSON.points = pointsStream.str();

    size_t pointDataAddress = 0;
    if (pointSet->GetPointData() != nullptr && pointSet->GetPointData()->Size() > 0)
    {
      pointDataAddress = reinterpret_cast< size_t >( &(pointSet->GetPointData()->at(0)) );
    }
    std::ostringstream pointDataStream;
    pointDataStream << "data:application/vnd.itk.address,0:";
    pointDataStream << pointDataAddress;
    pointSetJSON.pointData = pointDataStream.str();
  }
  else
  {
    pointSetJSON.points = "data:application/vnd.itk.path,data/points.raw";
    pointSetJSON.pointData = "data:application/vnd.itk.path,data/point-data.raw";
  }

  auto dictionary = pointSet->GetMetaDataDictionary();
  metaDataDictionaryToJSON(dictionary, pointSetJSON.metadata);

  return pointSetJSON;
}
} // end namespace itk

#endif // itkPointSetJSON_h

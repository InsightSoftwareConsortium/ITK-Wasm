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
#ifndef itkMeshFromJSON_h
#define itkMeshFromJSON_h

#include "itkImportImageFilter.h"
#include <exception>
#include "itkWASMMapComponentType.h"
#include "itkWASMMapPixelType.h"
#include "itkDefaultConvertPixelTraits.h"

#include "rapidjson/document.h"

namespace itk
{

template< typename TMesh >
typename TMesh::Pointer
MeshFromJSON(const std::string & json)
{
  using MeshType = TMesh;
  using PixelType = typename TMesh::PixelType;
  using ConvertPixelTraits = DefaultConvertPixelTraits<PixelType>;
  constexpr unsigned int Dimension = TMesh::PointDimension;

  typename MeshType::Pointer mesh = MeshType::New();

  rapidjson::Document document;
  if (document.Parse(json.c_str()).HasParseError())
    {
    throw std::runtime_error("Could not parse JSON");
    }

  const rapidjson::Value & meshType = document["meshType"];
  const int dimension = meshType["dimension"].GetInt();
  if (dimension != Dimension)
  {
    throw std::runtime_error("Unexpected dimension");
  }
  /*
  const std::string componentType( meshType["componentType"].GetString() );
  if ( componentType != itk::wasm::MapComponentType<PixelType>::ComponentString )
  {
    throw std::runtime_error("Unexpected component type");
  }

  const std::string pixelType( meshType["pixelType"].GetString() );
  if ( pixelType != itk::wasm::MapPixelType<PixelType>::PixelString )
  {
    throw std::runtime_error("Unexpected pixel type");
  }

  if ( meshType["components"].GetInt() != ConvertPixelTraits::GetNumberOfComponents() )
  {
    throw std::runtime_error("Unexpected number of components");
  }

  using OriginType = typename MeshType::PointType;
  OriginType origin;
  const rapidjson::Value & originJson = document["origin"];
  int count = 0;
  for( rapidjson::Value::ConstValueIterator itr = originJson.Begin(); itr != originJson.End(); ++itr )
    {
    origin[count] = itr->GetDouble();
    ++count;
    }
  filter->SetOrigin( origin );

  using SpacingType = typename MeshType::SpacingType;
  SpacingType spacing;
  const rapidjson::Value & spacingJson = document["spacing"];
  count = 0;
  for( rapidjson::Value::ConstValueIterator itr = spacingJson.Begin(); itr != spacingJson.End(); ++itr )
    {
    spacing[count] = itr->GetDouble();
    ++count;
    }
  filter->SetSpacing( spacing );

  using DirectionType = typename MeshType::DirectionType;
  const rapidjson::Value & directionJson = document["direction"];
  const std::string directionString( directionJson.GetString() );
  const double * directionPtr = reinterpret_cast< double * >( std::atol(directionString.substr(8).c_str()) );
  using VnlMatrixType = typename DirectionType::InternalMatrixType;
  const VnlMatrixType vnlMatrix(directionPtr);
  const DirectionType direction(vnlMatrix);
  filter->SetDirection(direction);

  using SizeType = typename MeshType::SizeType;
  SizeType size;
  const rapidjson::Value & sizeJson = document["size"];
  count = 0;
  SizeValueType totalSize = 1;
  for( rapidjson::Value::ConstValueIterator itr = sizeJson.Begin(); itr != sizeJson.End(); ++itr )
    {
    size[count] = itr->GetInt();
    totalSize *= size[count];
    ++count;
    }
  using RegionType = typename MeshType::RegionType;
  RegionType region;
  region.SetSize( size );
  filter->SetRegion( region );

  const rapidjson::Value & dataJson = document["data"];
  const std::string dataString( dataJson.GetString() );
  PixelType * dataPtr = reinterpret_cast< PixelType * >( std::atol(dataString.substr(8).c_str()) );
  const bool letMeshContainerManageMemory = false;
  filter->SetImportPointer( dataPtr, totalSize, letMeshContainerManageMemory );
  */

  return mesh;
}

} // end namespace itk
#endif // itkMeshFromJSON_h

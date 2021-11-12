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
#ifndef itkImageFromJSON_h
#define itkImageFromJSON_h

#include "itkImportImageFilter.h"
#include <exception>
#include "itkWASMMapComponentType.h"
#include "itkWASMMapPixelType.h"
#include "itkDefaultConvertPixelTraits.h"

#include "rapidjson/document.h"

namespace itk
{

template< typename TImage >
typename TImage::Pointer
ImageFromJSON(const std::string & json)
{
  using ImageType = TImage;
  using PixelType = typename TImage::IOPixelType;
  using ConvertPixelTraits = DefaultConvertPixelTraits<PixelType>;
  constexpr unsigned int Dimension = TImage::ImageDimension;

  using FilterType = ImportImageFilter< PixelType, Dimension >;
  auto filter = FilterType::New();

  rapidjson::Document document;
  if (document.Parse(json.c_str()).HasParseError())
    {
    throw std::runtime_error("Could not parse JSON");
    }

  const rapidjson::Value & imageType = document["imageType"];
  const int dimension = imageType["dimension"].GetInt();
  if (dimension != Dimension)
  {
    throw std::runtime_error("Unexpected dimension");
  }
  const std::string componentType( imageType["componentType"].GetString() );
  if ( componentType != itk::wasm::MapComponentType<PixelType>::ComponentString )
  {
    throw std::runtime_error("Unexpected component type");
  }

  const std::string pixelType( imageType["pixelType"].GetString() );
  if ( pixelType != itk::wasm::MapPixelType<PixelType>::PixelString )
  {
    throw std::runtime_error("Unexpected pixel type");
  }

  if ( imageType["components"].GetInt() != ConvertPixelTraits::GetNumberOfComponents() )
  {
    throw std::runtime_error("Unexpected number of components");
  }

  using OriginType = typename ImageType::PointType;
  OriginType origin;
  const rapidjson::Value & originJson = document["origin"];
  int count = 0;
  for( rapidjson::Value::ConstValueIterator itr = originJson.Begin(); itr != originJson.End(); ++itr )
    {
    origin[count] = itr->GetDouble();
    ++count;
    }
  filter->SetOrigin( origin );

  using SpacingType = typename ImageType::SpacingType;
  SpacingType spacing;
  const rapidjson::Value & spacingJson = document["spacing"];
  count = 0;
  for( rapidjson::Value::ConstValueIterator itr = spacingJson.Begin(); itr != spacingJson.End(); ++itr )
    {
    spacing[count] = itr->GetDouble();
    ++count;
    }
  filter->SetSpacing( spacing );

  using DirectionType = typename ImageType::DirectionType;
  const rapidjson::Value & directionJson = document["direction"];
  const std::string directionString( directionJson.GetString() );
  const double * directionPtr = reinterpret_cast< double * >( std::atol(directionString.substr(8).c_str()) );
  using VnlMatrixType = typename DirectionType::InternalMatrixType;
  const VnlMatrixType vnlMatrix(directionPtr);
  const DirectionType direction(vnlMatrix);
  filter->SetDirection(direction);

  using SizeType = typename ImageType::SizeType;
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
  using RegionType = typename ImageType::RegionType;
  RegionType region;
  region.SetSize( size );
  filter->SetRegion( region );

  const rapidjson::Value & dataJson = document["data"];
  const std::string dataString( dataJson.GetString() );
  PixelType * dataPtr = reinterpret_cast< PixelType * >( std::atol(dataString.substr(8).c_str()) );
  const bool letImageContainerManageMemory = false;
  filter->SetImportPointer( dataPtr, totalSize, letImageContainerManageMemory );

  filter->Update();
  return filter->GetOutput();
}

} // end namespace itk
#endif // itkImageFromJSON_h

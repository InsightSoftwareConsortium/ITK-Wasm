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
#ifndef itkMakeJSONImageInterface_h
#define itkMakeJSONImageInterface_h

#include "itkDefaultConvertPixelTraits.h"

#include "itkJSONImageInterface.h"
#include "itkWASMMapComponentType.h"
#include "itkWASMMapPixelType.h"

#include "rapidjson/document.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"

#include <iostream>

namespace itk
{


template<typename TImage >
JSONImageInterface
MakeJSONImageInterface(TImage * image)
{
  using ImageType = TImage;
  using PixelType = typename TImage::IOPixelType;
  using ConvertPixelTraits = DefaultConvertPixelTraits<PixelType>;
  using ComponentType = typename ConvertPixelTraits::ComponentType;

  rapidjson::Document document;
  document.SetObject();
  rapidjson::Document::AllocatorType& allocator = document.GetAllocator();

  rapidjson::Value imageType;
  imageType.SetObject();

  const unsigned int dimension = image->GetImageDimension();
  imageType.AddMember("dimension", rapidjson::Value(dimension).Move(), allocator );

  rapidjson::Value componentType;
  componentType.SetString( wasm::MapComponentType<ComponentType>::ComponentString, allocator );
  imageType.AddMember("componentType", componentType.Move(), allocator );

  imageType.AddMember("pixelType", rapidjson::Value(wasm::MapPixelType<PixelType>::PixelTypeId).Move(), allocator );

  imageType.AddMember("components", rapidjson::Value( ConvertPixelTraits::GetNumberOfComponents() ).Move(), allocator );

  rapidjson::Value origin(rapidjson::kArrayType);
  const auto imageOrigin = image->GetOrigin();
  for( unsigned int ii = 0; ii < dimension; ++ii )
    {
    origin.PushBack(rapidjson::Value().SetDouble(imageOrigin[ii]), allocator);
    }
  document.AddMember( "origin", origin.Move(), allocator );

  rapidjson::Value spacing(rapidjson::kArrayType);
  const auto imageSpacing = image->GetSpacing();
  for( unsigned int ii = 0; ii < dimension; ++ii )
    {
    spacing.PushBack(rapidjson::Value().SetDouble(imageSpacing[ii]), allocator);
    }
  document.AddMember( "spacing", spacing.Move(), allocator );


  document.AddMember( "imageType", imageType.Move(), allocator );

  rapidjson::StringBuffer stringBuffer;
  rapidjson::Writer<rapidjson::StringBuffer> writer(stringBuffer);
  document.Accept(writer);

  const auto jsonMetaData = stringBuffer.GetString();
  std::cout << "jsonMetaData" << jsonMetaData << std::endl;

  JSONImageInterface imageInterface(jsonMetaData);
  return imageInterface;
}

} // end namespace itk
#endif // itkMakeJSONImageInterface_h

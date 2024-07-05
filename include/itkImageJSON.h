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
#ifndef itkImageJSON_h
#define itkImageJSON_h

#include "itkDefaultConvertPixelTraits.h"

#include "itkWasmMapComponentType.h"
#include "itkWasmMapPixelType.h"
#include "itkIntTypesJSON.h"
#include "itkFloatTypesJSON.h"
#include "itkPixelTypesJSON.h"
#include "itkWasmImage.h"
#include "itkMetaDataDictionaryJSON.h"

#include "glaze/glaze.hpp"

namespace itk
{
  /** \class ImageTypeJSON
   *
   * \brief Image type JSON representation data structure.
   *
   * \ingroup WebAssemblyInterface
   */
  struct ImageTypeJSON
  {
    unsigned int dimension { 2 };
    JSONComponentTypesEnum componentType { JSONComponentTypesEnum::float32 };
    JSONPixelTypesEnum pixelType { JSONPixelTypesEnum::Scalar };
    unsigned int components { 1 };
  };

  /** \class ImageJSON
   *
   * \brief Image JSON representation data structure.
   *
   * \ingroup WebAssemblyInterface
   */
  struct ImageJSON
  {
    ImageTypeJSON imageType;

    std::string name { "image" };

    std::vector<double> origin { 0.0, 0.0 };
    std::vector<double> spacing { 1.0, 1.0 };
    std::string         direction;
    std::vector<size_t> size { 0, 0 };

    MetadataJSON metadata;
    std::string data;
  };

template<typename TImage>
auto imageToImageJSON(const TImage * image, const WasmImage<TImage> * wasmImage, bool inMemory) -> ImageJSON
{
  using ImageType = TImage;

  ImageJSON imageJSON;

  imageJSON.imageType.dimension = ImageType::ImageDimension;

  using PointType = typename TImage::PointType;
  using PixelType = typename TImage::PixelType;
  using IOPixelType = typename TImage::IOPixelType;
  using ConvertPixelTraits = DefaultConvertPixelTraits<IOPixelType>;
  using ComponentType = typename ConvertPixelTraits::ComponentType;
  imageJSON.imageType.componentType = wasm::MapComponentType<typename ConvertPixelTraits::ComponentType>::JSONComponentEnum;
  imageJSON.imageType.pixelType = wasm::MapPixelType<PixelType>::JSONPixelEnum;
  imageJSON.imageType.components = image->GetNumberOfComponentsPerPixel();

  imageJSON.name = image->GetObjectName();
  imageJSON.imageType.dimension = image->GetImageDimension();

  const auto largestRegion = image->GetLargestPossibleRegion();

  using PointType = typename ImageType::PointType;
  PointType imageOrigin;
  image->TransformIndexToPhysicalPoint(largestRegion.GetIndex(), imageOrigin);
  imageJSON.origin.clear();
  for (unsigned int ii = 0; ii < ImageType::ImageDimension; ++ii)
  {
    imageJSON.origin.push_back(imageOrigin[ii]);
  }

  imageJSON.spacing.clear();
  const auto imageSpacing = image->GetSpacing();
  for (unsigned int ii = 0; ii < ImageType::ImageDimension; ++ii)
  {
    imageJSON.spacing.push_back(imageSpacing[ii]);
  }

  if (inMemory)
  {
    const auto direction = reinterpret_cast< size_t >( image->GetDirection().GetVnlMatrix().begin() );
    std::ostringstream directionStream;
    directionStream << "data:application/vnd.itk.address,0:";
    directionStream << direction;
    imageJSON.direction = directionStream.str();
  }
  else
  {
    imageJSON.direction = "data:application/vnd.itk.path,data/direction.raw";
  }

  imageJSON.size.clear();
  const auto imageSize = image->GetBufferedRegion().GetSize();
  for (unsigned int ii = 0; ii < ImageType::ImageDimension; ++ii)
  {
    imageJSON.size.push_back(imageSize[ii]);
  }

  if (inMemory)
  {
    const auto data = reinterpret_cast< size_t >( image->GetBufferPointer() );
    std::ostringstream dataStream;
    dataStream << "data:application/vnd.itk.address,0:";
    dataStream << data;
    imageJSON.data = dataStream.str();
  }
  else
  {
    imageJSON.data = "data:application/vnd.itk.path,data/data.raw";
  }

  auto dictionary = image->GetMetaDataDictionary();
  metaDataDictionaryToJSON(dictionary, imageJSON.metadata);

  return imageJSON;
}
} // end namespace itk

#endif // itkImageJSON_h

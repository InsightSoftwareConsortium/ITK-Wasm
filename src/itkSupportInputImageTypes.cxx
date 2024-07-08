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
#include "itkSupportInputImageTypes.h"
#include "itkWasmExports.h"

#include "itkjsonFromIOComponentEnum.h"
#include "itkjsonFromIOPixelEnum.h"

namespace itk
{

bool lexical_cast(const std::string &input, ImageTypeJSON & imageType)
{
  if (wasm::Pipeline::get_use_memory_io())
  {
#ifndef ITK_WASM_NO_MEMORY_IO
    const unsigned int index = std::stoi(input);
    auto json = wasm::getMemoryStoreInputJSON(0, index);
    std::string deserialized;
    auto        deserializedAttempt = glz::read_json<itk::ImageJSON>(json);
    if (!deserializedAttempt)
    {
      const std::string descriptiveError = glz::format_error(deserializedAttempt, json);
      throw std::runtime_error("Failed to deserialize ImageJSON: " + descriptiveError);
    }
    auto imageJSON = deserializedAttempt.value();
    imageType = imageJSON.imageType;
#else
    return false;
#endif
  }
  else
  {
#ifndef ITK_WASM_NO_FILESYSTEM_IO
    ImageIOBase::Pointer imageIO = ImageIOFactory::CreateImageIO(input.c_str(), CommonEnums::IOFileMode::ReadMode);
    if (imageIO.IsNull())
    {
      std::cerr << "IO not available for: " << input << std::endl;
      return false;
    }
    imageIO->SetFileName(input);
    imageIO->ReadImageInformation();

    imageType.dimension = imageIO->GetNumberOfDimensions();

    using IOComponentType = itk::IOComponentEnum;
    const IOComponentType ioComponentEnum = imageIO->GetComponentType();
    imageType.componentType = itk::jsonComponentTypeFromIOComponentEnum( ioComponentEnum );

    using IOPixelType = itk::IOPixelEnum;
    const IOPixelType ioPixelEnum = imageIO->GetPixelType();
    imageType.pixelType = itk::jsonFromIOPixelEnum( ioPixelEnum );

    imageType.components = imageIO->GetNumberOfComponents();
#else
    return false;
#endif
  }
  return true;
}

} // end namespace itk

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
#include "itkioComponentEnumFromJSON.h"

namespace itk
{

IOComponentEnum
ioComponentEnumFromJSON(const std::variant<JSONIntTypesEnum, JSONFloatTypesEnum, JSONComponentTypesEnum> & jsonComponentType)
{
  switch (jsonComponentType.index())
  {
    case 0:
    {
      const auto intType = std::get<JSONIntTypesEnum>(jsonComponentType);
      switch (intType) {
        case JSONIntTypesEnum::int8:
          return IOComponentEnum::CHAR;
        case JSONIntTypesEnum::uint8:
          return IOComponentEnum::UCHAR;
        case JSONIntTypesEnum::int16:
          return IOComponentEnum::SHORT;
        case JSONIntTypesEnum::uint16:
          return IOComponentEnum::USHORT;
        case JSONIntTypesEnum::int32:
          return IOComponentEnum::INT;
        case JSONIntTypesEnum::uint32:
          return IOComponentEnum::UINT;
        case JSONIntTypesEnum::int64:
          return IOComponentEnum::LONGLONG;
        case JSONIntTypesEnum::uint64:
          return IOComponentEnum::ULONGLONG;
        default:
          return IOComponentEnum::UNKNOWNCOMPONENTTYPE;
      }
      break;
    }
    case 1:
    {
      const auto floatType = std::get<JSONFloatTypesEnum>(jsonComponentType);
      switch (floatType) {
        case JSONFloatTypesEnum::float32:
          return IOComponentEnum::FLOAT;
        case JSONFloatTypesEnum::float64:
          return IOComponentEnum::DOUBLE;
        default:
          return IOComponentEnum::UNKNOWNCOMPONENTTYPE;
      }
      break;
    }
    case 2:
    {
      const auto componentType = std::get<JSONComponentTypesEnum>(jsonComponentType);
      switch (componentType)
      {
        case JSONComponentTypesEnum::int8:
          return IOComponentEnum::CHAR;
        case JSONComponentTypesEnum::uint8:
          return IOComponentEnum::UCHAR;
        case JSONComponentTypesEnum::int16:
          return IOComponentEnum::SHORT;
        case JSONComponentTypesEnum::uint16:
          return IOComponentEnum::USHORT;
        case JSONComponentTypesEnum::int32:
          return IOComponentEnum::INT;
        case JSONComponentTypesEnum::uint32:
          return IOComponentEnum::UINT;
        case JSONComponentTypesEnum::int64:
          return IOComponentEnum::LONGLONG;
        case JSONComponentTypesEnum::uint64:
          return IOComponentEnum::ULONGLONG;
        case JSONComponentTypesEnum::float32:
          return IOComponentEnum::FLOAT;
        case JSONComponentTypesEnum::float64:
          return IOComponentEnum::DOUBLE;
        default:
          return IOComponentEnum::UNKNOWNCOMPONENTTYPE;
      }
      break;
    }
    default:
      return IOComponentEnum::UNKNOWNCOMPONENTTYPE;
  }
  return IOComponentEnum::UNKNOWNCOMPONENTTYPE;
}

} // end namespace itk

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
#include "itkjsonFromIOComponentEnum.h"

namespace itk
{

JSONIntTypesEnum
jsonIntTypeFromIOComponentEnum(const IOComponentEnum & ioComponent)
{
  switch (ioComponent)
  {
    case IOComponentEnum::UCHAR:
      return JSONIntTypesEnum::uint8;
    case IOComponentEnum::CHAR:
      return JSONIntTypesEnum::int8;
    case IOComponentEnum::USHORT:
      return JSONIntTypesEnum::uint16;
    case IOComponentEnum::SHORT:
      return JSONIntTypesEnum::int16;
    case IOComponentEnum::UINT:
      return JSONIntTypesEnum::uint32;
    case IOComponentEnum::INT:
      return JSONIntTypesEnum::int32;
    case IOComponentEnum::ULONG:
      return JSONIntTypesEnum::uint64;
    case IOComponentEnum::LONG:
      return JSONIntTypesEnum::int64;
    case IOComponentEnum::ULONGLONG:
      return JSONIntTypesEnum::uint64;
    case IOComponentEnum::LONGLONG:
      return JSONIntTypesEnum::int64;
    case IOComponentEnum::UNKNOWNCOMPONENTTYPE:
      // default
      return JSONIntTypesEnum::uint8;
    default:
      throw std::invalid_argument("Unknown IOComponentEnum");
  }
}

JSONFloatTypesEnum
jsonFloatTypeFromIOComponentEnum(const IOComponentEnum & ioComponent)
{
  switch (ioComponent)
  {
    case IOComponentEnum::FLOAT:
      return JSONFloatTypesEnum::float32;
    case IOComponentEnum::DOUBLE:
      return JSONFloatTypesEnum::float64;
    case IOComponentEnum::UNKNOWNCOMPONENTTYPE:
      // default
      return JSONFloatTypesEnum::float32;
    default:
      throw std::invalid_argument("Unknown IOComponentEnum");
  }
}

JSONComponentTypesEnum
jsonComponentTypeFromIOComponentEnum(const IOComponentEnum & ioComponent)
{
  switch (ioComponent)
  {
    case IOComponentEnum::UCHAR:
      return JSONComponentTypesEnum::uint8;
    case IOComponentEnum::CHAR:
      return JSONComponentTypesEnum::int8;
    case IOComponentEnum::USHORT:
      return JSONComponentTypesEnum::uint16;
    case IOComponentEnum::SHORT:
      return JSONComponentTypesEnum::int16;
    case IOComponentEnum::UINT:
      return JSONComponentTypesEnum::uint32;
    case IOComponentEnum::INT:
      return JSONComponentTypesEnum::int32;
    case IOComponentEnum::ULONGLONG:
      return JSONComponentTypesEnum::uint64;
    case IOComponentEnum::LONGLONG:
      return JSONComponentTypesEnum::int64;
    case IOComponentEnum::FLOAT:
      return JSONComponentTypesEnum::float32;
    case IOComponentEnum::DOUBLE:
      return JSONComponentTypesEnum::float64;
    case IOComponentEnum::UNKNOWNCOMPONENTTYPE:
      // default
      return JSONComponentTypesEnum::float32;
    default:
      throw std::invalid_argument("Unknown IOComponentEnum");
  }
}
} // end namespace itk

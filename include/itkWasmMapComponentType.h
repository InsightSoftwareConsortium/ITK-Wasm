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
#ifndef itkWasmMapComponentType_h
#define itkWasmMapComponentType_h

#include <variant>
#include <type_traits>
#include <string_view>

#include "itkIntTypes.h"

#include "itkIntTypesJSON.h"
#include "itkFloatTypesJSON.h"

namespace itk
{

enum class JSONComponentTypesEnum
{
    int8,
    uint8,
    int16,
    uint16,
    int32,
    uint32,
    int64,
    uint64,
    float32,
    float64
};
namespace wasm
{

template <typename TComponent>
struct MapComponentType
{
  static constexpr std::string_view ComponentString = "Unknown";
  static constexpr JSONComponentTypesEnum JSONComponentEnum = JSONComponentTypesEnum::uint8;
  static constexpr JSONIntTypesEnum JSONIntTypeEnum = JSONIntTypesEnum::uint8;
  static constexpr JSONFloatTypesEnum JSONFloatTypeEnum = JSONFloatTypesEnum::float32;
};

template <>
struct MapComponentType<signed char>
{
  static constexpr std::string_view ComponentString = "int8";
  static constexpr JSONComponentTypesEnum JSONComponentEnum = JSONComponentTypesEnum::int8;
  static constexpr JSONIntTypesEnum JSONIntTypeEnum = JSONIntTypesEnum::int8;
};

template <>
struct MapComponentType<char>
{
  // Todo: does not compile:
  // std::numeric_limits<char>::is_signed ? "int8" : "uint8_
  static constexpr std::string_view ComponentString = "int8";
  static constexpr JSONComponentTypesEnum JSONComponentEnum = JSONComponentTypesEnum::int8;
  static constexpr JSONIntTypesEnum JSONIntTypeEnum = JSONIntTypesEnum::int8;
};

template <>
struct MapComponentType<unsigned char>
{
  static constexpr std::string_view ComponentString = "uint8";
  static constexpr JSONComponentTypesEnum JSONComponentEnum = JSONComponentTypesEnum::uint8;
  static constexpr JSONIntTypesEnum JSONIntTypeEnum = JSONIntTypesEnum::uint8;
};

template <>
struct MapComponentType<short>
{
  static constexpr std::string_view ComponentString = "int16";
  static constexpr JSONComponentTypesEnum JSONComponentEnum = JSONComponentTypesEnum::int16;
  static constexpr JSONIntTypesEnum JSONIntTypeEnum = JSONIntTypesEnum::int16;
};

template <>
struct MapComponentType<unsigned short>
{
  static constexpr std::string_view ComponentString = "uint16";
  static constexpr JSONComponentTypesEnum JSONComponentEnum = JSONComponentTypesEnum::uint16;
  static constexpr JSONIntTypesEnum JSONIntTypeEnum = JSONIntTypesEnum::uint16;
};

template <>
struct MapComponentType<int>
{
  static constexpr std::string_view ComponentString = "int32";
  static constexpr JSONComponentTypesEnum JSONComponentEnum = JSONComponentTypesEnum::int32;
  static constexpr JSONIntTypesEnum JSONIntTypeEnum = JSONIntTypesEnum::int32;
};

template <>
struct MapComponentType<unsigned int>
{
  static constexpr std::string_view ComponentString = "uint32";
  static constexpr JSONComponentTypesEnum JSONComponentEnum = JSONComponentTypesEnum::uint32;
  static constexpr JSONIntTypesEnum JSONIntTypeEnum = JSONIntTypesEnum::uint32;
};

#if ((LLONG_MAX != LONG_MAX))
template <>
struct MapComponentType<long>
{
  static constexpr std::string_view ComponentString = "int32";
  static constexpr JSONComponentTypesEnum JSONComponentEnum = JSONComponentTypesEnum::int32;
  static constexpr JSONIntTypesEnum JSONIntTypeEnum = JSONIntTypesEnum::int32;
};
#else
template <>
struct MapComponentType<long>
{
  static constexpr std::string_view ComponentString = "int64";
  static constexpr JSONComponentTypesEnum JSONComponentEnum = JSONComponentTypesEnum::int64;
  static constexpr JSONIntTypesEnum JSONIntTypeEnum = JSONIntTypesEnum::int64;
};
#endif

#if ((ULLONG_MAX != ULONG_MAX))
template <>
struct MapComponentType<unsigned long>
{
  static constexpr std::string_view ComponentString = "uint32";
  static constexpr JSONComponentTypesEnum JSONComponentEnum = JSONComponentTypesEnum::uint32;
  static constexpr JSONIntTypesEnum JSONIntTypeEnum = JSONIntTypesEnum::uint32;
};
#else
template <>
struct MapComponentType<unsigned long>
{
  static constexpr std::string_view ComponentString = "uint64";
  static constexpr JSONComponentTypesEnum JSONComponentEnum = JSONComponentTypesEnum::uint64;
  static constexpr JSONIntTypesEnum JSONIntTypeEnum = JSONIntTypesEnum::uint64;
};
#endif

template <>
struct MapComponentType<long long>
{
  static constexpr std::string_view ComponentString = "int64";
  static constexpr JSONComponentTypesEnum JSONComponentEnum = JSONComponentTypesEnum::int64;
  static constexpr JSONIntTypesEnum JSONIntTypeEnum = JSONIntTypesEnum::int64;
};

template <>
struct MapComponentType<unsigned long long>
{
  static constexpr std::string_view ComponentString = "uint64";
  static constexpr JSONComponentTypesEnum JSONComponentEnum = JSONComponentTypesEnum::uint64;
  static constexpr JSONIntTypesEnum JSONIntTypeEnum = JSONIntTypesEnum::uint64;
};

template <>
struct MapComponentType<float>
{
  static constexpr std::string_view ComponentString = "float32";
  static constexpr JSONComponentTypesEnum JSONComponentEnum = JSONComponentTypesEnum::float32;
  static constexpr JSONFloatTypesEnum JSONFloatTypeEnum = JSONFloatTypesEnum::float32;
};

template <>
struct MapComponentType<double>
{
  static constexpr std::string_view ComponentString = "float64";
  static constexpr JSONComponentTypesEnum JSONComponentEnum = JSONComponentTypesEnum::float64;
  static constexpr JSONFloatTypesEnum JSONFloatTypeEnum = JSONFloatTypesEnum::float64;
};

} // end namespace wasm
} // end namespace itk

template <>
struct glz::meta<itk::JSONComponentTypesEnum> {
  using enum itk::JSONComponentTypesEnum;
  static constexpr auto value = glz::enumerate(
    int8,
    uint8,
    int16,
    uint16,
    int32,
    uint32,
    int64,
    float32,
    float64
  );
};

#endif // itkWasmMapComponentType_h

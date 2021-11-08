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
#ifndef itkWASMMapComponentType_h
#define itkWASMMapComponentType_h

#include <string_view>

namespace itk
{

namespace wasm
{

template <typename TComponent>
struct MapComponentType
{
  static constexpr std::string_view ComponentString = "Unknown";
};

template <>
struct MapComponentType<signed char>
{
  static constexpr std::string_view ComponentString = "int8_t";
};

template <>
struct MapComponentType<char>
{
  // Todo: does not compile:
  // std::numeric_limits<char>::is_signed ? "int8_t" : "uint8_t"
  static constexpr std::string_view ComponentString = "int8_t";
};

template <>
struct MapComponentType<unsigned char>
{
  static constexpr std::string_view ComponentString = "uint8_t";
};

template <>
struct MapComponentType<short>
{
  static constexpr std::string_view ComponentString = "int16_t";
};

template <>
struct MapComponentType<unsigned short>
{
  static constexpr std::string_view ComponentString = "uint16_t";
};

template <>
struct MapComponentType<int>
{
  static constexpr std::string_view ComponentString = "int32_t";
};

template <>
struct MapComponentType<unsigned int>
{
  static constexpr std::string_view ComponentString = "uint32_t";
};

template <>
struct MapComponentType<long>
{
  static constexpr std::string_view ComponentString = "int64_t";
};

template <>
struct MapComponentType<unsigned long>
{
  static constexpr std::string_view ComponentString = "uint64_t";
};

template <>
struct MapComponentType<long long>
{
  static constexpr std::string_view ComponentString = "int64_t";
};

template <>
struct MapComponentType<unsigned long long>
{
  static constexpr std::string_view ComponentString = "uint64_t";
};

template <>
struct MapComponentType<float>
{
  static constexpr std::string_view ComponentString = "float";
};

template <>
struct MapComponentType<double>
{
  static constexpr std::string_view ComponentString = "double";
};

} // end namespace wasm
} // end namespace itk
#endif // itkWASMMapComponentType_h

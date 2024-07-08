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
#ifndef itkIntTypesJSON_h
#define itkIntTypesJSON_h

#include "glaze/glaze.hpp"

namespace itk
{
  enum class JSONIntTypesEnum
  {
    int8,
    uint8,
    int16,
    uint16,
    int32,
    uint32,
    int64,
    uint64
  };
} // end namespace itk

template <>
struct glz::meta<itk::JSONIntTypesEnum> {
  using enum itk::JSONIntTypesEnum;
  static constexpr auto value = glz::enumerate(
    int8,
    uint8,
    int16,
    uint16,
    int32,
    uint32,
    int64,
    uint64
  );
};

#endif // itkIntTypesJSON_h

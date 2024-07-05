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
#include "itkioPixelEnumFromJSON.h"

namespace itk
{

IOPixelEnum
ioPixelEnumFromJSON(const JSONPixelTypesEnum & jsonPixelType)
{
  switch (jsonPixelType)
  {
    case JSONPixelTypesEnum::Unknown:
      return IOPixelEnum::UNKNOWNPIXELTYPE;
    case JSONPixelTypesEnum::Scalar:
      return IOPixelEnum::SCALAR;
    case JSONPixelTypesEnum::RGB:
      return IOPixelEnum::RGB;
    case JSONPixelTypesEnum::RGBA:
      return IOPixelEnum::RGBA;
    case JSONPixelTypesEnum::Offset:
      return IOPixelEnum::OFFSET;
    case JSONPixelTypesEnum::Vector:
      return IOPixelEnum::VECTOR;
    case JSONPixelTypesEnum::Point:
      return IOPixelEnum::POINT;
    case JSONPixelTypesEnum::CovariantVector:
      return IOPixelEnum::COVARIANTVECTOR;
    case JSONPixelTypesEnum::SymmetricSecondRankTensor:
      return IOPixelEnum::SYMMETRICSECONDRANKTENSOR;
    case JSONPixelTypesEnum::DiffusionTensor3D:
      return IOPixelEnum::DIFFUSIONTENSOR3D;
    case JSONPixelTypesEnum::Complex:
      return IOPixelEnum::COMPLEX;
    case JSONPixelTypesEnum::FixedArray:
      return IOPixelEnum::FIXEDARRAY;
    case JSONPixelTypesEnum::Array:
      return IOPixelEnum::ARRAY;
    case JSONPixelTypesEnum::Matrix:
      return IOPixelEnum::MATRIX;
    case JSONPixelTypesEnum::VariableLengthVector:
      return IOPixelEnum::VARIABLELENGTHVECTOR;
    case JSONPixelTypesEnum::VariableSizeMatrix:
      return IOPixelEnum::VARIABLESIZEMATRIX;
    default:
      return IOPixelEnum::UNKNOWNPIXELTYPE;
  }
}

} // end namespace itk

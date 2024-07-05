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

JSONPixelTypesEnum
jsonFromIOPixelEnum(const IOPixelEnum & ioPixel)
{
  switch (ioPixel)
  {
    case IOPixelEnum::UNKNOWNPIXELTYPE:
      return JSONPixelTypesEnum::Unknown;
    case IOPixelEnum::SCALAR:
      return JSONPixelTypesEnum::Scalar;
    case IOPixelEnum::RGB:
      return JSONPixelTypesEnum::RGB;
    case IOPixelEnum::RGBA:
      return JSONPixelTypesEnum::RGBA;
    case IOPixelEnum::OFFSET:
      return JSONPixelTypesEnum::Offset;
    case IOPixelEnum::VECTOR:
      return JSONPixelTypesEnum::Vector;
    case IOPixelEnum::POINT:
      return JSONPixelTypesEnum::Point;
    case IOPixelEnum::COVARIANTVECTOR:
      return JSONPixelTypesEnum::CovariantVector;
    case IOPixelEnum::SYMMETRICSECONDRANKTENSOR:
      return JSONPixelTypesEnum::SymmetricSecondRankTensor;
    case IOPixelEnum::DIFFUSIONTENSOR3D:
      return JSONPixelTypesEnum::DiffusionTensor3D;
    case IOPixelEnum::COMPLEX:
      return JSONPixelTypesEnum::Complex;
    case IOPixelEnum::FIXEDARRAY:
      return JSONPixelTypesEnum::FixedArray;
    case IOPixelEnum::ARRAY:
      return JSONPixelTypesEnum::Array;
    case IOPixelEnum::MATRIX:
      return JSONPixelTypesEnum::Matrix;
    case IOPixelEnum::VARIABLELENGTHVECTOR:
      return JSONPixelTypesEnum::VariableLengthVector;
    case IOPixelEnum::VARIABLESIZEMATRIX:
      return JSONPixelTypesEnum::VariableSizeMatrix;
    default:
      return JSONPixelTypesEnum::Unknown;
  }
}

} // end namespace itk

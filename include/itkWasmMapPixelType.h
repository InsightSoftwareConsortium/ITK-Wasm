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
#ifndef itkWasmMapPixelType_h
#define itkWasmMapPixelType_h

#include "itkRGBPixel.h"
#include "itkRGBAPixel.h"
#include "itkOffset.h"
#include "itkVector.h"
#include "itkPoint.h"
#include "itkCovariantVector.h"
#include "itkSymmetricSecondRankTensor.h"
#include "itkDiffusionTensor3D.h"
#include <complex>
#include "itkFixedArray.h"
#include "itkVariableLengthVector.h"
#include "itkArray.h"
#include "itkMatrix.h"
#include "itkVariableSizeMatrix.h"

#include <string_view>

#include "itkPixelTypesJSON.h"

namespace itk
{

namespace wasm
{

template <typename TPixel>
struct MapPixelType
{
  // scalar
  static constexpr std::string_view PixelString = "Scalar";
  static constexpr JSONPixelTypesEnum JSONPixelEnum = JSONPixelTypesEnum::Scalar;
};

template <typename TPixel>
struct MapPixelType<RGBPixel<TPixel>>
{
  static constexpr std::string_view PixelString = "RGB";
  static constexpr JSONPixelTypesEnum JSONPixelEnum = JSONPixelTypesEnum::RGB;
};

template <typename TPixel>
struct MapPixelType<RGBAPixel<TPixel>>
{
  static constexpr std::string_view PixelString = "RGBA";
  static constexpr JSONPixelTypesEnum JSONPixelEnum = JSONPixelTypesEnum::RGBA;
};

template <unsigned VLength>
struct MapPixelType<Offset<VLength>>
{
  static constexpr std::string_view PixelString = "Offset";
  static constexpr JSONPixelTypesEnum JSONPixelEnum = JSONPixelTypesEnum::Offset;
};

template <typename TPixel, unsigned VLength>
struct MapPixelType<Vector<TPixel, VLength>>
{
  static constexpr std::string_view PixelString = "Vector";
  static constexpr JSONPixelTypesEnum JSONPixelEnum = JSONPixelTypesEnum::Vector;
};

template <typename TCoordRep, unsigned NPointDimension>
struct MapPixelType<Point<TCoordRep, NPointDimension>>
{
  static constexpr std::string_view PixelString = "Point";
  static constexpr JSONPixelTypesEnum JSONPixelEnum = JSONPixelTypesEnum::Point;
};

template <typename TPixel, unsigned VLength>
struct MapPixelType<CovariantVector<TPixel, VLength>>
{
  static constexpr std::string_view PixelString = "CovariantVector";
  static constexpr JSONPixelTypesEnum JSONPixelEnum = JSONPixelTypesEnum::CovariantVector;
};

template <typename TPixel, unsigned VLength>
struct MapPixelType<SymmetricSecondRankTensor<TPixel, VLength>>
{
  static constexpr std::string_view PixelString = "SymmetricSecondRankTensor";
  static constexpr JSONPixelTypesEnum JSONPixelEnum = JSONPixelTypesEnum::SymmetricSecondRankTensor;
};

template <typename TPixel >
struct MapPixelType<DiffusionTensor3D<TPixel>>
{
  static constexpr std::string_view PixelString = "DiffusionTensor3D";
  static constexpr JSONPixelTypesEnum JSONPixelEnum = JSONPixelTypesEnum::DiffusionTensor3D;
};

template <typename TPixel >
struct MapPixelType<std::complex<TPixel>>
{
  static constexpr std::string_view PixelString = "Complex";
  static constexpr JSONPixelTypesEnum JSONPixelEnum = JSONPixelTypesEnum::Complex;
};

template <typename TPixel, unsigned VLength>
struct MapPixelType<FixedArray<TPixel, VLength>>
{
  static constexpr std::string_view PixelString = "FixedArray";
  static constexpr JSONPixelTypesEnum JSONPixelEnum = JSONPixelTypesEnum::FixedArray;
};

template <typename TValue>
struct MapPixelType<Array<TValue>>
{
  static constexpr std::string_view PixelString = "Array";
  static constexpr JSONPixelTypesEnum JSONPixelEnum = JSONPixelTypesEnum::Array;
};

template <typename TValue, unsigned VLength>
struct MapPixelType<Matrix<TValue, VLength, VLength>>
{
  static constexpr std::string_view PixelString = "Matrix";
  static constexpr JSONPixelTypesEnum JSONPixelEnum = JSONPixelTypesEnum::Matrix;
};

template <typename TPixel>
struct MapPixelType<VariableLengthVector<TPixel>>
{
  static constexpr std::string_view PixelString = "VariableLengthVector";
  static constexpr JSONPixelTypesEnum JSONPixelEnum = JSONPixelTypesEnum::VariableLengthVector;
};


template <typename TValue>
struct MapPixelType<VariableSizeMatrix<TValue>>
{
  static constexpr std::string_view PixelString = "VariableSizeMatrix";
  static constexpr JSONPixelTypesEnum JSONPixelEnum = JSONPixelTypesEnum::VariableSizeMatrix;
};


} // end namespace wasm
} // end namespace itk
#endif // itkWasmMapPixelType_h

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
#ifndef itkWASMMapPixelType_h
#define itkWASMMapPixelType_h

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

namespace itk
{

namespace wasm
{

template <typename TPixel>
struct MapPixelType
{
  // scalar
  static constexpr unsigned int PixelTypeId = 1;
};

template <typename TPixel>
struct MapPixelType<RGBPixel<TPixel>>
{
  static constexpr unsigned int PixelTypeId = 2;
};

template <typename TPixel>
struct MapPixelType<RGBAPixel<TPixel>>
{
  static constexpr unsigned int PixelTypeId = 3;
};

template <unsigned VLength>
struct MapPixelType<Offset<VLength>>
{
  static constexpr unsigned int PixelTypeId = 4;
};

template <typename TPixel, unsigned VLength>
struct MapPixelType<Vector<TPixel, VLength>>
{
  static constexpr unsigned int PixelTypeId = 5;
};

template <typename TCoordRep, unsigned NPointDimension>
struct MapPixelType<Point<TCoordRep, NPointDimension>>
{
  static constexpr unsigned int PixelTypeId = 6;
};

template <typename TPixel, unsigned VLength>
struct MapPixelType<CovariantVector<TPixel, VLength>>
{
  static constexpr unsigned int PixelTypeId = 7;
};

template <typename TPixel, unsigned VLength>
struct MapPixelType<SymmetricSecondRankTensor<TPixel, VLength>>
{
  static constexpr unsigned int PixelTypeId = 8;
};

template <typename TPixel >
struct MapPixelType<DiffusionTensor3D<TPixel>>
{
  static constexpr unsigned int PixelTypeId = 9;
};

template <typename TPixel >
struct MapPixelType<std::complex<TPixel>>
{
  static constexpr unsigned int PixelTypeId = 10;
};

template <typename TPixel, unsigned VLength>
struct MapPixelType<FixedArray<TPixel, VLength>>
{
  static constexpr unsigned int PixelTypeId = 11;
};

template <typename TValue>
struct MapPixelType<Array<TValue>>
{
  static constexpr unsigned int PixelTypeId = 12;
};

template <typename TValue, unsigned VLength>
struct MapPixelType<Matrix<TValue, VLength, VLength>>
{
  static constexpr unsigned int PixelTypeId = 13;
};

template <typename TPixel>
struct MapPixelType<VariableLengthVector<TPixel>>
{
  static constexpr unsigned int PixelTypeId = 14;
};


template <typename TValue>
struct MapPixelType<VariableSizeMatrix<TValue>>
{
  static constexpr unsigned int PixelTypeId = 15;
};


} // end namespace wasm
} // end namespace itk
#endif // itkWASMMapPixelType_h

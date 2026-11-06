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
#ifndef resampleStageBound_h
#define resampleStageBound_h

// A box in moving physical space that every point of a fixed box lands in, for a transform made of linear,
// cubic B-spline and displacement-field stages.
//
// The box is carried through the stages in the order ITK applies them. Linear stages are composed, and applied
// exactly to the points a later stage samples. A B-spline stage samples the transform on a lattice over the box
// and widens the lattice's box by the interpolation error between lattice points, s^2/8 times a bound on the
// second derivative read off the second differences of the control points; the result is intersected with the
// box plus the signed range of the control points around it. Where the box leaves the B-spline's valid region
// ITK displaces nothing, so the signed range with zero in it is taken alone. A displacement-field stage takes
// the box of the landing points of the samples under the box, intersected with the box plus the signed range of
// those samples. Every rule holds because a point moves by a convex combination of the control points or the
// samples around it, which sampling the fixed grid's boundary cannot guarantee: a displacement that peaks
// strictly inside the grid is not seen from its faces.

#include <algorithm>
#include <cmath>
#include <cstddef>
#include <limits>

#include "itkBSplineTransform.h"
#include "itkCompositeTransform.h"
#include "itkDisplacementFieldTransform.h"
#include "itkIndex.h"
#include "itkMatrix.h"
#include "itkPoint.h"
#include "itkTransform.h"
#include "itkVector.h"
#include "vnl/algo/vnl_determinant.h"

namespace resampleStageBound
{

// Upper bound on the lattice points of one B-spline stage; the step grows past it and the margin with it.
constexpr std::size_t MaxLatticePoints = std::size_t(1) << 14;

// A box on a field's own lattice computes to within rounding of whole indices; without the tolerance each side
// would pick up a sample the box does not reach.
constexpr double OnLattice = 1e-6;

template <unsigned int VDimension>
using VectorType = itk::Vector<double, VDimension>;
template <unsigned int VDimension>
using MatrixType = itk::Matrix<double, VDimension, VDimension>;

template <unsigned int VDimension>
struct Box
{
  VectorType<VDimension> low{ std::numeric_limits<double>::max() };
  VectorType<VDimension> high{ std::numeric_limits<double>::lowest() };

  template <typename TCoordinates>
  void
  Include(const TCoordinates & coordinates)
  {
    for (unsigned int d = 0; d < VDimension; ++d)
    {
      low[d] = std::min(low[d], static_cast<double>(coordinates[d]));
      high[d] = std::max(high[d], static_cast<double>(coordinates[d]));
    }
  }
};

template <unsigned int VDimension, typename TVisitor>
void
ForEachCorner(const Box<VDimension> & box, TVisitor && visit)
{
  for (std::size_t mask = 0; mask < (std::size_t(1) << VDimension); ++mask)
  {
    VectorType<VDimension> corner;
    for (unsigned int d = 0; d < VDimension; ++d)
    {
      corner[d] = (mask & (std::size_t(1) << d)) ? box.high[d] : box.low[d];
    }
    visit(corner);
  }
}

// Visit every index from first to last inclusive, the first axis fastest.
template <unsigned int VDimension, typename TVisitor>
void
ForEachIndex(const itk::Index<VDimension> & first, const itk::Index<VDimension> & last, TVisitor && visit)
{
  for (unsigned int d = 0; d < VDimension; ++d)
  {
    if (last[d] < first[d])
    {
      return;
    }
  }
  itk::Index<VDimension> index = first;
  while (true)
  {
    visit(index);
    unsigned int d = 0;
    for (; d < VDimension; ++d)
    {
      if (++index[d] <= last[d])
      {
        break;
      }
      index[d] = first[d];
    }
    if (d == VDimension)
    {
      return;
    }
  }
}

template <unsigned int VDimension>
Box<VDimension>
MappedBox(const Box<VDimension> & box, const MatrixType<VDimension> & matrix, const VectorType<VDimension> & offset)
{
  Box<VDimension> mapped;
  ForEachCorner(box, [&](const VectorType<VDimension> & corner) { mapped.Include(matrix * corner + offset); });
  return mapped;
}

// A physical box in an image's continuous index space, as the box of its corners.
template <typename TImage>
Box<TImage::ImageDimension>
IndexBox(const TImage * image, const Box<TImage::ImageDimension> & box)
{
  constexpr unsigned int Dimension = TImage::ImageDimension;
  Box<Dimension>         index;
  ForEachCorner(box, [&](const VectorType<Dimension> & corner) {
    typename TImage::PointType point;
    for (unsigned int d = 0; d < Dimension; ++d)
    {
      point[d] = corner[d];
    }
    index.Include(
      image->template TransformPhysicalPointToContinuousIndex<double, typename TImage::PointType::ValueType>(point));
  });
  return index;
}

inline itk::IndexValueType
ClampedIndex(double value, itk::SizeValueType size)
{
  return static_cast<itk::IndexValueType>(std::clamp(value, 0.0, static_cast<double>(size) - 1.0));
}

// The box through a cubic B-spline stage. `block` bounds the points before the linear stages `matrix` and
// `offset`, so the lattice is laid over the block itself and mapped exactly, and a rotation ahead of the
// B-spline does not widen the box. Returns the number of lattice points mapped.
template <typename TScalar, unsigned int VDimension>
std::size_t
BSplineStage(const itk::BSplineTransform<TScalar, VDimension, 3> * bspline,
             Box<VDimension> &                                     block,
             const MatrixType<VDimension> &                        matrix,
             const VectorType<VDimension> &                        offset,
             const VectorType<VDimension> &                        voxel)
{
  using IndexType = itk::Index<VDimension>;
  using PointType = typename itk::BSplineTransform<TScalar, VDimension, 3>::InputPointType;

  const auto   coefficients = bspline->GetCoefficientImages();
  const auto * grid = coefficients[0].GetPointer();
  const auto   size = grid->GetLargestPossibleRegion().GetSize();

  const Box<VDimension> box = MappedBox(block, matrix, offset);
  const Box<VDimension> index = IndexBox(grid, box);

  // ITK's valid region: one control point in from the low edge, two from the high edge. The control points
  // whose support meets the box run from one below its first cell to two above its last.
  bool      inside = true;
  IndexType first;
  IndexType last;
  for (unsigned int d = 0; d < VDimension; ++d)
  {
    inside = inside && index.low[d] >= 1.0 && index.high[d] <= static_cast<double>(size[d]) - 2.0;
    first[d] = ClampedIndex(std::floor(index.low[d]) - 1.0, size[d]);
    last[d] = ClampedIndex(std::floor(index.high[d]) + 2.0, size[d]);
  }

  Box<VDimension> range;
  for (unsigned int c = 0; c < VDimension; ++c)
  {
    ForEachIndex(first, last, [&](const IndexType & at) {
      const double value = coefficients[c]->GetPixel(at);
      range.low[c] = std::min(range.low[c], value);
      range.high[c] = std::max(range.high[c], value);
    });
  }

  // The grid index of a block point moves by `derivative` per unit of block coordinate.
  MatrixType<VDimension> derivative = grid->GetInverseDirection() * matrix;
  for (unsigned int i = 0; i < VDimension; ++i)
  {
    for (unsigned int j = 0; j < VDimension; ++j)
    {
      derivative[i][j] /= grid->GetSpacing()[i];
    }
  }

  // Outside the valid region ITK displaces nothing, and a singular linear stage ahead leaves no control cell
  // to size a lattice step from: the signed range bounds both, with zero in it for the first.
  if (!inside || vnl_determinant(derivative.GetVnlMatrix()) == 0.0)
  {
    for (unsigned int c = 0; c < VDimension; ++c)
    {
      block.low[c] = box.low[c] + (inside ? range.low[c] : std::min(range.low[c], 0.0));
      block.high[c] = box.high[c] + (inside ? range.high[c] : std::max(range.high[c], 0.0));
    }
    return 0;
  }

  // factor[c][j] bounds the second derivative of component c along block axis j: the second differences of
  // the control points in the band bound it along the grid axes.
  double factor[VDimension][VDimension];
  for (unsigned int c = 0; c < VDimension; ++c)
  {
    double       bound[VDimension][VDimension] = {};
    const auto * image = coefficients[c].GetPointer();
    ForEachIndex(first, last, [&](const IndexType & at) {
      for (unsigned int i = 0; i < VDimension; ++i)
      {
        for (unsigned int m = i; m < VDimension; ++m)
        {
          IndexType alongI = at;
          IndexType alongM = at;
          IndexType alongBoth = at;
          ++alongI[i];
          ++alongM[m];
          ++alongBoth[i];
          ++alongBoth[m];
          if (alongBoth[i] > last[i] || alongBoth[m] > last[m])
          {
            continue;
          }
          const double difference =
            image->GetPixel(alongBoth) - image->GetPixel(alongI) - image->GetPixel(alongM) + image->GetPixel(at);
          bound[i][m] = bound[m][i] = std::max(bound[i][m], std::abs(difference));
        }
      }
    });
    for (unsigned int j = 0; j < VDimension; ++j)
    {
      factor[c][j] = 0.0;
      for (unsigned int i = 0; i < VDimension; ++i)
      {
        for (unsigned int m = 0; m < VDimension; ++m)
        {
          factor[c][j] += std::abs(derivative[i][j]) * bound[i][m] * std::abs(derivative[m][j]);
        }
      }
    }
  }

  // The lattice step: half a control cell at most, the voxel at least, and in between the coarsest whose
  // margin stays within a voxel.
  const MatrixType<VDimension> cellMatrix(derivative.GetInverse());
  VectorType<VDimension>       nominal;
  double                       budget = std::numeric_limits<double>::max();
  double                       total = 0.0;
  for (unsigned int j = 0; j < VDimension; ++j)
  {
    double cell = 0.0;
    double worst = 0.0;
    for (unsigned int k = 0; k < VDimension; ++k)
    {
      cell += std::abs(cellMatrix[j][k]);
      worst = std::max(worst, factor[k][j]);
    }
    nominal[j] = std::max(cell / 2.0, voxel[j]);
    budget = std::min(budget, voxel[j]);
    total += nominal[j] * nominal[j] * worst;
  }
  const double scale = total <= 0.0 ? 1.0 : std::min(1.0, std::sqrt(8.0 * budget / total));

  IndexType lowest;
  IndexType count;
  lowest.Fill(0);
  const auto latticePoints = [&count]() {
    double points = 1.0;
    for (unsigned int d = 0; d < VDimension; ++d)
    {
      points *= static_cast<double>(count[d]) + 1.0;
    }
    return points;
  };
  for (unsigned int d = 0; d < VDimension; ++d)
  {
    const double step = std::max(voxel[d], scale * nominal[d]);
    const double intervals = std::ceil((block.high[d] - block.low[d]) / step - 1e-9);
    count[d] = static_cast<itk::IndexValueType>(std::clamp(intervals, 1.0, 1e9));
  }
  while (latticePoints() > static_cast<double>(MaxLatticePoints))
  {
    for (unsigned int d = 0; d < VDimension; ++d)
    {
      count[d] = std::max<itk::IndexValueType>(1, count[d] / 2);
    }
  }

  Box<VDimension> lattice;
  ForEachIndex(lowest, count, [&](const IndexType & at) {
    VectorType<VDimension> blockPoint;
    for (unsigned int d = 0; d < VDimension; ++d)
    {
      blockPoint[d] = block.low[d] + (block.high[d] - block.low[d]) * static_cast<double>(at[d]) / count[d];
    }
    const VectorType<VDimension> mapped = matrix * blockPoint + offset;
    PointType                    point;
    for (unsigned int d = 0; d < VDimension; ++d)
    {
      point[d] = mapped[d];
    }
    lattice.Include(bspline->TransformPoint(point));
  });

  // Interpolation error between lattice points: s^2/8 times the bound, per block axis.
  const Box<VDimension> source = block;
  for (unsigned int c = 0; c < VDimension; ++c)
  {
    double margin = 0.0;
    for (unsigned int j = 0; j < VDimension; ++j)
    {
      const double actual = (source.high[j] - source.low[j]) / count[j];
      margin += actual * actual / 8.0 * factor[c][j];
    }
    block.low[c] = std::max(lattice.low[c] - margin, box.low[c] + range.low[c]);
    block.high[c] = std::min(lattice.high[c] + margin, box.high[c] + range.high[c]);
  }
  return static_cast<std::size_t>(latticePoints());
}

// The box through a displacement-field stage: two boxes hold every point of `box`, the landing points of the
// samples around it, exact when the field is at the box's resolution, and the box plus the signed range of
// those samples, exact when the field is coarse and smooth. Returns false for a transform without a field.
template <typename TScalar, unsigned int VDimension>
bool
FieldStage(const itk::DisplacementFieldTransform<TScalar, VDimension> * transform, Box<VDimension> & box)
{
  using IndexType = itk::Index<VDimension>;
  const auto * field = transform->GetDisplacementField();
  if (field == nullptr)
  {
    return false;
  }
  const auto            region = field->GetLargestPossibleRegion();
  const auto            size = region.GetSize();
  const Box<VDimension> index = IndexBox(field, box);

  bool      outside = false;
  IndexType first;
  IndexType last;
  for (unsigned int d = 0; d < VDimension; ++d)
  {
    const double low = index.low[d] - static_cast<double>(region.GetIndex()[d]);
    const double high = index.high[d] - static_cast<double>(region.GetIndex()[d]);
    outside = outside || low < -OnLattice || high > static_cast<double>(size[d]) - 1.0 + OnLattice;
    first[d] = region.GetIndex()[d] + ClampedIndex(std::floor(low + OnLattice), size[d]);
    last[d] = region.GetIndex()[d] + ClampedIndex(std::ceil(high - OnLattice), size[d]);
  }

  Box<VDimension> landing;
  Box<VDimension> range;
  ForEachIndex(first, last, [&](const IndexType & at) {
    const auto sample = field->GetPixel(at);
    const auto position = field->template TransformIndexToPhysicalPoint<double>(at);
    range.Include(sample);
    VectorType<VDimension> landed;
    for (unsigned int d = 0; d < VDimension; ++d)
    {
      landed[d] = position[d] + sample[d];
    }
    landing.Include(landed);
  });

  for (unsigned int c = 0; c < VDimension; ++c)
  {
    if (outside)
    {
      // ITK displaces a point up to half a sample past the lattice by what the nearest sample holds, and any
      // further point by nothing.
      double half = 0.0;
      for (unsigned int d = 0; d < VDimension; ++d)
      {
        half += std::abs(field->GetDirection()[c][d]) * field->GetSpacing()[d] / 2.0;
      }
      landing.low[c] = std::min(box.low[c], landing.low[c] - half);
      landing.high[c] = std::max(box.high[c], landing.high[c] + half);
      range.low[c] = std::min(range.low[c], 0.0);
      range.high[c] = std::max(range.high[c], 0.0);
    }
    box.low[c] = std::max(landing.low[c], box.low[c] + range.low[c]);
    box.high[c] = std::min(landing.high[c], box.high[c] + range.high[c]);
  }
  return true;
}

// Carry `box` through one transform, composites recursed into in the order ITK applies their queue (the last
// added first). Linear stages accumulate in `matrix` and `offset`; a B-spline or displacement-field stage
// consumes them. Returns false for a stage of another kind, which leaves `box` unspecified.
template <typename TScalar, unsigned int VDimension>
bool
Stage(const itk::Transform<TScalar, VDimension, VDimension> * transform,
      Box<VDimension> &                                       box,
      MatrixType<VDimension> &                                matrix,
      VectorType<VDimension> &                                offset,
      const VectorType<VDimension> &                          voxel,
      std::size_t &                                           latticePoints)
{
  using PointType = typename itk::Transform<TScalar, VDimension, VDimension>::InputPointType;

  if (transform->IsLinear())
  {
    // An affine map is its image of the origin and of the unit vectors.
    PointType point;
    point.Fill(0.0);
    const auto             origin = transform->TransformPoint(point);
    MatrixType<VDimension> stage;
    VectorType<VDimension> shift;
    for (unsigned int j = 0; j < VDimension; ++j)
    {
      point.Fill(0.0);
      point[j] = 1.0;
      const auto unit = transform->TransformPoint(point);
      for (unsigned int i = 0; i < VDimension; ++i)
      {
        stage[i][j] = unit[i] - origin[i];
      }
      shift[j] = origin[j];
    }
    offset = stage * offset + shift;
    matrix = stage * matrix;
    return true;
  }
  if (const auto * composite = dynamic_cast<const itk::CompositeTransform<TScalar, VDimension> *>(transform))
  {
    for (itk::SizeValueType n = composite->GetNumberOfTransforms(); n > 0; --n)
    {
      if (!Stage(composite->GetNthTransformConstPointer(n - 1), box, matrix, offset, voxel, latticePoints))
      {
        return false;
      }
    }
    return true;
  }
  if (const auto * bspline = dynamic_cast<const itk::BSplineTransform<TScalar, VDimension, 3> *>(transform))
  {
    latticePoints += BSplineStage(bspline, box, matrix, offset, voxel);
  }
  else if (const auto * field = dynamic_cast<const itk::DisplacementFieldTransform<TScalar, VDimension> *>(transform))
  {
    box = MappedBox(box, matrix, offset);
    if (!FieldStage(field, box))
    {
      return false;
    }
  }
  else
  {
    return false;
  }
  matrix.SetIdentity();
  offset.Fill(0.0);
  return true;
}

// The box in moving physical space that every point of `box` lands in, written over `box`. Returns false,
// leaving `box` unspecified, when a stage is neither linear, a cubic B-spline nor a displacement field.
template <typename TScalar, unsigned int VDimension>
bool
Compute(const itk::Transform<TScalar, VDimension, VDimension> * transform,
        Box<VDimension> &                                       box,
        const VectorType<VDimension> &                          voxel,
        std::size_t &                                           latticePoints)
{
  MatrixType<VDimension> matrix;
  VectorType<VDimension> offset;
  matrix.SetIdentity();
  offset.Fill(0.0);
  latticePoints = 0;
  if (!Stage(transform, box, matrix, offset, voxel, latticePoints))
  {
    return false;
  }
  box = MappedBox(box, matrix, offset);
  return true;
}

} // namespace resampleStageBound

#endif

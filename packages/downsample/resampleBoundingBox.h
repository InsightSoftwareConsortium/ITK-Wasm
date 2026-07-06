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
#ifndef resampleBoundingBox_h
#define resampleBoundingBox_h

#include <cstdint>
#include <cmath>
#include <limits>
#include <algorithm>
#include <vector>

#include "itkImage.h"
#include "itkContinuousIndex.h"

/** Plain-data result of a resample bounding box computation.
 *
 * Physical corners (min/max) are stored as separate std::vector<double> members.
 */
struct ResampleBoundingBoxResult
{
  std::vector<int>          paddedStartIndex;
  std::vector<unsigned int> paddedSize;
  std::vector<double>       paddedCornersMin;
  std::vector<double>       paddedCornersMax;
  std::vector<double>       cornersMin;
  std::vector<double>       cornersMax;

  // Diagnostic only (NOT part of the serialized JSON contract): the number of fixed-image points that were
  // sampled and transformed. On the linear fast path this is the 2^Dimension corners; otherwise it is every
  // boundary pixel (all faces and edges). Exposed so tests can confirm which path ran and, for nonlinear
  // transforms, that the algorithm walks the full boundary rather than only the corners.
  std::size_t numberOfBoundaryPoints = 0;

  // Diagnostic only (NOT part of the serialized JSON contract): true when the transform reported itself linear
  // (itk::Transform::IsLinear()) and the corners-only fast path was taken; false when the full boundary was walked.
  bool usedLinearCornerPath = false;
};

/** \class ResampleBoundingBoxComputer
 *
 * \brief Compute the padded moving-image region needed to resample a fixed image
 * grid through a spatial transform.
 *
 * Only image metadata (size, origin, spacing, direction) is used; the fixed and
 * moving pixel buffers are never dereferenced, so the images may arrive with empty
 * data buffers.
 *
 * TTransform is expected to be the abstract itk::Transform<ScalarType, Dimension, Dimension>
 * base instantiated by itk::wasm::SupportInputTransformTypes, so TransformPoint() and
 * IsLinear() are dispatched polymorphically to the concrete transform.
 *
 * Sampling strategy: the fixed grid's bounding box in moving-image space is the min/max of the
 * transformed fixed-grid samples. For a LINEAR (affine, rigid, translation, ...) transform the
 * image of the fixed rectangle is convex, so its axis-aligned bound is attained at the
 * 2^Dimension transformed corners -- the computer detects this via itk::Transform::IsLinear()
 * and samples only the corners. For a NONLINEAR transform an interior boundary pixel can map
 * outside the hull of the transformed corners, so the computer instead walks every boundary
 * pixel (all faces and edges). Both paths feed the identical min/max accumulation below.
 */
template <typename TTransform>
class ResampleBoundingBoxComputer
{
public:
  static constexpr unsigned int Dimension = TTransform::InputSpaceDimension;
  using ImageType = itk::Image<uint8_t, Dimension>;
  using PointType = typename TTransform::InputPointType;

  void
  Compute(const ImageType *           fixedImage,
          const ImageType *           movingImage,
          const TTransform *          transform,
          int                         padding,
          ResampleBoundingBoxResult & result)
  {
    using RegionType = typename ImageType::RegionType;
    using IndexType = typename ImageType::IndexType;
    using SizeType = typename ImageType::SizeType;
    using ContinuousIndexType = itk::ContinuousIndex<double, Dimension>;

    const RegionType region = fixedImage->GetLargestPossibleRegion();
    const IndexType  startIndex = region.GetIndex();
    const SizeType   size = region.GetSize();

    // Number of boundary pixels = total pixels - interior pixels. An interior pixel has every
    // component strictly inside (0, size_d - 1), i.e. one of (size_d - 2) values per axis.
    itk::SizeValueType totalCount = 1;
    itk::SizeValueType interiorCount = 1;
    for (unsigned int d = 0; d < Dimension; ++d)
    {
      totalCount *= size[d];
      interiorCount *= (size[d] > 2) ? (size[d] - 2) : itk::SizeValueType(0);
    }
    const itk::SizeValueType boundaryCount = totalCount - interiorCount;

    // A degenerate fixed region (any axis with size 0, so totalCount and boundaryCount are 0) has no boundary
    // pixels to sample. Report an empty region instead of dereferencing the (empty) min/max accumulators below,
    // whose sentinels would otherwise floor/ceil into garbage indices.
    if (boundaryCount == 0)
    {
      result.paddedStartIndex.assign(Dimension, 0);
      result.paddedSize.assign(Dimension, 0u);
      result.paddedCornersMin.assign(Dimension, 0.0);
      result.paddedCornersMax.assign(Dimension, 0.0);
      result.cornersMin.assign(Dimension, 0.0);
      result.cornersMax.assign(Dimension, 0.0);
      result.numberOfBoundaryPoints = 0;
      return;
    }

    // Reuse the member vector's storage across calls: clear() keeps the existing capacity, reserve() grows it only
    // when this call needs more room than a previous one, and push_back() leaves the vector holding EXACTLY the
    // points enumerated below. This is what keeps a reused instance correct when the sample count changes between
    // calls (e.g. shrinking then growing the fixed image, or switching between the linear and boundary paths): the
    // size always matches the current call, so no stale point from an earlier, larger call can leak into the box.
    m_BoundaryPoints.clear();

    // Linear (affine, rigid, translation, ...) transforms map the fixed rectangle to a convex region, whose
    // axis-aligned bound is attained at the transformed corners. Detect that via itk::Transform::IsLinear()
    // (a virtual dispatched to the concrete transform) and take the corners-only fast path -- 2^Dimension samples
    // instead of every boundary pixel. Both paths produce the identical bounding box for a linear transform;
    // the boundary walk is only needed to keep NONLINEAR transforms correctly bounded (an interior edge pixel can
    // map outside the transformed-corner hull).
    const bool linear = transform->IsLinear();
    result.usedLinearCornerPath = linear;

    if (linear)
    {
      // Enumerate the 2^Dimension corners with a bitmask: bit d selects the low (0) or high (size_d - 1) index
      // component. When an axis has size 1 the low and high indices coincide, harmlessly duplicating corners.
      const std::size_t cornerCount = std::size_t(1) << Dimension;
      m_BoundaryPoints.reserve(cornerCount);
      for (std::size_t mask = 0; mask < cornerCount; ++mask)
      {
        IndexType index;
        for (unsigned int d = 0; d < Dimension; ++d)
        {
          const itk::IndexValueType last = startIndex[d] + static_cast<itk::IndexValueType>(size[d]) - 1;
          index[d] = (mask & (std::size_t(1) << d)) ? last : startIndex[d];
        }
        PointType physicalPoint;
        fixedImage->TransformIndexToPhysicalPoint(index, physicalPoint);
        m_BoundaryPoints.push_back(physicalPoint);
      }
    }
    else
    {
      // Enumerate every boundary pixel (at least one component equal to 0 or size_d - 1) and store
      // its physical location. This includes all faces/edges, not just the 2^N corners, so nonlinear
      // transforms remain correctly bounded. An odometer walks the grid, but whenever a fully interior
      // pixel is reached the fastest axis is fast-forwarded to its last (boundary) column: this keeps
      // enumeration proportional to the number of boundary pixels rather than the total pixel count.
      m_BoundaryPoints.reserve(boundaryCount);
      IndexType index = startIndex;
      while (true)
      {
        bool onBoundary = false;
        for (unsigned int d = 0; d < Dimension; ++d)
        {
          const itk::IndexValueType rel = index[d] - startIndex[d];
          if (rel == 0 || rel == static_cast<itk::IndexValueType>(size[d]) - 1)
          {
            onBoundary = true;
            break;
          }
        }
        if (!onBoundary)
        {
          // Every component is interior, so the fastest axis is interior too; jump it to the last
          // column, which is on the boundary, skipping the interior run in between.
          index[0] = startIndex[0] + static_cast<itk::IndexValueType>(size[0]) - 1;
        }

        PointType physicalPoint;
        fixedImage->TransformIndexToPhysicalPoint(index, physicalPoint);
        m_BoundaryPoints.push_back(physicalPoint);

        // Odometer increment, fastest axis first.
        unsigned int d = 0;
        for (; d < Dimension; ++d)
        {
          ++index[d];
          if (index[d] < startIndex[d] + static_cast<itk::IndexValueType>(size[d]))
          {
            break;
          }
          index[d] = startIndex[d];
        }
        if (d == Dimension)
        {
          break;
        }
      }
    }
    result.numberOfBoundaryPoints = m_BoundaryPoints.size();

    // Apply the transform to each boundary point, accumulating the tight physical-space min/max
    // (in moving image physical space) and the moving-image continuous-index min/max, per axis.
    std::vector<double> physMin(Dimension, std::numeric_limits<double>::max());
    std::vector<double> physMax(Dimension, std::numeric_limits<double>::lowest());
    std::vector<double> continuousIndexMin(Dimension, std::numeric_limits<double>::max());
    std::vector<double> continuousIndexMax(Dimension, std::numeric_limits<double>::lowest());

    for (const auto & boundaryPoint : m_BoundaryPoints)
    {
      const auto          movingPoint = transform->TransformPoint(boundaryPoint);
      ContinuousIndexType continuousIndex;
      movingImage->TransformPhysicalPointToContinuousIndex(movingPoint, continuousIndex);
      for (unsigned int d = 0; d < Dimension; ++d)
      {
        physMin[d] = std::min(physMin[d], static_cast<double>(movingPoint[d]));
        physMax[d] = std::max(physMax[d], static_cast<double>(movingPoint[d]));
        continuousIndexMin[d] = std::min(continuousIndexMin[d], static_cast<double>(continuousIndex[d]));
        continuousIndexMax[d] = std::max(continuousIndexMax[d], static_cast<double>(continuousIndex[d]));
      }
    }

    // Convert the continuous-index bounds to an integer index region and pad outward per side.
    result.paddedStartIndex.resize(Dimension);
    result.paddedSize.resize(Dimension);
    IndexType paddedStart;
    IndexType paddedEnd;
    for (unsigned int d = 0; d < Dimension; ++d)
    {
      const itk::IndexValueType startIdx = static_cast<itk::IndexValueType>(std::floor(continuousIndexMin[d]));
      const itk::IndexValueType endIdx = static_cast<itk::IndexValueType>(std::ceil(continuousIndexMax[d]));
      const itk::IndexValueType paddedStartValue = startIdx - padding;
      const itk::IndexValueType paddedEndValue = endIdx + padding;
      const itk::IndexValueType paddedSizeValue =
        std::max<itk::IndexValueType>(0, paddedEndValue - paddedStartValue + 1);

      result.paddedStartIndex[d] = static_cast<int>(paddedStartValue);
      result.paddedSize[d] = static_cast<unsigned int>(paddedSizeValue);
      paddedStart[d] = paddedStartValue;
      paddedEnd[d] = paddedStartValue + paddedSizeValue - 1;
    }

    // Physical corners of the padded region come from the moving image grid.
    PointType paddedMinPoint;
    PointType paddedMaxPoint;
    movingImage->TransformIndexToPhysicalPoint(paddedStart, paddedMinPoint);
    movingImage->TransformIndexToPhysicalPoint(paddedEnd, paddedMaxPoint);

    result.paddedCornersMin.resize(Dimension);
    result.paddedCornersMax.resize(Dimension);
    result.cornersMin.resize(Dimension);
    result.cornersMax.resize(Dimension);
    for (unsigned int d = 0; d < Dimension; ++d)
    {
      result.paddedCornersMin[d] = static_cast<double>(paddedMinPoint[d]);
      result.paddedCornersMax[d] = static_cast<double>(paddedMaxPoint[d]);
      result.cornersMin[d] = physMin[d];
      result.cornersMax[d] = physMax[d];
    }
  }

private:
  // Reusable storage for the physical locations of the fixed image boundary pixels.
  std::vector<typename TTransform::InputPointType> m_BoundaryPoints;
};

#endif

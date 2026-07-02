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

// In-process unit test for ResampleBoundingBoxComputer. Unlike the resample-bounding-box CLI CTest (which
// round-trips through the .iwi/.iwt WebAssembly interface and only checks the exit code), this test constructs
// the fixed image, moving image, and transform directly and asserts the EXACT reported region for every case in
// the dispatch matrix -- 2D translation, 3D translation, and a 2D affine rotation. Those asserted numbers are the
// cross-surface source of truth: the TypeScript and Python suites assert the identical regions for identical
// inputs. It also exercises the Phase-04 hardening: full-boundary (not corners-only) sampling, symmetric padding,
// padding-independent tight corners, a degenerate zero-size axis, and reuse of one instance across differing
// boundary counts. It never touches a pixel buffer, matching the pipeline's metadata-only contract.

#include <cmath>
#include <cstdint>
#include <cstdlib>
#include <array>
#include <iostream>
#include <string>
#include <vector>

#include "itkImage.h"
#include "itkTransform.h"
#include "itkTranslationTransform.h"
#include "itkAffineTransform.h"

#include "resampleBoundingBox.h"

namespace
{

int g_failures = 0;

void
checkTrue(bool condition, const std::string & message)
{
  if (!condition)
  {
    std::cerr << "FAIL: " << message << std::endl;
    ++g_failures;
  }
}

template <typename TActual>
void
printVec(const std::string & prefix, const std::vector<TActual> & values)
{
  std::cerr << prefix << " [";
  for (std::size_t i = 0; i < values.size(); ++i)
  {
    std::cerr << (i ? ", " : "") << values[i];
  }
  std::cerr << "]" << std::endl;
}

// Compare an integer-like result vector (paddedStartIndex / paddedSize) against expected values exactly.
template <typename TActual>
void
checkIntVec(const std::vector<TActual> & actual, const std::vector<long> & expected, const std::string & label)
{
  bool ok = actual.size() == expected.size();
  for (std::size_t i = 0; ok && i < expected.size(); ++i)
  {
    ok = static_cast<long>(actual[i]) == expected[i];
  }
  if (!ok)
  {
    std::cerr << "FAIL: " << label << std::endl;
    printVec("  actual  ", actual);
    printVec("  expected", expected);
    ++g_failures;
  }
}

// Compare a physical-coordinate result vector (corners / paddedCorners) against expected values within a tolerance.
void
checkDoubleVec(const std::vector<double> & actual,
               const std::vector<double> & expected,
               double                      tolerance,
               const std::string &         label)
{
  bool ok = actual.size() == expected.size();
  for (std::size_t i = 0; ok && i < expected.size(); ++i)
  {
    ok = std::abs(actual[i] - expected[i]) <= tolerance;
  }
  if (!ok)
  {
    std::cerr << "FAIL: " << label << std::endl;
    printVec("  actual  ", actual);
    printVec("  expected", expected);
    ++g_failures;
  }
}

// Build a metadata-only uint8 image (identity direction). The buffer is allocated but never read by the computer.
template <unsigned int VDimension>
typename itk::Image<uint8_t, VDimension>::Pointer
makeImage(const std::array<itk::SizeValueType, VDimension> & size,
          const std::array<double, VDimension> &             spacing,
          const std::array<double, VDimension> &             origin)
{
  using ImageType = itk::Image<uint8_t, VDimension>;
  auto                            image = ImageType::New();
  typename ImageType::SizeType    regionSize;
  typename ImageType::SpacingType imageSpacing;
  typename ImageType::PointType   imageOrigin;
  for (unsigned int d = 0; d < VDimension; ++d)
  {
    regionSize[d] = size[d];
    imageSpacing[d] = spacing[d];
    imageOrigin[d] = origin[d];
  }
  image->SetRegions(typename ImageType::RegionType(regionSize));
  image->SetSpacing(imageSpacing);
  image->SetOrigin(imageOrigin);
  image->Allocate();
  image->FillBuffer(0);
  return image;
}

itk::AffineTransform<double, 2>::Pointer
rotationAffine()
{
  using AffineType = itk::AffineTransform<double, 2>;
  auto                        affine = AffineType::New();
  AffineType::InputPointType  center;
  center[0] = 9.5;
  center[1] = 4.5;
  affine->SetCenter(center);
  AffineType::MatrixType matrix;
  matrix(0, 0) = 0.8;
  matrix(0, 1) = -0.6;
  matrix(1, 0) = 0.6;
  matrix(1, 1) = 0.8;
  affine->SetMatrix(matrix);
  AffineType::OutputVectorType translation;
  translation[0] = 10.0;
  translation[1] = 10.0;
  affine->SetTranslation(translation);
  return affine;
}

// ---- 2D translation: fixed 16x16 sp(2,2) o(10,20), moving 64x64 sp(1,1) o(0,0), translation (10,5). ----
void
test2DTranslation()
{
  using TransformType = itk::Transform<double, 2, 2>;
  auto fixed = makeImage<2>({ 16, 16 }, { 2.0, 2.0 }, { 10.0, 20.0 });
  auto moving = makeImage<2>({ 64, 64 }, { 1.0, 1.0 }, { 0.0, 0.0 });

  auto                            translation = itk::TranslationTransform<double, 2>::New();
  itk::TranslationTransform<double, 2>::OutputVectorType offset;
  offset[0] = 10.0;
  offset[1] = 5.0;
  translation->SetOffset(offset);
  const TransformType * transform = translation.GetPointer();

  ResampleBoundingBoxComputer<TransformType> computer;
  ResampleBoundingBoxResult                  result;
  computer.Compute(fixed, moving, transform, 1, result);

  checkIntVec(result.paddedStartIndex, { 19, 24 }, "2D translation paddedStartIndex");
  checkIntVec(result.paddedSize, { 33, 33 }, "2D translation paddedSize");
  checkDoubleVec(result.cornersMin, { 20.0, 25.0 }, 1e-9, "2D translation corners.min");
  checkDoubleVec(result.cornersMax, { 50.0, 55.0 }, 1e-9, "2D translation corners.max");
  checkDoubleVec(result.paddedCornersMin, { 19.0, 24.0 }, 1e-9, "2D translation paddedCorners.min");
  checkDoubleVec(result.paddedCornersMax, { 51.0, 56.0 }, 1e-9, "2D translation paddedCorners.max");
  // 16*16 total - 14*14 interior = 60 boundary pixels (all four edges), not just the 4 corners.
  checkTrue(result.numberOfBoundaryPoints == 60, "2D translation samples the full boundary (60 pixels)");
}

// ---- 3D translation: fixed 8^3 sp(2,2,2) o(10,20,30), moving 64^3 sp(1,1,1) o(0,0,0), translation (10,5,3). ----
void
test3DTranslation()
{
  using TransformType = itk::Transform<double, 3, 3>;
  auto fixed = makeImage<3>({ 8, 8, 8 }, { 2.0, 2.0, 2.0 }, { 10.0, 20.0, 30.0 });
  auto moving = makeImage<3>({ 64, 64, 64 }, { 1.0, 1.0, 1.0 }, { 0.0, 0.0, 0.0 });

  auto                            translation = itk::TranslationTransform<double, 3>::New();
  itk::TranslationTransform<double, 3>::OutputVectorType offset;
  offset[0] = 10.0;
  offset[1] = 5.0;
  offset[2] = 3.0;
  translation->SetOffset(offset);
  const TransformType * transform = translation.GetPointer();

  ResampleBoundingBoxComputer<TransformType> computer;
  ResampleBoundingBoxResult                  result;
  computer.Compute(fixed, moving, transform, 1, result);

  checkIntVec(result.paddedStartIndex, { 19, 24, 32 }, "3D translation paddedStartIndex");
  checkIntVec(result.paddedSize, { 17, 17, 17 }, "3D translation paddedSize");
  checkDoubleVec(result.cornersMin, { 20.0, 25.0, 33.0 }, 1e-9, "3D translation corners.min");
  checkDoubleVec(result.cornersMax, { 34.0, 39.0, 47.0 }, 1e-9, "3D translation corners.max");
  checkDoubleVec(result.paddedCornersMin, { 19.0, 24.0, 32.0 }, 1e-9, "3D translation paddedCorners.min");
  checkDoubleVec(result.paddedCornersMax, { 35.0, 40.0, 48.0 }, 1e-9, "3D translation paddedCorners.max");
  // 8^3 total - 6^3 interior = 296 boundary voxels (all six faces), not just the 8 corners.
  checkTrue(result.numberOfBoundaryPoints == 296, "3D translation samples the full boundary (296 voxels)");

  // padding 0 shrinks by exactly one voxel per side.
  ResampleBoundingBoxResult tight;
  computer.Compute(fixed, moving, transform, 0, tight);
  checkIntVec(tight.paddedStartIndex, { 20, 25, 33 }, "3D translation padding 0 paddedStartIndex");
  checkIntVec(tight.paddedSize, { 15, 15, 15 }, "3D translation padding 0 paddedSize");
}

// ---- 2D affine rotation: fixed 20x10 sp(1,1) o(0,0), moving 64x64 sp(1,1) o(0,0). ----
// The rotation (cos 0.8, sin 0.6, about the grid center) maps the fixed grid to a tilted rectangle whose extremes
// are non-axis-aligned. Because the transform is affine, the tight bound is achieved at the four rotated CORNERS
// -- so asserting the reported corners equal the analytic transformed-corner extremes confirms the region tightly
// bounds the rotated grid. The exhaustive boundary enumeration (verified via numberOfBoundaryPoints below) is what
// additionally keeps NONLINEAR transforms bounded, where interior edge pixels can exceed the transformed corners.
void
test2DRotation()
{
  using TransformType = itk::Transform<double, 2, 2>;
  auto fixed = makeImage<2>({ 20, 10 }, { 1.0, 1.0 }, { 0.0, 0.0 });
  auto moving = makeImage<2>({ 64, 64 }, { 1.0, 1.0 }, { 0.0, 0.0 });

  const auto            affine = rotationAffine();
  const TransformType * transform = affine.GetPointer();

  ResampleBoundingBoxComputer<TransformType> computer;
  ResampleBoundingBoxResult                  result;
  computer.Compute(fixed, moving, transform, 1, result);

  checkDoubleVec(result.cornersMin, { 9.2, 5.2 }, 1e-9, "2D rotation corners.min (tight rotated-grid bound)");
  checkDoubleVec(result.cornersMax, { 29.8, 23.8 }, 1e-9, "2D rotation corners.max (tight rotated-grid bound)");
  checkIntVec(result.paddedStartIndex, { 8, 4 }, "2D rotation paddedStartIndex");
  checkIntVec(result.paddedSize, { 24, 22 }, "2D rotation paddedSize");
  checkDoubleVec(result.paddedCornersMin, { 8.0, 4.0 }, 1e-9, "2D rotation paddedCorners.min");
  checkDoubleVec(result.paddedCornersMax, { 31.0, 25.0 }, 1e-9, "2D rotation paddedCorners.max");
  // 20*10 total - 18*8 interior = 56 boundary pixels. A corners-only implementation would sample only 4; asserting
  // 56 proves the full boundary (every edge pixel) is transformed.
  checkTrue(result.numberOfBoundaryPoints == 56, "2D rotation samples the full boundary, not just corners (56 vs 4)");
}

// ---- Padding is symmetric per side, and the unpadded (tight) corners are padding-independent. ----
void
testPaddingSymmetry()
{
  using TransformType = itk::Transform<double, 2, 2>;
  auto fixed = makeImage<2>({ 16, 16 }, { 2.0, 2.0 }, { 10.0, 20.0 });
  auto moving = makeImage<2>({ 64, 64 }, { 1.0, 1.0 }, { 0.0, 0.0 });
  auto                            translation = itk::TranslationTransform<double, 2>::New();
  itk::TranslationTransform<double, 2>::OutputVectorType offset;
  offset[0] = 10.0;
  offset[1] = 5.0;
  translation->SetOffset(offset);
  const TransformType * transform = translation.GetPointer();

  ResampleBoundingBoxComputer<TransformType> computer;
  ResampleBoundingBoxResult                  base;
  computer.Compute(fixed, moving, transform, 0, base); // tight, unpadded

  for (int padding : { 1, 3, 5 })
  {
    ResampleBoundingBoxResult padded;
    computer.Compute(fixed, moving, transform, padding, padded);
    for (unsigned int d = 0; d < 2; ++d)
    {
      // Symmetric: the start moves out by exactly `padding` and the size grows by exactly 2 * padding.
      checkTrue(padded.paddedStartIndex[d] == base.paddedStartIndex[d] - padding,
                "padding start symmetry axis " + std::to_string(d) + " padding " + std::to_string(padding));
      checkTrue(padded.paddedSize[d] == base.paddedSize[d] + 2u * static_cast<unsigned int>(padding),
                "padding size symmetry axis " + std::to_string(d) + " padding " + std::to_string(padding));
    }
    // The tight corners never move with padding.
    checkDoubleVec(padded.cornersMin, base.cornersMin, 1e-12,
                   "corners.min padding-independent (padding " + std::to_string(padding) + ")");
    checkDoubleVec(padded.cornersMax, base.cornersMax, 1e-12,
                   "corners.max padding-independent (padding " + std::to_string(padding) + ")");
  }
}

// ---- A degenerate fixed image (a zero-length axis) yields an empty region rather than crashing. ----
void
testDegenerateAxis()
{
  using TransformType = itk::Transform<double, 2, 2>;
  auto fixed = makeImage<2>({ 16, 0 }, { 2.0, 2.0 }, { 10.0, 20.0 }); // zero-size second axis
  auto moving = makeImage<2>({ 64, 64 }, { 1.0, 1.0 }, { 0.0, 0.0 });
  auto                            translation = itk::TranslationTransform<double, 2>::New();
  itk::TranslationTransform<double, 2>::OutputVectorType offset;
  offset[0] = 10.0;
  offset[1] = 5.0;
  translation->SetOffset(offset);
  const TransformType * transform = translation.GetPointer();

  ResampleBoundingBoxComputer<TransformType> computer;
  ResampleBoundingBoxResult                  result;
  computer.Compute(fixed, moving, transform, 1, result);

  checkIntVec(result.paddedSize, { 0, 0 }, "degenerate axis -> empty paddedSize");
  checkTrue(result.numberOfBoundaryPoints == 0, "degenerate axis -> no boundary points");
}

// Value-equality of two results, used to prove instance reuse leaves no stale state.
bool
resultsEqual(const ResampleBoundingBoxResult & a, const ResampleBoundingBoxResult & b)
{
  return a.paddedStartIndex == b.paddedStartIndex && a.paddedSize == b.paddedSize &&
         a.paddedCornersMin == b.paddedCornersMin && a.paddedCornersMax == b.paddedCornersMax &&
         a.cornersMin == b.cornersMin && a.cornersMax == b.cornersMax &&
         a.numberOfBoundaryPoints == b.numberOfBoundaryPoints;
}

// ---- Reusing one instance across calls with DIFFERENT boundary counts must not leak stale boundary points. ----
// The result for a 16x16 fixed image must be identical whether computed on a fresh instance, or on an instance
// previously used with a LARGER (24x24) fixed image, or with a SMALLER (4x4) one -- exercising both shrinking and
// growing of the reused boundary-point storage.
void
testInstanceReuse()
{
  using TransformType = itk::Transform<double, 2, 2>;
  auto moving = makeImage<2>({ 64, 64 }, { 1.0, 1.0 }, { 0.0, 0.0 });
  auto                            translation = itk::TranslationTransform<double, 2>::New();
  itk::TranslationTransform<double, 2>::OutputVectorType offset;
  offset[0] = 10.0;
  offset[1] = 5.0;
  translation->SetOffset(offset);
  const TransformType * transform = translation.GetPointer();

  auto target = makeImage<2>({ 16, 16 }, { 2.0, 2.0 }, { 10.0, 20.0 }); // boundary count 60
  auto bigger = makeImage<2>({ 24, 24 }, { 2.0, 2.0 }, { 10.0, 20.0 }); // boundary count 92
  auto smaller = makeImage<2>({ 4, 4 }, { 2.0, 2.0 }, { 10.0, 20.0 });  // boundary count 12

  ResampleBoundingBoxResult fresh;
  {
    ResampleBoundingBoxComputer<TransformType> freshComputer;
    freshComputer.Compute(target, moving, transform, 1, fresh);
  }
  checkTrue(fresh.numberOfBoundaryPoints == 60, "reuse baseline boundary count (16x16 -> 60)");

  // Same instance: shrink from a bigger prior call, then grow to the target.
  ResampleBoundingBoxComputer<TransformType> reused;
  ResampleBoundingBoxResult                  scratch;
  reused.Compute(bigger, moving, transform, 1, scratch);
  checkTrue(scratch.numberOfBoundaryPoints == 92, "reuse prior bigger boundary count (24x24 -> 92)");
  ResampleBoundingBoxResult afterBigger;
  reused.Compute(target, moving, transform, 1, afterBigger);
  checkTrue(resultsEqual(afterBigger, fresh), "reuse after a bigger call matches fresh (no stale points)");

  // Same instance: grow from a smaller prior call.
  reused.Compute(smaller, moving, transform, 1, scratch);
  checkTrue(scratch.numberOfBoundaryPoints == 12, "reuse prior smaller boundary count (4x4 -> 12)");
  ResampleBoundingBoxResult afterSmaller;
  reused.Compute(target, moving, transform, 1, afterSmaller);
  checkTrue(resultsEqual(afterSmaller, fresh), "reuse after a smaller call matches fresh (no stale points)");
}

} // namespace

int
main()
{
  test2DTranslation();
  test3DTranslation();
  test2DRotation();
  testPaddingSymmetry();
  testDegenerateAxis();
  testInstanceReuse();

  if (g_failures == 0)
  {
    std::cout << "All resample-bounding-box unit checks passed." << std::endl;
    return EXIT_SUCCESS;
  }
  std::cerr << g_failures << " resample-bounding-box unit check(s) failed." << std::endl;
  return EXIT_FAILURE;
}

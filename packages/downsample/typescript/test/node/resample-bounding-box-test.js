import test from 'ava'

import {
  Image,
  ImageType,
  IntTypes,
  PixelTypes,
  Transform,
  TransformType,
  TransformParameterizations,
  FloatTypes
} from 'itk-wasm'

import { resampleBoundingBoxNode } from '../../dist/index-node.js'

// The resample-bounding-box pipeline reads ONLY image metadata (size, spacing, origin, direction); the pixel
// buffers are never dereferenced. These helpers therefore build "metadata-only" images whose data buffer is
// empty -- the real payoff of the pipeline is that a caller can describe two images and a transform with a few
// numbers and learn exactly which region of the moving image to fetch, without ever holding pixels. They are
// dimension-generic so the same helpers cover the 2D and 3D cases; the case table below parametrizes the bodies
// rather than copy-pasting a whole test per dimension/transform.

function identityDirection (dimension) {
  const direction = new Float64Array(dimension * dimension)
  for (let i = 0; i < dimension; i++) {
    direction[i * dimension + i] = 1
  }
  return direction
}

// A single-component, uint8 image of arbitrary dimension with the given geometry and an EMPTY pixel buffer.
function metadataOnlyImage (size, spacing, origin) {
  const dimension = size.length
  const imageType = new ImageType(dimension, IntTypes.UInt8, PixelTypes.Scalar, 1)
  const image = new Image(imageType)
  image.size = size
  image.spacing = spacing
  image.origin = origin
  image.direction = identityDirection(dimension)
  image.data = new Uint8Array(0) // no pixels -- exercise the metadata-only contract
  return image
}

// A single-entry TransformList holding a float64 TranslationTransform (dimension inferred from the offset).
function translationTransform (offset) {
  const dimension = offset.length
  const transformType = new TransformType(TransformParameterizations.Translation, FloatTypes.Float64, dimension, dimension)
  const transform = new Transform(transformType)
  transform.name = 'TranslationTransform'
  transform.numberOfFixedParameters = 0
  transform.numberOfParameters = dimension
  transform.fixedParameters = Float64Array.from([])
  transform.parameters = Float64Array.from(offset)
  return [transform]
}

// A single-entry TransformList holding a float64 AffineTransform. ITK's MatrixOffsetTransformBase packs its
// parameters as the row-major matrix followed by the translation, and its fixed parameters as the center of
// rotation -- so parameters = [...matrixRowMajor, ...translation], fixedParameters = center. This exactly mirrors
// how resample-bounding-box-generate-inputs builds the transform in C++, so all three surfaces agree.
function affineTransform (matrixRowMajor, translation, center) {
  const dimension = translation.length
  const transformType = new TransformType(TransformParameterizations.Affine, FloatTypes.Float64, dimension, dimension)
  const transform = new Transform(transformType)
  transform.name = 'AffineTransform'
  transform.numberOfFixedParameters = center.length
  transform.numberOfParameters = matrixRowMajor.length + translation.length
  transform.fixedParameters = Float64Array.from(center)
  transform.parameters = Float64Array.from([...matrixRowMajor, ...translation])
  return [transform]
}

// Physical-coordinate arrays (corners) can carry floating-point rounding (e.g. the rotation's 5.2000000000000002),
// so compare them within a tolerance; integer index arrays are compared exactly with deepEqual.
function closeTo (t, actual, expected, tolerance = 1e-9) {
  t.is(actual.length, expected.length)
  for (let i = 0; i < expected.length; i++) {
    t.true(Math.abs(actual[i] - expected[i]) <= tolerance, `index ${i}: ${actual[i]} vs ${expected[i]}`)
  }
}

// Cross-surface case table. Every region here is asserted identically by the C++ unit test
// (resample-bounding-box-test.cxx) and the Python suite, and is exercised end-to-end by the C++ CTests, so the
// C++, TypeScript, and Python results are provably identical for the same inputs.
//   2D translation: fixed 16x16 sp(2,2) o(10,20), translation (10,5)          -> corners [20,50] x [25,55]
//   3D translation: fixed 8^3 sp(2,2,2) o(10,20,30), translation (10,5,3)     -> corners [20,34]x[25,39]x[33,47]
//   2D rotation    : fixed 20x10 sp(1,1) o(0,0), affine rot(cos.8,sin.6)@(9.5,4.5)+t(10,10) -> corners [9.2,29.8]x[5.2,23.8]
// Moving image is spacing (1,1[,1]) origin 0 throughout, so continuous index == physical coordinate.
const cases = [
  {
    name: '2D translation',
    fixed: () => metadataOnlyImage([16, 16], [2, 2], [10, 20]),
    moving: () => metadataOnlyImage([64, 64], [1, 1], [0, 0]),
    transform: () => translationTransform([10, 5]),
    corners: { min: [20, 25], max: [50, 55] },
    padding1: { start: [19, 24], size: [33, 33], paddedMin: [19, 24], paddedMax: [51, 56] },
    padding0: { start: [20, 25], size: [31, 31], paddedMin: [20, 25], paddedMax: [50, 55] }
  },
  {
    name: '3D translation',
    fixed: () => metadataOnlyImage([8, 8, 8], [2, 2, 2], [10, 20, 30]),
    moving: () => metadataOnlyImage([64, 64, 64], [1, 1, 1], [0, 0, 0]),
    transform: () => translationTransform([10, 5, 3]),
    corners: { min: [20, 25, 33], max: [34, 39, 47] },
    padding1: { start: [19, 24, 32], size: [17, 17, 17], paddedMin: [19, 24, 32], paddedMax: [35, 40, 48] },
    padding0: { start: [20, 25, 33], size: [15, 15, 15], paddedMin: [20, 25, 33], paddedMax: [34, 39, 47] }
  },
  {
    name: '2D rotation (affine)',
    fixed: () => metadataOnlyImage([20, 10], [1, 1], [0, 0]),
    moving: () => metadataOnlyImage([64, 64], [1, 1], [0, 0]),
    transform: () => affineTransform([0.8, -0.6, 0.6, 0.8], [10, 10], [9.5, 4.5]),
    corners: { min: [9.2, 5.2], max: [29.8, 23.8] },
    padding1: { start: [8, 4], size: [24, 22], paddedMin: [8, 4], paddedMax: [31, 25] },
    padding0: { start: [9, 5], size: [22, 20], paddedMin: [9, 5], paddedMax: [30, 24] }
  }
]

for (const c of cases) {
  test(`resampleBoundingBoxNode returns the padded moving-image region for ${c.name}`, async t => {
    // padding 1 (default): the region bounds the transformed fixed grid plus one pixel per side.
    const { boundingBox: padded } = await resampleBoundingBoxNode(c.transform(), c.fixed(), c.moving(), { padding: 1 })

    // Tight corners are padding-independent and match the analytic transformed-grid extremes.
    closeTo(t, padded.corners.min, c.corners.min)
    closeTo(t, padded.corners.max, c.corners.max)

    t.deepEqual(padded.paddedStartIndex, c.padding1.start)
    t.deepEqual(padded.paddedSize, c.padding1.size)
    closeTo(t, padded.paddedCorners.min, c.padding1.paddedMin)
    closeTo(t, padded.paddedCorners.max, c.padding1.paddedMax)

    // padding 0: the empty-data images are accepted (metadata-only contract); the padded corners collapse to the
    // integer-index bound of the tight corners (floor(min)/ceil(max), equal to the tight corners only when they
    // already fall on grid lines, as in the translation cases -- but not the rotation); and the region is exactly
    // one pixel smaller per side than the padding-1 region (symmetric padding).
    const { boundingBox: tight } = await resampleBoundingBoxNode(c.transform(), c.fixed(), c.moving(), { padding: 0 })
    t.deepEqual(tight.paddedStartIndex, c.padding0.start)
    t.deepEqual(tight.paddedSize, c.padding0.size)
    closeTo(t, tight.paddedCorners.min, c.padding0.paddedMin)
    closeTo(t, tight.paddedCorners.max, c.padding0.paddedMax)

    for (let axis = 0; axis < c.corners.min.length; axis++) {
      t.is(tight.paddedStartIndex[axis], padded.paddedStartIndex[axis] + 1)
      t.is(tight.paddedSize[axis], padded.paddedSize[axis] - 2)
    }
  })
}

test('resampleBoundingBoxNode bounds a B-spline through its stages', async t => {
  // A cubic B-spline whose displacement peaks inside the grid: the region holds what the boundary misses.
  // resample-bounding-box-test.cxx and the Python suite assert the same regions for the same blocks.
  const gridSize = [7, 6]
  const round = value => Math.round(value * 1e6) / 1e6
  const x = []
  const y = []
  // ITK lays the parameters out one component after the other, x fastest.
  for (let iy = 0; iy < gridSize[1]; iy++) {
    for (let ix = 0; ix < gridSize[0]; ix++) {
      x.push(round(6.0 * Math.sin(ix * 1.1 + iy * 0.7) + 2.0 * Math.cos(iy * 0.5)))
      y.push(round(-5.0 * Math.cos(ix * 0.9 - iy * 0.6) + 3.0 * Math.sin(ix * 0.4)))
    }
  }
  const transformType = new TransformType(TransformParameterizations.BSpline, FloatTypes.Float64, 2, 2)
  const transform = new Transform(transformType)
  transform.name = 'BSplineTransform'
  // Grid size, origin, spacing, direction.
  transform.fixedParameters = Float64Array.from([...gridSize, -16, -16, 16, 16, 1, 0, 0, 1])
  transform.numberOfFixedParameters = 10
  transform.parameters = Float64Array.from([...x, ...y])
  transform.numberOfParameters = transform.parameters.length

  const moving = () => metadataOnlyImage([128, 128], [1, 1], [-32, -32])
  const blocks = [
    { origin: [0, 0], size: [32, 32], start: [30, 28], paddedSize: [34, 38] },
    { origin: [24, 20], size: [40, 24], start: [50, 50], paddedSize: [52, 33] },
    { origin: [8, 40], size: [48, 16], start: [31, 67], paddedSize: [66, 30] }
  ]
  for (const block of blocks) {
    const fixed = metadataOnlyImage(block.size, [1, 1], block.origin)
    const { boundingBox } = await resampleBoundingBoxNode([transform], fixed, moving())
    t.deepEqual(boundingBox.paddedStartIndex, block.start)
    t.deepEqual(boundingBox.paddedSize, block.paddedSize)
  }
})

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
// numbers and learn exactly which region of the moving image to fetch, without ever holding pixels.

// A 2D, single-component, uint8 image with the given geometry and an EMPTY pixel buffer.
function metadataOnlyImage (size, spacing, origin) {
  const imageType = new ImageType(2, IntTypes.UInt8, PixelTypes.Scalar, 1)
  const image = new Image(imageType)
  image.size = size
  image.spacing = spacing
  image.origin = origin
  image.direction = Float64Array.from([1, 0, 0, 1]) // identity
  image.data = new Uint8Array(0) // no pixels -- exercise the metadata-only contract
  return image
}

// A single-entry TransformList holding a 2D, float64 TranslationTransform with the given offset.
function translationTransform (offset) {
  const transformType = new TransformType(
    TransformParameterizations.Translation,
    FloatTypes.Float64,
    2,
    2
  )
  const transform = new Transform(transformType)
  transform.name = 'TranslationTransform'
  transform.numberOfFixedParameters = 0
  transform.numberOfParameters = 2
  transform.fixedParameters = Float64Array.from([])
  transform.parameters = Float64Array.from(offset)
  return [transform]
}

// Shared geometry (matches the self-contained C++ CTest inputs, whose output is independently verified):
//   fixed : 16x16, spacing (2,2), origin (10,20)  -> physical grid [10,40] x [20,50]
//   moving: 64x64, spacing (1,1), origin  (0, 0)  -> continuous index == physical coordinate
//   transform: translation (10,5)                 -> fixed grid maps to [20,50] x [25,55]
// The tight (unpadded) moving-image region is therefore start (20,25), inclusive-end (50,55).
const fixedImage = () => metadataOnlyImage([16, 16], [2, 2], [10, 20])
const movingImage = () => metadataOnlyImage([64, 64], [1, 1], [0, 0])
const transform = () => translationTransform([10, 5])

test('resampleBoundingBoxNode returns the padded region for a translation (padding 1)', async t => {
  const { boundingBox } = await resampleBoundingBoxNode(transform(), fixedImage(), movingImage(), {
    padding: 1
  })

  // Tight corners are padding-independent: the translated fixed grid, [20,50] x [25,55].
  t.deepEqual(boundingBox.corners.min, [20, 25])
  t.deepEqual(boundingBox.corners.max, [50, 55])

  // With one pixel of padding per side the integer region grows outward by one on every side.
  t.deepEqual(boundingBox.paddedStartIndex, [19, 24])
  t.deepEqual(boundingBox.paddedSize, [33, 33]) // (50-20) + 1 tight, +2 for padding => 33

  // Padded corners are the physical location of the padded start and inclusive-end indices in the moving image.
  t.deepEqual(boundingBox.paddedCorners.min, [19, 24])
  t.deepEqual(boundingBox.paddedCorners.max, [51, 56])
})

test('resampleBoundingBoxNode with padding 0 shrinks by exactly one pixel per side and accepts empty pixel data', async t => {
  const padded = await resampleBoundingBoxNode(transform(), fixedImage(), movingImage(), { padding: 1 })
  const tight = await resampleBoundingBoxNode(transform(), fixedImage(), movingImage(), { padding: 0 })

  // The empty-data moving image was accepted without error (metadata-only contract holds).
  t.deepEqual(tight.boundingBox.paddedStartIndex, [20, 25])
  t.deepEqual(tight.boundingBox.paddedSize, [31, 31])

  // With no padding the region is exactly the tight corners.
  t.deepEqual(tight.boundingBox.paddedCorners.min, tight.boundingBox.corners.min)
  t.deepEqual(tight.boundingBox.paddedCorners.max, tight.boundingBox.corners.max)

  // Compared with the default (padding 1), padding 0 shrinks the region by exactly one pixel on every side:
  // the start index moves in by one and the size shrinks by two (one per side) on each axis.
  for (let axis = 0; axis < 2; axis++) {
    t.is(tight.boundingBox.paddedStartIndex[axis], padded.boundingBox.paddedStartIndex[axis] + 1)
    t.is(tight.boundingBox.paddedSize[axis], padded.boundingBox.paddedSize[axis] - 2)
  }
})

import test from 'ava'
import path from 'path'

import { readImageNode } from '@itk-wasm/image-io'
import { compareImagesNode } from '@itk-wasm/compare-images'
import {
  Image,
  PixelTypes,
  Transform,
  TransformType,
  TransformParameterizations,
  FloatTypes
} from 'itk-wasm'

import { resampleNode, resampleToReferenceNode } from '../../dist/index-node.js'
import { testInputPath } from './common.js'

// A single-entry TransformList holding a float64 TranslationTransform (dimension inferred from the offset).
// A Translation is a distinct parameterization from Affine, with only `dimension` parameters (the offset) and
// no fixed parameters -- the pipeline reconstructs it generically rather than forcing it into an affine.
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
// rotation -- so parameters = [...matrixRowMajor, ...translation], fixedParameters = center.
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

// Spacing-only convenience: given `outputSpacing` but no `size`, the pipeline auto-computes the size so the
// output covers the same physical extent as the input. cthead1 is 256x256 with unit spacing, so doubling the
// spacing to 2 halves the size to 128 (256 * 1 == 128 * 2); origin and direction are inherited unchanged.
test('Test resampleNode auto-computes the size from output spacing alone', async t => {
  const movingFilePath = path.join(testInputPath, 'cthead1.png')
  const moving = await readImageNode(movingFilePath)

  // Precondition: the input geometry the auto-size derivation depends on.
  t.deepEqual(moving.size, [256, 256])
  t.deepEqual(moving.spacing, [1, 1])

  const { output } = await resampleNode(moving, { outputSpacing: [2, 2] })

  t.deepEqual(output.size, [128, 128])
  t.deepEqual(output.spacing, [2, 2])
  t.deepEqual(output.origin, moving.origin)
  t.deepEqual(output.direction, moving.direction)
})

// Explicit full grid equals resample-to-reference: describing the output grid with the four parameters
// (size, spacing, origin, direction) must produce the same image as pointing resample-to-reference at a
// reference image carrying that same grid. A non-trivial grid (origin, spacing, and size all differ from the
// moving image) exercises all four parameters. resample-to-reference reads only the reference's geometry, so a
// zero-filled buffer of the matching length is sufficient.
test('Test resampleNode explicit full grid equals resampleToReferenceNode', async t => {
  const movingFilePath = path.join(testInputPath, 'cthead1.png')
  const moving = await readImageNode(movingFilePath)

  const size = [100, 120]
  const outputSpacing = [1.5, 2.5]
  const outputOrigin = [3, -4]
  const outputDirection = Array.from(moving.direction) // identity, passed explicitly to exercise the parameter

  const reference = new Image(moving.imageType)
  reference.size = size
  reference.spacing = outputSpacing
  reference.origin = outputOrigin
  reference.direction = Float64Array.from(outputDirection)
  const pixelCount = size.reduce((a, b) => a * b, 1) * moving.imageType.components
  reference.data = new moving.data.constructor(pixelCount)

  const { output: viaParameters } = await resampleNode(
    moving, { size, outputSpacing, outputOrigin, outputDirection })
  const { output: viaReference } = await resampleToReferenceNode(moving, reference)

  const { metrics } = await compareImagesNode(viaParameters, { baselineImages: [viaReference, ] })
  t.true(metrics.almostEqual)
})

// Full defaulting is an identity reproduction: with no grid options the output grid defaults to the input grid,
// and the identity transform with linear interpolation samples each output pixel centre at the exact input
// pixel centre -- so the output reproduces the input (and matches resample-to-reference onto the same grid).
test('Test resampleNode with defaults reproduces the input grid', async t => {
  const movingFilePath = path.join(testInputPath, 'cthead1.png')
  const moving = await readImageNode(movingFilePath)

  const { output } = await resampleNode(moving, { interpolator: 'linear' })

  const { metrics: vsInput } = await compareImagesNode(output, { baselineImages: [moving, ] })
  t.true(vsInput.almostEqual)

  const { output: viaReference } = await resampleToReferenceNode(moving, moving, { interpolator: 'linear' })
  const { metrics: vsReference } = await compareImagesNode(output, { baselineImages: [viaReference, ] })
  t.true(vsReference.almostEqual)
})

// VectorImage (multi-component) path. itkwasm reads apple.jpg as `RGB`, but resample's SupportInputImageTypes
// dispatch only matches `VariableLengthVector`, so reassign the pixelType before calling resample (as
// test_downsample.py's vector test does). With defaults (identity transform, linear) resample reproduces the
// input across all components.
test('Test resampleNode VectorImage with defaults reproduces the input', async t => {
  const movingFilePath = path.join(testInputPath, 'apple.jpg')
  const moving = await readImageNode(movingFilePath)
  moving.imageType.pixelType = PixelTypes.VariableLengthVector
  // apple.jpg carries a fractional spacing (~0.353). Identity reproduction is only bit-exact when the output
  // pixel-centre -> physical -> input-index round-trip is exact, which it is on a unit grid (this is why the
  // scalar cthead1 case above reproduces exactly); a fractional spacing leaves sub-ULP index error that the
  // linear interpolator turns into off-by-one uint8 rounding in a few percent of pixels. Normalise the grid to
  // unit spacing so the reproduction is exact -- the pixel data, which is what the VariableLengthVector path is
  // being exercised on, is untouched.
  moving.spacing = moving.spacing.map(() => 1)
  moving.origin = moving.origin.map(() => 0)

  const { output } = await resampleNode(moving, { interpolator: 'linear' })

  const { metrics } = await compareImagesNode(output, { baselineImages: [moving, ] })
  t.true(metrics.almostEqual)
})

// Background value: output samples that map outside the moving image get the default pixel value. A large
// translation pushes the entire output grid outside the moving image, so with nearest-neighbor sampling every
// output pixel becomes exactly the background value -- 200 when set, and the ITK default of 0 when unset.
test('Test resampleNode fills out-of-bounds samples with the background value', async t => {
  const movingFilePath = path.join(testInputPath, 'cthead1.png')
  const moving = await readImageNode(movingFilePath)

  const farOutside = translationTransform([100000, 100000])

  const { output: background } = await resampleNode(
    moving, { transform: farOutside, interpolator: 'nearest_neighbor', defaultValue: 200 })
  t.true(background.data.every((v) => v === 200), 'every out-of-bounds pixel is the 200 background')

  // Unset -> ITK's default of 0.
  const { output: zeroed } = await resampleNode(
    moving, { transform: farOutside, interpolator: 'nearest_neighbor' })
  t.true(zeroed.data.every((v) => v === 0), 'every out-of-bounds pixel defaults to 0')
})

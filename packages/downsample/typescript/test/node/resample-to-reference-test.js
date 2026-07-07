import test from 'ava'
import path from 'path'

import { readImageNode } from '@itk-wasm/image-io'
import { readTransformNode } from '@itk-wasm/transform-io'
import { compareImagesNode } from '@itk-wasm/compare-images'
import {
  PixelTypes,
  Transform,
  TransformType,
  TransformParameterizations,
  FloatTypes
} from 'itk-wasm'

import { resampleToReferenceNode } from '../../dist/index-node.js'
import { testInputPath, testBaselinePath } from './common.js'

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

test('Test resampleToReferenceNode linear with transform', async t => {
  const movingFilePath = path.join(testInputPath, 'cthead1.png')
  const referenceFilePath = path.join(testInputPath, 'cthead1-resample-reference.nrrd')
  const transformFilePath = path.join(testInputPath, 'cthead1-resample-transform.h5')
  const baselineFilePath = path.join(testBaselinePath, 'cthead1-resample-linear.nrrd')

  const moving = await readImageNode(movingFilePath)
  const reference = await readImageNode(referenceFilePath)
  const transform = await readTransformNode(transformFilePath)

  const { output } = await resampleToReferenceNode(moving, reference, { transform, interpolator: 'linear' })
  const baseline = await readImageNode(baselineFilePath)

  const { metrics } = await compareImagesNode(output, { baselineImages: [baseline, ] })

  t.true(metrics.almostEqual)
})

test('Test resampleToReferenceNode nearest_neighbor with transform', async t => {
  const movingFilePath = path.join(testInputPath, 'cthead1.png')
  const referenceFilePath = path.join(testInputPath, 'cthead1-resample-reference.nrrd')
  const transformFilePath = path.join(testInputPath, 'cthead1-resample-transform.h5')
  const baselineFilePath = path.join(testBaselinePath, 'cthead1-resample-nearest-neighbor.nrrd')

  const moving = await readImageNode(movingFilePath)
  const reference = await readImageNode(referenceFilePath)
  const transform = await readTransformNode(transformFilePath)

  const { output } = await resampleToReferenceNode(moving, reference, { transform, interpolator: 'nearest_neighbor' })
  const baseline = await readImageNode(baselineFilePath)

  const { metrics } = await compareImagesNode(output, { baselineImages: [baseline, ] })

  t.true(metrics.almostEqual)
})

// The label_image interpolator (ITK's GenericLabelInterpolator remote module) is
// not available in the `itk` Python wheel, so no independent baseline could be
// generated in Phase 04. Instead, mirror the C++ `resample-to-reference-label-image` ctest:
// resample the multi-label image `2th_cthead1.png` onto its own geometry with the
// identity transform. A grid-aligned identity resample samples each output point
// at an exact input pixel centre, so the label interpolator reproduces the input
// labels exactly -- the input image is therefore its own trusted baseline.
test('Test resampleToReferenceNode label_image interpolator', async t => {
  const labelImageFilePath = path.join(testInputPath, '2th_cthead1.png')

  const labelImage = await readImageNode(labelImageFilePath)

  const { output } = await resampleToReferenceNode(labelImage, labelImage, { interpolator: 'label_image' })
  const baseline = await readImageNode(labelImageFilePath)

  const { metrics } = await compareImagesNode(output, { baselineImages: [baseline, ] })

  t.true(metrics.almostEqual)
})

// VectorImage (multi-component) path. itkwasm reads apple.jpg as `RGB` and the
// reference .mha as `Vector`, but resample's SupportInputImageTypes dispatch only
// matches `VariableLengthVector`, so reassign the pixelType on both the moving and
// reference images before calling resample (as test_downsample.py's vector test does).
// The independent baseline uses the identity transform (grid change only).
test('Test resampleToReferenceNode VectorImage', async t => {
  const movingFilePath = path.join(testInputPath, 'apple.jpg')
  const referenceFilePath = path.join(testInputPath, 'apple-resample-reference.mha')
  const baselineFilePath = path.join(testBaselinePath, 'apple-resample-linear.mha')

  const moving = await readImageNode(movingFilePath)
  moving.imageType.pixelType = PixelTypes.VariableLengthVector
  const reference = await readImageNode(referenceFilePath)
  reference.imageType.pixelType = PixelTypes.VariableLengthVector

  const { output } = await resampleToReferenceNode(moving, reference, { interpolator: 'linear' })
  const baseline = await readImageNode(baselineFilePath)

  const { metrics } = await compareImagesNode(output, { baselineImages: [baseline, ] })

  t.true(metrics.almostEqual)
})

// Generic (non-affine) parameterization: a Translation transform must be applied as a real translation, not
// coerced into an affine. It maps the output grid by x -> x + offset, identical to an affine with the identity
// matrix and the same translation -- so both resamples produce the same image. (The previous affine-only reader
// copied the 2 translation parameters into the affine's first 2 matrix slots, silently producing a shear.)
test('Test resampleToReferenceNode applies a non-affine translation like the equivalent affine', async t => {
  const movingFilePath = path.join(testInputPath, 'cthead1.png')
  const moving = await readImageNode(movingFilePath)

  const offset = [12, -7]
  const { output: viaTranslation } = await resampleToReferenceNode(
    moving, moving, { transform: translationTransform(offset), interpolator: 'linear' })
  const { output: viaAffine } = await resampleToReferenceNode(
    moving, moving, { transform: affineTransform([1, 0, 0, 1], offset, [0, 0]), interpolator: 'linear' })

  // The two transforms encode the identical mapping, so the resampled images match.
  const { metrics } = await compareImagesNode(viaTranslation, { baselineImages: [viaAffine, ] })
  t.true(metrics.almostEqual)
})

// A single-entry TransformList holding the Composite marker itkwasm uses to serialize an
// itk::CompositeTransform: the marker carries no parameters of its own; the component transforms follow it.
function compositeMarker (dimension) {
  const transformType = new TransformType(TransformParameterizations.Composite, FloatTypes.Float64, dimension, dimension)
  const transform = new Transform(transformType)
  transform.name = 'CompositeTransform'
  transform.numberOfFixedParameters = 0
  transform.numberOfParameters = 0
  transform.fixedParameters = Float64Array.from([])
  transform.parameters = Float64Array.from([])
  return [transform]
}

// Chained transforms: the list [A, B] is composed with itk::CompositeTransform semantics -- the LAST entry is
// applied to the point first, so the mapping is A(B(x)). Here A = scale-by-2 about the origin and
// B = translate(10, 6): A(B(x)) = 2*(x + (10, 6)) = 2x + (20, 12). Every value is exactly representable in
// floating point and the arithmetic is exact, so the chained resample is identical to the single equivalent
// affine (matrix [2,0;0,2], translation (20,12)).
test('Test resampleToReferenceNode composes a multi-transform chain', async t => {
  const movingFilePath = path.join(testInputPath, 'cthead1.png')
  const moving = await readImageNode(movingFilePath)

  const chain = [
    ...affineTransform([2, 0, 0, 2], [0, 0], [0, 0]),
    ...translationTransform([10, 6])
  ]
  const { output: viaChain } = await resampleToReferenceNode(
    moving, moving, { transform: chain, interpolator: 'linear' })

  const { output: viaSingle } = await resampleToReferenceNode(
    moving, moving, { transform: affineTransform([2, 0, 0, 2], [20, 12], [0, 0]), interpolator: 'linear' })

  const { metrics } = await compareImagesNode(viaChain, { baselineImages: [viaSingle, ] })
  t.true(metrics.almostEqual)
})

// Composite-marker form: the same chain serialized the way transform-io serializes an itk::CompositeTransform
// (a Composite marker entry followed by the component transforms) must compose identically to the bare chain.
test('Test resampleToReferenceNode applies a composite transform list', async t => {
  const movingFilePath = path.join(testInputPath, 'cthead1.png')
  const moving = await readImageNode(movingFilePath)

  const composite = [
    ...compositeMarker(2),
    ...affineTransform([2, 0, 0, 2], [0, 0], [0, 0]),
    ...translationTransform([10, 6])
  ]
  const { output: viaComposite } = await resampleToReferenceNode(
    moving, moving, { transform: composite, interpolator: 'linear' })

  const { output: viaSingle } = await resampleToReferenceNode(
    moving, moving, { transform: affineTransform([2, 0, 0, 2], [20, 12], [0, 0]), interpolator: 'linear' })

  const { metrics } = await compareImagesNode(viaComposite, { baselineImages: [viaSingle, ] })
  t.true(metrics.almostEqual)
})

// Background value: output samples that map outside the moving image get the default pixel value. A large
// translation pushes the entire output grid outside the moving image, so with nearest-neighbor sampling every
// output pixel becomes exactly the background value -- 200 when set, and the ITK default of 0 when unset.
test('Test resampleToReferenceNode fills out-of-bounds samples with the background value', async t => {
  const movingFilePath = path.join(testInputPath, 'cthead1.png')
  const moving = await readImageNode(movingFilePath)

  const farOutside = translationTransform([100000, 100000])

  const { output: background } = await resampleToReferenceNode(
    moving, moving, { transform: farOutside, interpolator: 'nearest_neighbor', defaultValue: 200 })
  t.true(background.data.every((v) => v === 200), 'every out-of-bounds pixel is the 200 background')

  // Unset -> ITK's default of 0.
  const { output: zeroed } = await resampleToReferenceNode(
    moving, moving, { transform: farOutside, interpolator: 'nearest_neighbor' })
  t.true(zeroed.data.every((v) => v === 0), 'every out-of-bounds pixel defaults to 0')
})

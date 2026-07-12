// Generated file. To retain edits, remove this comment.

import { TransformList } from 'itk-wasm'

interface ResampleNodeOptions {
  /** Output size in pixels per axis. Defaults to the input size; when --output-spacing is given without --size, the size is auto-computed to preserve the input's physical extent at the new spacing. */
  size?: number[]

  /** Output spacing per axis in physical units. Defaults to the input spacing. */
  outputSpacing?: number[]

  /** Output origin, the physical coordinates of the first pixel, per axis. Defaults to the input origin. */
  outputOrigin?: number[]

  /** Output direction as the D-by-D orientation matrix, flattened row-major (D values per row). Defaults to the input direction. */
  outputDirection?: number[]

  /** Optional transform mapping output-grid points into the moving-image space. A multi-entry or composite list is composed with itk::CompositeTransform semantics: the last entry is applied to the point first. Defaults to identity. */
  transform?: TransformList

  /** Interpolation method used to sample the moving image. */
  interpolator?: string

  /** Pixel value assigned to output samples that map outside the moving image (the background value), cast to the output pixel type. Defaults to 0. */
  defaultValue?: number

}

export default ResampleNodeOptions

// Generated file. To retain edits, remove this comment.

import { TransformList } from 'itk-wasm'

interface ResampleToReferenceNodeOptions {
  /** Optional transform mapping output-grid points into the moving-image space. A multi-entry or composite list is composed with itk::CompositeTransform semantics: the last entry is applied to the point first. Defaults to identity. */
  transform?: TransformList

  /** Interpolation method used to sample the moving image. */
  interpolator?: string

  /** Pixel value assigned to output samples that map outside the moving image (the background value), cast to the output pixel type. Defaults to 0. */
  defaultValue?: number

}

export default ResampleToReferenceNodeOptions

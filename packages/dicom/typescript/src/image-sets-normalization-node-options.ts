// Generated file. To retain edits, remove this comment.

import { BinaryFile,JsonCompatible } from 'itk-wasm'

interface ImageSetsNormalizationNodeOptions {
  /** DICOM files */
  files: string[] | File[] | BinaryFile[]

  /** Create series so that all instances in a series share these tags. Option is a JSON object with a "tags" array. Example tag: "0008|103e". If not provided, defaults to Series UID and Frame Of Reference UID tags. */
  seriesGroupBy?: JsonCompatible

  /** Create image sets so that all series in a set share these tags. Option is a JSON object with a "tags" array. Example tag: "0008|103e". If not provided, defaults to Study UID tag. */
  imageSetGroupBy?: JsonCompatible

}

export default ImageSetsNormalizationNodeOptions

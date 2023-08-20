// Generated file. To retain edits, remove this comment.

import { Image } from 'itk-wasm'

interface CompareDoubleImagesResult {
  /** WebWorker used for computation */
  webWorker: Worker | null

  /** Metrics for the baseline with the fewest number of pixels outside the tolerances. */
  metrics: any

  /** Absolute difference image */
  differenceImage: Image

  /** Unsigned char, 2D difference image for rendering */
  differenceUchar2dImage: Image

}

export default CompareDoubleImagesResult

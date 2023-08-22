import CompareImagesMetric from './compare-images-metric.js'

import { Image } from 'itk-wasm'

interface CompareDoubleImagesNodeResult {
  /** Metrics for the baseline with the fewest number of pixels outside the tolerances. */
  metrics: CompareImagesMetric

  /** Absolute difference image */
  differenceImage: Image

  /** Unsigned char, 2D difference image for rendering */
  differenceUchar2dImage: Image

}

export default CompareDoubleImagesNodeResult

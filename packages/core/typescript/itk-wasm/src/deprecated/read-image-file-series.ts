// @ts-nocheck

import ReadImageFileSeriesResult from './read-image-file-series-result.js'
import ReadImageFileSeriesOptions from './read-image-file-series-options.js'

/**
 * @deprecated Use readImageFileSeries from @itk-wasm/image-io instead
 */
async function readImageFileSeries (
  fileList: File[] | FileList,
  options?: ReadImageFileSeriesOptions | number,
  zOriginBackwardsCompatibility?: number,
  sortedSeriesBackwardsCompatibility?: boolean
): Promise<ReadImageFileSeriesResult> {
  throw new Error('readImageFileSeries is deprecated. Use readImageFileSeries from @itk-wasm/image-io instead.')
}

export default readImageFileSeries

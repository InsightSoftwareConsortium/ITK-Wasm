// @ts-nocheck

import ReadImageFileSeriesResult from '../read-image-file-series-result.js'
import ReadImageDICOMArrayBufferSeriesOptions from './read-image-dicom-file-series-options.js'

/**
 *
 * @deprecated Use readImageDicomFileSeries from @itk-wasm/dicom instead
 */
const readImageDICOMArrayBufferSeries = async (
  arrayBuffers: ArrayBuffer[],
  options?: ReadImageDICOMArrayBufferSeriesOptions | boolean,
  fileNamesBackwardsCompatibility?: string[]
): Promise<ReadImageFileSeriesResult> => {
  throw new Error('readImageDICOMArrayBufferSeries is deprecated. Use readImageDicomFileSeries from @itk-wasm/dicom instead.')
}

export default readImageDICOMArrayBufferSeries

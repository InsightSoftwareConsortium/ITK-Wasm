// @ts-nocheck

import ReadImageFileSeriesResult from './read-image-dicom-file-series-result.js'
import ReadImageDICOMFileSeriesOptions from './read-image-dicom-file-series-options.js'

/**
 * @deprecated Use readImageDicomFileSeries from @itk-wasm/dicom instead
 */
const readImageDICOMFileSeries = async (
  fileList: FileList | File[],
  options?: ReadImageDICOMFileSeriesOptions | boolean
): Promise<ReadImageFileSeriesResult> => {
  throw new Error('readImageDICOMFileSeries is deprecated. Use readImageDicomFileSeries from @itk-wasm/dicom instead.')
}

export default readImageDICOMFileSeries

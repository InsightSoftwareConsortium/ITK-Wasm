import ReadImageFileSeriesResult from '../ReadImageFileSeriesResult.js'
import ReadImageDICOMArrayBufferSeriesOptions from './ReadImageDICOMArrayBufferSeriesOptions.js'

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

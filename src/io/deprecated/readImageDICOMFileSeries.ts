import ReadImageFileSeriesResult from '../ReadImageFileSeriesResult.js'
import ReadImageDICOMFileSeriesOptions from './ReadImageDICOMFileSeriesOptions.js'

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

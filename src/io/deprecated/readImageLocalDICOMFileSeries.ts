import ReadImageDICOMFileSeriesOptions from './ReadImageDICOMFileSeriesOptions.js'
import Image from '../../core/Image.js'

/**
 * @deprecated Use readImageDicomFileSeriesNode from @itk-wasm/dicom instead
 */
async function readImageLocalDICOMFileSeries (
  fileNames: string[],
  options?: ReadImageDICOMFileSeriesOptions | boolean
): Promise<Image> {
  throw new Error('This function has been replaced by readImageDicomFileSeriesNode in the @itk-wasm/dicom package.')
}

export default readImageLocalDICOMFileSeries

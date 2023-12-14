// @ts-nocheck

import ReadImageDICOMFileSeriesOptions from './read-image-dicom-file-series-options.js'
import Image from '../interface-types/image.js'

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

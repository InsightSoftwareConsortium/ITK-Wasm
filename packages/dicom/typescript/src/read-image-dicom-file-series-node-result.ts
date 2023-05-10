import { Image } from 'itk-wasm'

interface ReadImageDicomFileSeriesNodeResult {
  /** Output image volume */
  outputImage: Image

  /** Output sorted filenames */
  sortedFilenames: Object

}

export default ReadImageDicomFileSeriesNodeResult

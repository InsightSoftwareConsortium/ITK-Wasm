// @ts-nocheck

import ReadDICOMTagsResult from './read-dicom-tags-result.js'

/**
 *
 * @deprecated Use readDicomTags from @itk-wasm/dicom instead
 */
async function readDICOMTagsArrayBuffer (webWorker: Worker | null, arrayBuffer: ArrayBuffer, tags: string[] | null = null): Promise<ReadDICOMTagsResult> {
  throw new Error('readDICOMTagsArrayBuffer is deprecated. Use readDicomTags from @itk-wasm/dicom instead.')
}

export default readDICOMTagsArrayBuffer

// @ts-nocheck

import ReadDICOMTagsResult from './read-dicom-tags-result.js'

/**
 * @deprecated Use readDicomTags from @itk-wasm/dicom instead
 */
async function readDICOMTags (webWorker: Worker | null, file: File, tags: string[] | null = null): Promise<ReadDICOMTagsResult> {
  throw new Error('readDICOMTags is deprecated. Use readDicomTags from @itk-wasm/dicom instead.')
}

export default readDICOMTags

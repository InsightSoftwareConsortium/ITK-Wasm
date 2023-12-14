// @ts-nocheck

/**
 *
 * @deprecated Use readDicomTagsNode from @itk-wasm/dicom instead
 */
async function readDICOMTagsLocalFile (fileName: string, tags: string[] | null = null): Promise<Map<string, string>> {
  throw new Error('This function has been replaced by readDicomTagsNode in the @itk-wasm/dicom package.')
}

export default readDICOMTagsLocalFile

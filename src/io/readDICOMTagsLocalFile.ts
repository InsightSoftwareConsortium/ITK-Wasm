/**
 * Reads DICOM tags from a series of DICOM files on the local filesystem in Node.js.
 * @param: filename DICOM object filepath on the local filesystem.
 * @param: tags Array of tags to extract.
 */
async function readDICOMTagsLocalFile (fileName: string, tags: string[] | null = null): Promise<Map<string, string>> {
  throw new Error('This function has been replaced by readDicomTagsNode in the @itk-wasm/dicom package.')
}

export default readDICOMTagsLocalFile

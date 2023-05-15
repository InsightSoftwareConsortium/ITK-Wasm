import ReadDICOMTagsResult from './ReadDICOMTagsResult.js'
import readDICOMTagsArrayBuffer from './readDICOMTagsArrayBuffer.js'

async function readDICOMTags (webWorker: Worker | null, file: File, tags: string[] | null = null): Promise<ReadDICOMTagsResult> {
  const arrayBuffer = await file.arrayBuffer()
  return await readDICOMTagsArrayBuffer(webWorker, arrayBuffer, tags)
}

export default readDICOMTags

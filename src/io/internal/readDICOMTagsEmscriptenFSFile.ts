import DICOMTagsReaderEmscriptenModule from './DICOMTagsReaderEmscriptenModule.js'

function readDICOMTagsEmscriptenFSFile (tagReaderModule: DICOMTagsReaderEmscriptenModule,
  fileName: string,
  tags: string[] | null = null): Map<string, string> {
  const tagReader = new tagReaderModule.ITKDICOMTagReader()
  tagReader.SetFileName(fileName)
  const tagMap: Map<string, string> = new Map()
  if (Array.isArray(tags)) {
    for (let i = 0; i < tags.length; i++) {
      const key = tags[i]
      tagMap.set(key, tagReader.ReadTag(key.toLowerCase()))
    }
  } else {
    const allTagsMap = tagReader.ReadAllTags()
    const keys = allTagsMap.keys()
    for (let i = 0; i < keys.size(); i++) {
      const key = keys.get(i)
      tagMap.set(key, allTagsMap.get(key))
    }
  }
  return tagMap
}

export default readDICOMTagsEmscriptenFSFile

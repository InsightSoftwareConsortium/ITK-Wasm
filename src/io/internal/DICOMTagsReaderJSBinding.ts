import MapJSBinding from "../../core/internal/MapJSBinding.js"

interface DICOMTagsReaderJSBinding {
  SetFileName(fileName: string): void
  ReadTag(tag: string): string
  ReadAllTags(): MapJSBinding<string, string>
}

export default DICOMTagsReaderJSBinding

import { WorkerPoolFunctionOption } from "itk-wasm"

interface ReadDicomTagsOptions extends WorkerPoolFunctionOption {
  /** A JSON object with a "tags" array of the tags to read. If not provided, all tags are read. Example tag: "0008|103e". */
  tagsToRead?: { tags: Array<string> }
}

export default ReadDicomTagsOptions

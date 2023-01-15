interface CompressStringifyOptions {
  /** Stringify the output */
  stringify?: boolean

  /** Compression level, typically 1-9 */
  compressionLevel?: number

  /** dataURL prefix */
  dataUrlPrefix?: string

}

export default CompressStringifyOptions

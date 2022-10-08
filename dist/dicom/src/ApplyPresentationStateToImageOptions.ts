interface ApplyPresentationStateToImageOptions {
  /** filename: string. Process using presentation state file */
  presentationStateFile?: Uint8Array

  /** filename: string. Process using settings from configuration file */
  configFile?: string

  /** frame: integer. Process using image frame f (default: 1) */
  frame?: number

  /** get presentation state information in text stream (default: ON). */
  presentationStateOutput?: boolean

  /** get resulting image as bitmap output stream (default: ON). */
  bitmapOutput?: boolean

  /** save image as PGM (default) */
  pgm?: boolean

  /** save image as DICOM secondary capture */
  dicom?: boolean

}

export default ApplyPresentationStateToImageOptions

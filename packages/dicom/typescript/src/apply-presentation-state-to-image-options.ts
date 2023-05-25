interface ApplyPresentationStateToImageOptions {
  /** output image as RGB (default: false) */
  colorOutput?: boolean

  /** filename: string. Process using settings from configuration file */
  configFile?: string

  /** frame: integer. Process using image frame f (default: 1) */
  frame?: number

  /** Do not get presentation state information in text stream. */
  noPresentationStateOutput?: boolean

  /** Do not get resulting image as bitmap output stream. */
  noBitmapOutput?: boolean

}

export default ApplyPresentationStateToImageOptions

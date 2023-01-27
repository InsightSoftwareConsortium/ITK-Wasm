interface ReadDicomEncapsulatedPdfOptions {
  /** read file format only */
  readFileOnly?: boolean

  /** read data set without file meta information */
  readDataset?: boolean

  /** use TS recognition (default) */
  readXferAuto?: boolean

  /** ignore TS specified in the file meta header */
  readXferDetect?: boolean

  /** read with explicit VR little endian TS */
  readXferLittle?: boolean

  /** read with explicit VR big endian TS */
  readXferBig?: boolean

  /** read with implicit VR little endian TS */
  readXferImplicit?: boolean

  /** accept odd length attributes (default) */
  acceptOddLength?: boolean

  /** assume real length is one byte larger */
  assumeEvenLength?: boolean

  /** read undefined len UN as implicit VR (default) */
  enableCp246?: boolean

  /** read undefined len UN as explicit VR */
  disableCp246?: boolean

  /** retain elements as UN (default) */
  retainUn?: boolean

  /** convert to real VR if known */
  convertUn?: boolean

  /** enable automatic data correction (default) */
  enableCorrection?: boolean

  /** disable automatic data correction */
  disableCorrection?: boolean

}

export default ReadDicomEncapsulatedPdfOptions

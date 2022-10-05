interface StructuredReportToHtmlOptions {
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

  /** show currently processed content item */
  processingDetails?: boolean

  /** accept unknown/missing relationship type */
  unknownRelationship?: boolean

  /** accept invalid content item value
(e.g. violation of VR or VM definition) */
  invalidItemValue?: boolean

  /** ignore relationship content constraints */
  ignoreConstraints?: boolean

  /** do not abort on content item errors, just warn
(e.g. missing value type specific attributes) */
  ignoreItemErrors?: boolean

  /** skip invalid content items (incl. sub-tree) */
  skipInvalidItems?: boolean

  /** disable check for VR-conformant string values */
  disableVrChecker?: boolean

  /** require declaration of ext. charset (default) */
  charsetRequire?: boolean

  /** [c]harset: string, assume charset c if no extended charset declared */
  charsetAssume?: string

  /** check all data elements with string values
(default: only PN, LO, LT, SH, ST, UC and UT) */
  charsetCheckAll?: boolean

  /** convert all element values that are affected
by Specific Character Set (0008,0005) to UTF-8 */
  convertToUtf8?: boolean

  /** URL: string. Append specificed URL prefix to hyperlinks of referenced composite objects in the document. */
  urlPrefix?: string

  /** use only HTML version 3.2 compatible features */
  html32?: boolean

  /** allow all HTML version 4.01 features (default) */
  html40?: boolean

  /** comply with XHTML version 1.1 specification */
  xhtml11?: boolean

  /** add reference to SGML document type definition */
  addDocumentType?: boolean

  /** URL: string. Add reference to specified CSS to document */
  cssReference?: string

  /** [f]ilename: string. Embed content of specified CSS into document */
  cssFile?: string

  /** expand short content items inline (default) */
  expandInline?: boolean

  /** never expand content items inline */
  neverExpandInline?: boolean

  /** always expand content items inline */
  alwaysExpandInline?: boolean

  /** render full data of content items */
  renderFullData?: boolean

  /** render section titles inline, not separately */
  sectionTitleInline?: boolean

  /** use document type as document title (default) */
  documentTypeTitle?: boolean

  /** use patient information as document title */
  patientInfoTitle?: boolean

  /** do not render general document information */
  noDocumentHeader?: boolean

  /** render codes in continuous text blocks */
  renderInlineCodes?: boolean

  /** render code of concept names */
  conceptNameCodes?: boolean

  /** render code of numeric measurement units */
  numericUnitCodes?: boolean

  /** use code value as measurement unit (default) */
  codeValueUnit?: boolean

  /** use code meaning as measurement unit */
  codeMeaningUnit?: boolean

  /** render all codes (implies +Ci, +Cn and +Cu) */
  renderAllCodes?: boolean

  /** render code details as a tooltip (implies +Cc) */
  codeDetailsTooltip?: boolean

}

export default StructuredReportToHtmlOptions

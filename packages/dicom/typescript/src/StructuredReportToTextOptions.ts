interface StructuredReportToTextOptions {
  /** Accept unknown relationship type */
  unknownRelationship?: boolean

  /** Accept invalid content item value */
  invalidItemValue?: boolean

  /** Ignore relationship constraints */
  ignoreConstraints?: boolean

  /** Ignore content item errors */
  ignoreItemErrors?: boolean

  /** Skip invalid content items */
  skipInvalidItems?: boolean

  /** Print no document header */
  noDocumentHeader?: boolean

  /** Number nested items */
  numberNestedItems?: boolean

  /** Shorten long item values */
  shortenLongValues?: boolean

  /** Print SOP Instance UID */
  printInstanceUid?: boolean

  /** Print short SOP class name */
  printSopclassShort?: boolean

  /** Print SOP class name */
  printSopclassLong?: boolean

  /** Print long SOP class name */
  printSopclassUid?: boolean

  /** Print all codes */
  printAllCodes?: boolean

  /** Print invalid codes */
  printInvalidCodes?: boolean

  /** Print template identification */
  printTemplateId?: boolean

  /** Indicate enhanced encoding mode */
  indicateEnhanced?: boolean

  /** Use ANSI escape codes */
  printColor?: boolean

}

export default StructuredReportToTextOptions

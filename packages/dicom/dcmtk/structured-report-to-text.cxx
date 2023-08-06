/*=========================================================================
 *
 *  Copyright NumFOCUS
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         https://www.apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *=========================================================================*/
#include "itkPipeline.h"
#include "itkOutputTextStream.h"

#include "dcmtk/config/osconfig.h"    /* make sure OS specific configuration is included first */

/* Required to avoid linking errors?? */
// Fix warning for redefinition of __STDC_FORMAT_MACROS in the header include tree for diregist.h
#ifdef __STDC_FORMAT_MACROS
  #undef __STDC_FORMAT_MACROS
#endif
#include "dcmtk/dcmimage/diregist.h"

#include "dcmtk/dcmsr/dsrdoc.h"       /* for main interface class DSRDocument */
#include "dcmtk/dcmdata/dctk.h"       /* for typical set of "dcmdata" headers */

#ifdef WITH_ZLIB
#include "itk_zlib.h"                     /* for zlibVersion() */
#endif
#ifdef DCMTK_ENABLE_CHARSET_CONVERSION
#include "dcmtk/ofstd/ofchrenc.h"     /* for OFCharacterEncoding */
#endif

#ifndef HAVE_WINDOWS_H
#define ANSI_ESCAPE_CODES_AVAILABLE
#endif

#include <memory>

int main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("structured-report-to-text", "Read a DICOM structured report file and generate a plain text representation", argc, argv);

  std::string dicomFileName;
  pipeline.add_option("dicom-file", dicomFileName, "Input DICOM file")->required()->check(CLI::ExistingFile)->type_name("INPUT_BINARY_FILE");

  itk::wasm::OutputTextStream outputText;
  pipeline.add_option("output-text", outputText, "Output text file")->required()->type_name("OUTPUT_TEXT_STREAM");


  size_t readFlags = 0;

  bool unknownRelationShip{false};
  pipeline.add_flag("--unknown-relationship", unknownRelationShip, "Accept unknown relationship type");

  bool invalidItemValue{false};
  pipeline.add_flag("--invalid-item-value", invalidItemValue, "Accept invalid content item value");

  bool ignoreConstraints{false};
  pipeline.add_flag("--ignore-constraints", ignoreConstraints, "Ignore relationship constraints");

  bool ignoreItemErrors{false};
  pipeline.add_flag("--ignore-item-errors", ignoreItemErrors, "Ignore content item errors");

  bool skipInvalidItems{false};
  pipeline.add_flag("--skip-invalid-items", skipInvalidItems, "Skip invalid content items");

  size_t printFlags = DSRTypes::PF_shortenLongItemValues;

  bool noDocumentHeader{false};
  pipeline.add_flag("--no-document-header", noDocumentHeader, "Print no document header");

  bool numberNestedItems{false};
  pipeline.add_flag("--number-nested-items", numberNestedItems, "Number nested items");

  bool shortenLongValues{false};
  pipeline.add_flag("--shorten-long-values", shortenLongValues, "Shorten long item values");

  bool printInstanceUid{false};
  pipeline.add_flag("--print-instance-uid", printInstanceUid, "Print SOP Instance UID");

  bool printSopclassShort{false};
  pipeline.add_flag("--print-sopclass-short", printSopclassShort, "Print short SOP class name");

  bool printSopclassLong{false};
  pipeline.add_flag("--print-sopclass-long", printSopclassLong, "Print SOP class name");

  bool printSopclassUid{false};
  pipeline.add_flag("--print-sopclass-uid", printSopclassUid, "Print long SOP class name");

  bool printAllCodes{false};
  pipeline.add_flag("--print-all-codes", printAllCodes, "Print all codes");

  bool printInvalidCodes{false};
  pipeline.add_flag("--print-invalid-codes", printInvalidCodes, "Print invalid codes");

  bool printTemplateId{false};
  pipeline.add_flag("--print-template-id", printTemplateId, "Print template identification");

  bool indicateEnhanced{false};
  pipeline.add_flag("--indicate-enhanced", indicateEnhanced, "Indicate enhanced encoding mode");

  bool printColor{false};
  pipeline.add_flag("--print-color", printColor, "Use ANSI escape codes");


  ITK_WASM_PARSE(pipeline);
  

  if (unknownRelationShip)
  {
    readFlags |= DSRTypes::RF_acceptUnknownRelationshipType;
  }
  if (invalidItemValue)
  {
    readFlags |= DSRTypes::RF_acceptInvalidContentItemValue;
  }
  if (ignoreConstraints)
  {
    readFlags |= DSRTypes::RF_ignoreRelationshipConstraints;
  }
  if (ignoreItemErrors)
  {
    readFlags |= DSRTypes::RF_ignoreContentItemErrors;
  }
  if (skipInvalidItems)
  {
     readFlags |= DSRTypes::RF_skipInvalidContentItems;
  }

  if (noDocumentHeader)
  {
    printFlags |= DSRTypes::PF_printNoDocumentHeader;
  }
  if (numberNestedItems)
  {
    printFlags |= DSRTypes::PF_printItemPosition;
  }
  if (shortenLongValues)
  {
    printFlags |= DSRTypes::PF_shortenLongItemValues;
  }
  if (printInstanceUid)
  {
    printFlags |= DSRTypes::PF_printSOPInstanceUID;
  }
  if (printSopclassShort)
  {
    printFlags = (printFlags & ~(DSRTypes::PF_printLongSOPClassName | DSRTypes::PF_printSOPClassUID));
  }
  if (printSopclassLong)
  {
    printFlags = (printFlags & ~DSRTypes::PF_printSOPClassUID) | DSRTypes::PF_printLongSOPClassName;
  }
  if (printSopclassUid)
  {
    printFlags = (printFlags & ~DSRTypes::PF_printLongSOPClassName) | DSRTypes::PF_printSOPClassUID;
  }
  if (printAllCodes)
  {
    printFlags |= DSRTypes::PF_printAllCodes;
  }
  if (printInvalidCodes)
  {
    printFlags |= DSRTypes::PF_printInvalidCodes;
  }
  if (printTemplateId)
  {
    printFlags |= DSRTypes::PF_printTemplateIdentification;
  }
  if (indicateEnhanced)
  {
    printFlags |= DSRTypes::PF_indicateEnhancedEncodingMode;
  }
  if (printColor)
  {
    printFlags |= DSRTypes::PF_useANSIEscapeCodes;
  }

  std::unique_ptr<DcmFileFormat> dcmFile = std::make_unique<DcmFileFormat>();
  const E_TransferSyntax transferSyntax = EXS_Unknown;

  OFCondition result = EC_Normal;
  result = dcmFile->loadFile(dicomFileName.c_str(), transferSyntax);
  if (result.bad())
  {
    std::cerr << "Error: \"" << result.text() << "\" while reading file: " << dicomFileName << std::endl;
    return EXIT_FAILURE;
  }

// #ifdef DCMTK_ENABLE_CHARSET_CONVERSION
//   result = dcmFile->convertToUTF8();
//   if (result.bad())
//   {
//     std::cerr << "Error: \"" << result.text() << "\" when converting file to UTF-8: " << dicomFileName << std::endl;
//     return EXIT_FAILURE;
//   }
// #endif

  result = EC_CorruptedData;
  std::unique_ptr<DSRDocument> dsrDoc = std::make_unique<DSRDocument>();
  result = dsrDoc->read(*dcmFile->getDataset(), readFlags);
  if (result.bad())
  {
    std::cerr << "Error: \"" << result.text() << "\" while parsing file: " << dicomFileName << std::endl;
    return EXIT_FAILURE;
  }

  result = dsrDoc->print(outputText.Get(), printFlags);
  outputText.Get() << std::endl;

  return EXIT_SUCCESS;
}
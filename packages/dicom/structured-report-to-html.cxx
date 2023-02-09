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
/*
 *
 *  Copyright (C) 2000-2016, OFFIS e.V.
 *  All rights reserved.  See COPYRIGHT file for details.
 *
 *  This software and supporting documentation were developed by
 *
 *    OFFIS e.V.
 *    R&D Division Health
 *    Escherweg 2
 *    D-26121 Oldenburg, Germany
 *
 *
 *  Module: dcmsr
 *
 *  Author: Joerg Riesmeier
 *
 *  Purpose:
 *    render the contents of a DICOM structured reporting file in HTML format
 *
 */
#include "itkPipeline.h"
#include "itkInputTextStream.h"
#include "itkOutputTextStream.h"

#include "dcmtk/config/osconfig.h"    /* make sure OS specific configuration is included first */

// Fix warning for redefinition of __STDC_FORMAT_MACROS in the header include tree for dsrdoc.h
#ifdef __STDC_FORMAT_MACROS
  #undef __STDC_FORMAT_MACROS
#endif
#include "dcmtk/dcmsr/dsrdoc.h"       /* for main interface class DSRDocument */

#include "dcmtk/dcmdata/dctk.h"       /* for typical set of "dcmdata" headers */

#include "dcmtk/ofstd/ofstream.h"
#include "dcmtk/ofstd/ofconapp.h"

#ifdef WITH_ZLIB
#include "itk_zlib.h"                     /* for zlibVersion() */
#endif
#ifdef DCMTK_ENABLE_CHARSET_CONVERSION
#include "dcmtk/ofstd/ofchrenc.h"     /* for OFCharacterEncoding */
#endif

#define OFFIS_CONSOLE_APPLICATION "dsr2html"

static OFLogger dsr2htmlLogger = OFLog::getLogger("dcmtk.apps." OFFIS_CONSOLE_APPLICATION);

static char rcsid[] = "$dcmtk: " OFFIS_CONSOLE_APPLICATION " v"
  OFFIS_DCMTK_VERSION " " OFFIS_DCMTK_RELEASEDATE " $";


// ********************************************


static OFCondition renderFile(STD_NAMESPACE ostream &out,
                              const char *ifname,
                              const char *cssName,
                              const char *defaultCharset,
                              const E_FileReadMode readMode,
                              const E_TransferSyntax xfer,
                              const size_t readFlags,
                              const size_t renderFlags,
                              const OFBool checkAllStrings,
                              const OFBool convertToUTF8,
                              const std::string& urlPrefixForReferencedObjects)
{
    OFCondition result = EC_Normal;

    if ((ifname == NULL) || (strlen(ifname) == 0))
    {
        OFLOG_FATAL(dsr2htmlLogger, OFFIS_CONSOLE_APPLICATION << ": invalid filename: <empty string>");
        return EC_IllegalParameter;
    }

    DcmFileFormat *dfile = new DcmFileFormat();
    if (dfile != NULL)
    {
        if (readMode == ERM_dataset)
            result = dfile->getDataset()->loadFile(ifname, xfer);
        else
            result = dfile->loadFile(ifname, xfer);
        if (result.bad())
        {
            OFLOG_FATAL(dsr2htmlLogger, OFFIS_CONSOLE_APPLICATION << ": error (" << result.text()
                << ") reading file: " << ifname);
        }
    } else
        result = EC_MemoryExhausted;

#ifdef DCMTK_ENABLE_CHARSET_CONVERSION
    /* convert all DICOM strings to UTF-8 (if requested) */
    if (result.good() && convertToUTF8)
    {
        DcmDataset *dset = dfile->getDataset();
        OFLOG_INFO(dsr2htmlLogger, "converting all element values that are affected by SpecificCharacterSet (0008,0005) to UTF-8");
        // check whether SpecificCharacterSet is absent but needed
        if ((defaultCharset != NULL) && !dset->tagExistsWithValue(DCM_SpecificCharacterSet) &&
            dset->containsExtendedCharacters(OFFalse /*checkAllStrings*/))
        {
            // use the manually specified source character set
            result = dset->convertCharacterSet(defaultCharset, OFString("ISO_IR 192"));
        } else {
            // expect that SpecificCharacterSet contains the correct value
            result = dset->convertToUTF8();
        }
        if (result.bad())
        {
            OFLOG_FATAL(dsr2htmlLogger, result.text() << ": converting file to UTF-8: " << ifname);
        }
    }
#else
    // avoid compiler warning on unused variable
    (void)convertToUTF8;
#endif
    if (result.good())
    {
        result = EC_CorruptedData;
        DcmDataset *dset = dfile->getDataset();
        DSRDocument *dsrdoc = new DSRDocument();
        if (dsrdoc != NULL)
        {
            result = dsrdoc->read(*dset, readFlags);
            if (result.good())
            {
                // check extended character set
                OFString charset;
                if ((dsrdoc->getSpecificCharacterSet(charset).bad() || charset.empty()) &&
                    dset->containsExtendedCharacters(checkAllStrings))
                {
                    // we have an unspecified extended character set
                    if (defaultCharset == NULL)
                    {
                        // the dataset contains non-ASCII characters that really should not be there
                        OFLOG_FATAL(dsr2htmlLogger, OFFIS_CONSOLE_APPLICATION << ": SpecificCharacterSet (0008,0005) "
                            << "element absent but extended characters used in file: " << ifname);
                        OFLOG_DEBUG(dsr2htmlLogger, "use option --charset-assume to manually specify an appropriate character set");
                        result = EC_IllegalCall;
                    } else {
                        // use the default character set specified by the user
                        result = dsrdoc->setSpecificCharacterSet(defaultCharset);
                        if (dsrdoc->getSpecificCharacterSetType() == DSRTypes::CS_unknown)
                        {
                            OFLOG_FATAL(dsr2htmlLogger, OFFIS_CONSOLE_APPLICATION << ": Character set '"
                                << defaultCharset << "' specified with option --charset-assume not supported");
                            result = EC_IllegalCall;
                        }
                        else if (result.bad())
                        {
                            OFLOG_FATAL(dsr2htmlLogger, OFFIS_CONSOLE_APPLICATION << ": Cannot use character set '"
                                << defaultCharset << "' specified with option --charset-assume: " << result.text());
                        }
                    }
                }
                if (result.good())
                {
                    if (urlPrefixForReferencedObjects.empty())
                    {
                        // this allows to set the default argument value: HTML_HYPERLINK_PREFIX_FOR_CGI
                        result = dsrdoc->renderHTML(out, renderFlags, cssName);
                    }
                    else
                    {
                        result = dsrdoc->renderHTML(out, renderFlags, cssName, urlPrefixForReferencedObjects);
                    }
                }
            }
            else
            {
                OFLOG_FATAL(dsr2htmlLogger, OFFIS_CONSOLE_APPLICATION << ": error (" << result.text()
                    << ") parsing file: " << ifname);
            }
        }
        delete dsrdoc;
    }
    delete dfile;

    return result;
}


#define SHORTCOL 3
#define LONGCOL 22


int main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("structured-report-to-html", "Render DICOM SR file and data set to HTML/XHTML", argc, argv);

  std::string dicomFileName;
  pipeline.add_option("dicom-file", dicomFileName, "Input DICOM file")->required()->check(CLI::ExistingFile)->type_name("INPUT_BINARY_FILE");

  itk::wasm::OutputTextStream outputText;
  pipeline.add_option("output-text", outputText, "Output text file")->required()->type_name("OUTPUT_TEXT_STREAM");

  // Group: "input options"
  // SubGroup: "input file format"
  bool readFileOnly{false};
  pipeline.add_flag("--read-file-only", readFileOnly, "read file format only");
  bool readDataset{false};
  auto readDatasetCliOption = pipeline.add_flag("--read-dataset", readDataset, "read data set without file meta information");

  // SubGroup "input transfer syntax:"
  bool readXferAuto{false};
  pipeline.add_flag("--read-xfer-auto", readXferAuto, "use TS recognition (default)");
  bool readXferDetect{false};
  pipeline.add_flag("--read-xfer-detect", readXferDetect, "ignore TS specified in the file meta header");
  bool readXferLittle{false};
  auto readXferLittleCliOption = pipeline.add_flag("--read-xfer-little", readXferLittle, "read with explicit VR little endian TS");
  readXferLittleCliOption->needs(readDatasetCliOption);

  bool readXferBig{false};
  auto readXferBigCliOption = pipeline.add_flag("--read-xfer-big", readXferBig, "read with explicit VR big endian TS");
  readXferBigCliOption->needs(readDatasetCliOption);

  bool readXferImplicit{false};
  auto readXferImplicitCliOption = pipeline.add_flag("--read-xfer-implicit", readXferImplicit, "read with implicit VR little endian TS");
  readXferImplicitCliOption->needs(readDatasetCliOption);

  // Group("processing options:")
  //   SubGroup("additional information:")
  bool processingDetails{false};
  pipeline.add_flag("--processing-details", processingDetails, "show currently processed content item");
  //   SubGroup("error handling:")
  bool unknownRelationship{false};
  pipeline.add_flag("--unknown-relationship", unknownRelationship, "accept unknown/missing relationship type");
  bool invalidItemValue{false};
  pipeline.add_flag("--invalid-item-value", invalidItemValue, "accept invalid content item value\n(e.g. violation of VR or VM definition)");
  bool ignoreConstraints{false};
  pipeline.add_flag("--ignore-constraints", ignoreConstraints, "ignore relationship content constraints");
  bool ignoreItemErrors{false};
  pipeline.add_flag("--ignore-item-errors", ignoreItemErrors, "do not abort on content item errors, just warn\n(e.g. missing value type specific attributes)");
  bool skipInvalidItems{false};
  pipeline.add_flag("--skip-invalid-items", skipInvalidItems, "skip invalid content items (incl. sub-tree)");
  bool disableVRChecker{false};
  pipeline.add_flag("--disable-vr-checker", disableVRChecker, "disable check for VR-conformant string values");

  // SubGroup("character set:")
  bool charsetRequire{false};
  pipeline.add_flag("--charset-require", charsetRequire,    "require declaration of ext. charset (default)");
  std::string charsetAssumeValue;
  pipeline.add_option("--charset-assume", charsetAssumeValue, "[c]harset: string, assume charset c if no extended charset declared");
  bool charsetCheckAll{false};
  pipeline.add_flag("--charset-check-all", charsetCheckAll, "check all data elements with string values\n(default: only PN, LO, LT, SH, ST, UC and UT)");
#ifdef DCMTK_ENABLE_CHARSET_CONVERSION
  bool convertToUTF8{false};
  pipeline.add_flag("--convert-to-utf8", convertToUTF8, "convert all element values that are affected\nby Specific Character Set (0008,0005) to UTF-8");
#endif
  // Group("output options:")
  std::string urlPrefixValue;
  pipeline.add_option("--url-prefix", urlPrefixValue, "URL: string. Append specificed URL prefix to hyperlinks of referenced composite objects in the document.");

  //   SubGroup("HTML/XHTML compatibility:")
  bool html32{false}, html40{false}, xhtml11{false}, addDocumentType{false};
  auto html32CliOption = pipeline.add_flag("--html-3.2", html32, "use only HTML version 3.2 compatible features");
  pipeline.add_flag("--html-4.0", html40, "allow all HTML version 4.01 features (default)");
  pipeline.add_flag("--xhtml-1.1", xhtml11, "comply with XHTML version 1.1 specification");
  pipeline.add_flag("--add-document-type", addDocumentType, "add reference to SGML document type definition");

  //   SubGroup("cascading style sheet (CSS), not with HTML 3.2:")
  itk::wasm::InputTextStream cssReference;
  auto cssReferenceCliOption = pipeline.add_option("--css-reference", cssReference, "URL: string. Add reference to specified CSS to document")->type_name("INPUT_TEXT_STREAM");
  cssReferenceCliOption->excludes(html32CliOption);
  std::string cssFile;
  auto cssFileCliOption = pipeline.add_option("--css-file", cssFile, "[f]ilename: string. Embed content of specified CSS into document")->check(CLI::ExistingFile)->type_name("INPUT_TEXT_FILE");
  cssFileCliOption->excludes(html32CliOption);

  //   SubGroup("general rendering:");
  bool expandInline{false};
  pipeline.add_flag("--expand-inline", expandInline, "expand short content items inline (default)");
  bool neverExpandInline{false};
  pipeline.add_flag("--never-expand-inline", neverExpandInline, "never expand content items inline");
  bool alwaysExpandInline{false};
  pipeline.add_flag("--always-expand-inline", alwaysExpandInline, "always expand content items inline");
  bool renderFullData{false};
  pipeline.add_flag("--render-full-data", renderFullData, "render full data of content items");
  bool sectionTitleInline{false};
  pipeline.add_flag("--section-title-inline", sectionTitleInline, "render section titles inline, not separately");

  //   SubGroup("document rendering:");
  bool documentTypeTitle{false};
  pipeline.add_flag("--document-type-title", documentTypeTitle, "use document type as document title (default)");
  bool patientInfoTitle{false};
  pipeline.add_flag("--patient-info-title", patientInfoTitle, "use patient information as document title");
  bool noDocumentHeader{false};
  pipeline.add_flag("--no-document-header", noDocumentHeader, "do not render general document information");
  //   SubGroup("code rendering:");
  bool renderInlineCodes{false};
  pipeline.add_flag("--render-inline-codes", renderInlineCodes, "render codes in continuous text blocks");
  bool conceptNameCodes{false};
  pipeline.add_flag("--concept-name-codes", conceptNameCodes, "render code of concept names");
  bool numericUnitCodes{false};
  pipeline.add_flag("--numeric-unit-codes", numericUnitCodes, "render code of numeric measurement units");
  bool codeValueUnit{false};
  pipeline.add_flag("--code-value-unit", codeValueUnit, "use code value as measurement unit (default)");
  bool codeMeaningUnit{false};
  pipeline.add_flag("--code-meaning-unit", codeMeaningUnit, "use code meaning as measurement unit");
  bool renderAllCodes{false};
  pipeline.add_flag("--render-all-codes", renderAllCodes, "render all codes (implies +Ci, +Cn and +Cu)");
  bool codeDetailsTooltip{false};
  auto codeDetailsTooltipCliOption = pipeline.add_flag("--code-details-tooltip", codeDetailsTooltip, "render code details as a tooltip (implies +Cc)");
  codeDetailsTooltipCliOption->excludes(html32CliOption);
  ITK_WASM_PARSE(pipeline);

  size_t opt_readFlags = 0;
  size_t opt_renderFlags = DSRTypes::HF_renderDcmtkFootnote;
  const char *opt_cssName = NULL;
  const char *opt_defaultCharset = NULL;
  E_FileReadMode opt_readMode = ERM_autoDetect;
  E_TransferSyntax opt_ixfer = EXS_Unknown;
  OFBool opt_checkAllStrings = OFFalse;
  OFBool opt_convertToUTF8 = OFFalse;

  std::string cssReferenceContent;
  if(cssReference.GetPointer() != nullptr) {
    cssReferenceContent = std::string{ std::istreambuf_iterator<char>(cssReference.Get()), std::istreambuf_iterator<char>() };
  }
        
  /* input options */
  if(readFileOnly) {
    opt_readMode = ERM_fileOnly;
  }
  else if(readDataset) {
    opt_readMode = ERM_dataset;
  }
  else {
    opt_readMode = ERM_autoDetect; // Default
  }

  if (readXferAuto) {
    opt_ixfer = EXS_Unknown;
  }
  if (readXferDetect) {
    dcmAutoDetectDatasetXfer.set(OFTrue);
  }
  if (readXferLittle) {
    opt_ixfer = EXS_LittleEndianExplicit;
  }
  if (readXferBig) {
    opt_ixfer = EXS_BigEndianExplicit;
  }
  if (readXferImplicit) {
    opt_ixfer = EXS_LittleEndianImplicit;
  }

  /* processing options */

  if (processingDetails)
  {
    if(dsr2htmlLogger.isEnabledFor(OFLogger::INFO_LOG_LEVEL)) {
      opt_readFlags |= DSRTypes::RF_showCurrentlyProcessedItem;
    } else {
      std::cerr << "--processing-details: Verbose mode should be enabled for this option." << std::endl;
    }
  }
  if (unknownRelationship) {
    opt_readFlags |= DSRTypes::RF_acceptUnknownRelationshipType;
  }
  if (invalidItemValue) {
    opt_readFlags |= DSRTypes::RF_acceptInvalidContentItemValue;
  }
  if (ignoreConstraints) {
    opt_readFlags |= DSRTypes::RF_ignoreRelationshipConstraints;
  }
  if (ignoreItemErrors) {
    opt_readFlags |= DSRTypes::RF_ignoreContentItemErrors;
  }
  if (skipInvalidItems) {
    opt_readFlags |= DSRTypes::RF_skipInvalidContentItems;
  }
  if (disableVRChecker) {
    dcmEnableVRCheckerForStringValues.set(OFFalse);
  }

  /* character set options */
  if (charsetRequire) {
    opt_defaultCharset = NULL;
  }
  if (!charsetAssumeValue.empty()) {
    opt_defaultCharset = charsetAssumeValue.c_str();
  }

  if (charsetCheckAll) {
    opt_checkAllStrings = OFTrue;
  }
#ifdef DCMTK_ENABLE_CHARSET_CONVERSION
  if (convertToUTF8) {
    opt_convertToUTF8 = OFTrue;
  }
#endif

  /* output options */

  /* HTML compatibility */
  if (html32) {
    opt_renderFlags = (opt_renderFlags & ~DSRTypes::HF_XHTML11Compatibility) | DSRTypes::HF_HTML32Compatibility;
  }
  if (html40) {
    opt_renderFlags = (opt_renderFlags & ~(DSRTypes::HF_XHTML11Compatibility | DSRTypes::HF_HTML32Compatibility));
  }
  if (xhtml11) {
    opt_renderFlags = (opt_renderFlags & ~DSRTypes::HF_HTML32Compatibility) | DSRTypes::HF_XHTML11Compatibility | DSRTypes::HF_addDocumentTypeReference;
  }

  if (addDocumentType) {
    opt_renderFlags |= DSRTypes::HF_addDocumentTypeReference;
  }

  /* cascading style sheet */
  if (!cssReferenceContent.empty())
  {
    if((opt_renderFlags & DSRTypes::HF_HTML32Compatibility) > 0) {
      std::cerr << "--css-reference and --html-3.2 are conflicting options." << std::endl;
    }
    opt_renderFlags &= ~DSRTypes::HF_copyStyleSheetContent;
    opt_cssName = cssReferenceContent.c_str();
  }
  if (!cssFile.empty())
  {
    if ((opt_renderFlags & DSRTypes::HF_HTML32Compatibility) > 0) {
      std::cerr << "--css-file and --html-3.2 are conflicting options." << std::endl;
    }
    opt_renderFlags |= DSRTypes::HF_copyStyleSheetContent;
    opt_cssName = cssFile.c_str();
  }

  /* general rendering */
  if (expandInline)
  {
    /* default */
  }
  if (neverExpandInline) {
    opt_renderFlags |= DSRTypes::HF_neverExpandChildrenInline;
  }
  if (alwaysExpandInline) {
    opt_renderFlags |= DSRTypes::HF_alwaysExpandChildrenInline;
  }

  if (renderFullData) {
    opt_renderFlags |= DSRTypes::HF_renderFullData;
  }

  if (sectionTitleInline) {
    opt_renderFlags |= DSRTypes::HF_renderSectionTitlesInline;
  }

  /* document rendering */
  if (documentTypeTitle)
  {
    /* default */
  }
  if (patientInfoTitle) {
    opt_renderFlags |= DSRTypes::HF_renderPatientTitle;
  }

  if (noDocumentHeader) {
    opt_renderFlags |= DSRTypes::HF_renderNoDocumentHeader;
  }

  /* code rendering */
  if (renderInlineCodes) {
    opt_renderFlags |= DSRTypes::HF_renderInlineCodes;
  }
  if (conceptNameCodes) {
    opt_renderFlags |= DSRTypes::HF_renderConceptNameCodes;
  }
  if (numericUnitCodes) {
    opt_renderFlags |= DSRTypes::HF_renderNumericUnitCodes;
  }
  if (codeValueUnit) {
    opt_renderFlags &= ~DSRTypes::HF_useCodeMeaningAsUnit;
  }
  if (codeMeaningUnit) {
    opt_renderFlags |= DSRTypes::HF_useCodeMeaningAsUnit;
  }
  if (renderAllCodes) {
    opt_renderFlags |= DSRTypes::HF_renderAllCodes;
  }
  if (codeDetailsTooltip)
  {
    if ((opt_renderFlags & DSRTypes::HF_HTML32Compatibility) > 0) {
      std::cerr << "--code-details-tooltip and --html-3.2 are conflicting options." << std::endl;
    }
    opt_renderFlags |= DSRTypes::HF_useCodeDetailsTooltip;
  }

  /* print resource identifier */
  OFLOG_DEBUG(dsr2htmlLogger, rcsid << OFendl);

  /* make sure data dictionary is loaded */
  if (!dcmDataDict.isDictionaryLoaded())
  {
    OFLOG_WARN(dsr2htmlLogger, "no data dictionary loaded, check environment variable: "
      << DCM_DICT_ENVIRONMENT_VARIABLE);
  }

  // map "old" charset names to DICOM defined terms
  if (opt_defaultCharset != NULL)
  {
    OFString charset(opt_defaultCharset);
    if (charset == "latin-1")
      opt_defaultCharset = "ISO_IR 100";
    else if (charset == "latin-2")
      opt_defaultCharset = "ISO_IR 101";
    else if (charset == "latin-3")
      opt_defaultCharset = "ISO_IR 109";
    else if (charset == "latin-4")
      opt_defaultCharset = "ISO_IR 110";
    else if (charset == "latin-5")
      opt_defaultCharset = "ISO_IR 148";
    else if (charset == "cyrillic")
      opt_defaultCharset = "ISO_IR 144";
    else if (charset == "arabic")
      opt_defaultCharset = "ISO_IR 127";
    else if (charset == "greek")
      opt_defaultCharset = "ISO_IR 126";
    else if (charset == "hebrew")
      opt_defaultCharset = "ISO_IR 138";
  }

  int result = 0;
  const char *ifname = dicomFileName.c_str();

  if (renderFile(outputText.Get(), ifname, opt_cssName, opt_defaultCharset, opt_readMode, opt_ixfer, opt_readFlags,
    opt_renderFlags, opt_checkAllStrings, opt_convertToUTF8, urlPrefixValue).bad())
  {
    result = 3;
  }

  return result;
}

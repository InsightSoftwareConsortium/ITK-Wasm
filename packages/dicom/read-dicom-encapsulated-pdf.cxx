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
 *  Copyright (C) 2007-2021, OFFIS e.V.
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
 *  Module:  dcmdata
 *
 *  Author:  Marco Eichelberg
 *
 *  Purpose: Exctract PDF file from DICOM encapsulated PDF storage object
 *
 */
#include "itkPipeline.h"
#include "itkOutputBinaryStream.h"

#include "dcmtk/config/osconfig.h"    /* make sure OS specific configuration is included first */

BEGIN_EXTERN_C
#ifdef HAVE_FCNTL_H
#include <fcntl.h>       /* for O_RDONLY */
#endif
#ifdef HAVE_SYS_TYPES_H
#include <sys/types.h>   /* required for sys/stat.h */
#endif
#ifdef HAVE_SYS_STAT_H
#include <sys/stat.h>    /* for stat, fstat */
#endif
END_EXTERN_C

// Fix warning for redefinition of __STDC_FORMAT_MACROS in the header include tree for dctk.h
#ifdef __STDC_FORMAT_MACROS
  #undef __STDC_FORMAT_MACROS
#endif
#include "dcmtk/dcmdata/dctk.h"
#include "dcmtk/dcmdata/cmdlnarg.h"
#include "dcmtk/ofstd/ofconapp.h"
#include "dcmtk/dcmdata/dcuid.h"       /* for dcmtk version name */
#include "dcmtk/ofstd/ofstd.h"
#include "dcmtk/dcmdata/dcistrmz.h"    /* for dcmZlibExpectRFC1950Encoding */

#ifdef WITH_ZLIB
#include "itk_zlib.h"        /* for zlibVersion() */
#endif

#define OFFIS_CONSOLE_APPLICATION "dcm2pdf"

static OFLogger dcm2pdfLogger = OFLog::getLogger("dcmtk.apps." OFFIS_CONSOLE_APPLICATION);

static char rcsid[] = "$dcmtk: " OFFIS_CONSOLE_APPLICATION " v"
  OFFIS_DCMTK_VERSION " " OFFIS_DCMTK_RELEASEDATE " $";

int main(int argc, char *argv[])
{
  itk::wasm::Pipeline pipeline("read-dicom-encapsulated-pdf", "Extract PDF file from DICOM encapsulated PDF.", argc, argv);

  std::string dicomFileName;
  pipeline.add_option("dicom-file", dicomFileName, "Input DICOM file")->required()->check(CLI::ExistingFile)->type_name("INPUT_BINARY_FILE");

  itk::wasm::OutputBinaryStream outputBinaryStream;
  pipeline.add_option("pdf-binary-output", outputBinaryStream, "Output pdf file")->required()->type_name("OUTPUT_BINARY_STREAM");

  // Group: "input options"
  //  SubGroup "input file format"
  bool readFileOnly{false};
  pipeline.add_flag("--read-file-only", readFileOnly, "read file format only");
  bool readDataset{false};
  auto readDatasetCliOption = pipeline.add_flag("--read-dataset", readDataset, "read data set without file meta information");
  // SubGroup "input transfer syntax"
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

  // SubGroup "parsing of odd-length attributes"
  bool acceptOddLength{false};
  pipeline.add_flag("--accept-odd-length", acceptOddLength, "accept odd length attributes (default)");
  bool assumeEvenLength{false};
  pipeline.add_flag("--assume-even-length", assumeEvenLength, "assume real length is one byte larger");

  // SubGroup "handling of undefined length UN elements"
  bool enableCP246{false};
  pipeline.add_flag("--enable-cp246", enableCP246, "read undefined len UN as implicit VR (default)");
  bool disableCP246{false};
  pipeline.add_flag("--disable-cp246", disableCP246, "read undefined len UN as explicit VR");

  // SubGroup "handling of defined length UN elements"
  bool retainUN{false};
  pipeline.add_flag("--retain-un", retainUN, "retain elements as UN (default)");
  bool convertUN{false};
  pipeline.add_flag("--convert-un", convertUN, "convert to real VR if known");
  // SubGroup "automatic data correction"
  bool enableCorrection{false};
  pipeline.add_flag("--enable-correction", enableCorrection, "enable automatic data correction (default)");
  bool disableCorrection{false};
  pipeline.add_flag("--disable-correction", disableCorrection, "disable automatic data correction");
#ifdef WITH_ZLIB
  // SubGroup "bitstream format of deflated input"
  bool bitstreamDeflated{false};
  pipeline.add_flag("--bitstream-deflated", bitstreamDeflated, "expect deflated bitstream (default)");
  bool bitstreamZlib{false};
  pipeline.add_flag("--bitstream-zlib", bitstreamZlib, "expect deflated zlib bitstream");
#endif

  ITK_WASM_PARSE(pipeline);

  const char *opt_ifname = NULL;
  const char *opt_ofname = NULL;
  E_FileReadMode opt_readMode = ERM_autoDetect;
  E_TransferSyntax opt_ixfer = EXS_Unknown;

  // OFLog::configureFromCommandLine(cmd, app);
  if (readFileOnly) opt_readMode = ERM_fileOnly;
  if (readDataset) opt_readMode = ERM_dataset;
  if (readXferAuto) opt_ixfer = EXS_Unknown;
  if (readXferDetect) dcmAutoDetectDatasetXfer.set(OFTrue);
  if (readXferLittle) opt_ixfer = EXS_LittleEndianExplicit;
  if (readXferBig) opt_ixfer = EXS_BigEndianExplicit;
  if (readXferImplicit) opt_ixfer = EXS_LittleEndianImplicit;

  if (acceptOddLength) dcmAcceptOddAttributeLength.set(OFTrue);
  if (assumeEvenLength) dcmAcceptOddAttributeLength.set(OFFalse);

  if (enableCP246) dcmEnableCP246Support.set(OFTrue);
  if (disableCP246) dcmEnableCP246Support.set(OFFalse);

  if (retainUN) dcmEnableUnknownVRConversion.set(OFFalse);
  if (convertUN) dcmEnableUnknownVRConversion.set(OFTrue);

  if (enableCorrection) dcmEnableAutomaticInputDataCorrection.set(OFTrue);
  if (disableCorrection) dcmEnableAutomaticInputDataCorrection.set(OFFalse);

#ifdef WITH_ZLIB
  if (bitstreamDeflated) dcmZlibExpectRFC1950Encoding.set(OFFalse);
  if (bitstreamZlib) dcmZlibExpectRFC1950Encoding.set(OFTrue);
#endif

  /* print resource identifier */
  OFLOG_DEBUG(dcm2pdfLogger, rcsid << OFendl);

  /* make sure data dictionary is loaded */
  if (!dcmDataDict.isDictionaryLoaded())
  {
    OFLOG_WARN(dcm2pdfLogger, "no data dictionary loaded, check environment variable: "
      << DCM_DICT_ENVIRONMENT_VARIABLE);
  }

    // open inputfile
  opt_ifname = dicomFileName.c_str(); 
  if ((opt_ifname == NULL) || (strlen(opt_ifname) == 0))
  {
    OFLOG_FATAL(dcm2pdfLogger, "invalid filename: <empty string>");
    return 1;
  }

  DcmFileFormat fileformat;
  DcmDataset * dataset = fileformat.getDataset();

  OFLOG_DEBUG(dcm2pdfLogger, "open input file " << opt_ifname);

  OFCondition error = fileformat.loadFile(opt_ifname, opt_ixfer, EGL_noChange, DCM_MaxReadLength, opt_readMode);

  if (error.bad())
  {
    OFLOG_FATAL(dcm2pdfLogger, error.text() << ": reading file: " << opt_ifname);
    return 1;
  }

  OFString sopClass;
  error = dataset->findAndGetOFString(DCM_SOPClassUID, sopClass);
  if (error.bad() || sopClass != UID_EncapsulatedPDFStorage)
  {
    OFLOG_FATAL(dcm2pdfLogger, "not an Encapsulated PDF Storage object: " << opt_ifname);
    return 1;
  }

  DcmElement *delem = NULL;
  error = dataset->findAndGetElement(DCM_EncapsulatedDocument, delem);
  if (error.bad() || delem == NULL)
  {
    OFLOG_FATAL(dcm2pdfLogger, "attribute (0042,0011) Encapsulated Document missing.");
    return 1;
  }

  Uint32 len = delem->getLength();
  Uint8 *pdfDocument = NULL;
  error = delem->getUint8Array(pdfDocument);
  if (error.bad() || pdfDocument == NULL || len == 0)
  {
    OFLOG_FATAL(dcm2pdfLogger, "attribute (0042,0011) Encapsulated Document empty or wrong VR.");
    return 1;
  }

  /* strip pad byte at end of file, if there is one. The PDF format expects
  * files to end with %%EOF followed by CR/LF (although in some cases the
  * CR/LF may be missing or you might only find CR or LF).
  * If the last character of the file is not a CR or LF, and not the
  * letter 'F', we assume it is either trailing garbage or a pad byte, and remove it.
  */
  if (pdfDocument[len-1] != 10 && pdfDocument[len-1] != 13 && pdfDocument[len-1] != 'F')
  {
    --len;
  }

  std::ostream_iterator<unsigned char> oIt(outputBinaryStream.Get());
  std::copy(pdfDocument, (pdfDocument + len), oIt);

  OFLOG_DEBUG(dcm2pdfLogger, "PDF document size in bytes: " << len);
  OFLOG_DEBUG(dcm2pdfLogger, "conversion successful");

  return 0;
}
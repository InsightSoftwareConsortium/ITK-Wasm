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
 *  Copyright (C) 1998-2018, OFFIS e.V.
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
 *  Module:  dcmpstat
 *
 *  Authors: Joerg Riesmeier, Marco Eichelberg
 *
 *  Purpose
 *    sample application that reads a DICOM image and (optionally)
 *    a presentation state and creates a PGM bitmap using the settings
 *    of the presentation state. Non-grayscale transformations are
 *    ignored. If no presentation state is loaded, a default is created.
 *
 */

#include "itkPipeline.h"
#include "itkOutputTextStream.h"
#include "itkOutputImage.h"
#include "itkImportImageFilter.h"

#include "dcmtk/config/osconfig.h"    /* make sure OS specific configuration is included first */

#include "dcmtk/ofstd/ofstream.h"
// Fix warning for redefinition of __STDC_FORMAT_MACROS in the header include tree for dviface.h
#ifdef __STDC_FORMAT_MACROS
  #undef __STDC_FORMAT_MACROS
#endif
#include "dcmtk/dcmpstat/dviface.h"
#include "dcmtk/dcmpstat/dvpstx.h"    /* for DVPSTextObject */
#include "dcmtk/dcmpstat/dvpsgr.h"    /* for DVPSGraphicObject */
#include "dcmtk/dcmpstat/dvpscu.h"    /* for DVPSCurve */
#include "dcmtk/dcmimgle/dcmimage.h"
#include "dcmtk/dcmdata/cmdlnarg.h"
#include "dcmtk/ofstd/ofcmdln.h"
#include "dcmtk/ofstd/ofconapp.h"
#include "dcmtk/dcmdata/dcuid.h"      /* for dcmtk version name */

#include <cstring>

#ifdef WITH_ZLIB
#include "itk_zlib.h"     /* for zlibVersion() */
#endif

#define OFFIS_CONSOLE_APPLICATION "dcmp2pgm"

static OFLogger dcmp2pgmLogger = OFLog::getLogger("dcmtk.apps." OFFIS_CONSOLE_APPLICATION);

static char rcsid[] = "$dcmtk: " OFFIS_CONSOLE_APPLICATION " v"
  OFFIS_DCMTK_VERSION " " OFFIS_DCMTK_RELEASEDATE " $";


static void dumpPresentationState(STD_NAMESPACE ostream &out, DVPresentationState &ps)
{
  size_t i, j, max;
  const char *c;

  OFOStringStream oss;

  oss << "DUMPING PRESENTATION STATE" << OFendl
       << "--------------------------" << OFendl << OFendl;

  c = ps.getPresentationLabel();
  oss << "Presentation Label: "; if (c) oss << c << OFendl; else oss << "none" << OFendl;
  c = ps.getPresentationDescription();
  oss << "Presentation Description: "; if (c) oss << c << OFendl; else oss << "none" << OFendl;
  c = ps.getPresentationCreatorsName();
  oss << "Presentation Creator's Name: "; if (c) oss << c << OFendl; else oss << "none" << OFendl;

  oss << "VOI transformation: ";
  if (ps.haveActiveVOIWindow())
  {
    double width=0.0, center=0.0;
    ps.getCurrentWindowWidth(width);
    ps.getCurrentWindowCenter(center);
    oss << "window center=" << center << " width=" << width << " description=\"";
    c = ps.getCurrentVOIDescription();
    if (c) oss << c << "\"" << OFendl; else oss << "(none)\"" << OFendl;
  }
  else if (ps.haveActiveVOILUT())
  {
    oss << "lut description=\"";
    c = ps.getCurrentVOIDescription();
    if (c) oss << c << "\"" << OFendl; else oss << "(none)\"" << OFendl;
  }
  else oss << "none" << OFendl;

  oss << "Rotation: ";
  switch (ps.getRotation())
  {
    case DVPSR_0_deg:
      oss << "none";
      break;
    case DVPSR_90_deg:
      oss << "90 degrees";
      break;
    case DVPSR_180_deg:
      oss << "180 degrees";
      break;
    case DVPSR_270_deg:
      oss << "270 degrees";
      break;
  }
  oss << OFendl;
  oss << "Flip: ";
  if (ps.getFlip()) oss << "yes" << OFendl; else oss << "no" << OFendl;

  Sint32 tlhcX=0;
  Sint32 tlhcY=0;
  Sint32 brhcX=0;
  Sint32 brhcY=0;
  oss << "Displayed area:" << OFendl;

  DVPSPresentationSizeMode sizemode = ps.getDisplayedAreaPresentationSizeMode();
  double factor=1.0;
  switch (sizemode)
  {
    case DVPSD_scaleToFit:
      oss << "  presentation size mode: SCALE TO FIT" << OFendl;
      break;
    case DVPSD_trueSize:
      oss << "  presentation size mode: TRUE SIZE" << OFendl;
      break;
    case DVPSD_magnify:
      ps.getDisplayedAreaPresentationPixelMagnificationRatio(factor);
      oss << "  presentation size mode: MAGNIFY factor=" << factor << OFendl;
      break;
  }
  ps.getStandardDisplayedArea(tlhcX, tlhcY, brhcX, brhcY);
  oss << "  displayed area TLHC=" << tlhcX << "\\" << tlhcY << " BRHC=" << brhcX << "\\" << brhcY << OFendl;

  double x, y;
  if (EC_Normal == ps.getDisplayedAreaPresentationPixelSpacing(x,y))
  {
    oss << "  presentation pixel spacing: X=" << x << "mm Y=" << y << " mm" << OFendl;
  } else {
    oss << "  presentation pixel aspect ratio: " << ps.getDisplayedAreaPresentationPixelAspectRatio() << OFendl;
  }

  oss << "Rectangular shutter: ";
  if (ps.haveShutter(DVPSU_rectangular))
  {
    oss << "LV=" << ps.getRectShutterLV()
         << " RV=" << ps.getRectShutterRV()
         << " UH=" << ps.getRectShutterUH()
         << " LH=" << ps.getRectShutterLH() << OFendl;

  } else oss << "none" << OFendl;
  oss << "Circular shutter: ";
  if (ps.haveShutter(DVPSU_circular))
  {
    oss << "center=" << ps.getCenterOfCircularShutter_x()
         << "\\" << ps.getCenterOfCircularShutter_y()
         << " radius=" << ps.getRadiusOfCircularShutter() << OFendl;
  } else oss << "none" << OFendl;
  oss << "Polygonal shutter: ";
  if (ps.haveShutter(DVPSU_polygonal))
  {
     oss << "points=" << ps.getNumberOfPolyShutterVertices() << " coordinates=";
     j = ps.getNumberOfPolyShutterVertices();
     Sint32 polyX, polyY;
     for (i=0; i<j; i++)
     {
        if (EC_Normal == ps.getPolyShutterVertex(i, polyX, polyY))
        {
          oss << polyX << "\\" << polyY << ", ";
        } else oss << "???\\???,";
     }
     oss << OFendl;
  } else oss << "none" << OFendl;
  oss << "Bitmap shutter: ";
  if (ps.haveShutter(DVPSU_bitmap))
  {
     oss << "present" << OFendl;
  } else oss << "none" << OFendl;
  oss << "Shutter presentation value: 0x" << STD_NAMESPACE hex << ps.getShutterPresentationValue() << STD_NAMESPACE dec << OFendl;
  oss << OFendl;

  ps.sortGraphicLayers();  // to order of display
  for (size_t layer=0; layer<ps.getNumberOfGraphicLayers(); layer++)
  {
    c = ps.getGraphicLayerName(layer);
    oss << "Graphic Layer #" << layer+1 << " ["; if (c) oss << c; else oss << "(unnamed)";
    oss << "]" << OFendl;
    c = ps.getGraphicLayerDescription(layer);
    oss << "  Description: "; if (c) oss << c << OFendl; else oss << "none" << OFendl;
    oss << "  Recomm. display value: ";
    if (ps.haveGraphicLayerRecommendedDisplayValue(layer))
    {
      Uint16 r, g, b;
      oss << "gray ";
      if (EC_Normal == ps.getGraphicLayerRecommendedDisplayValueGray(layer, g))
      {
        oss << "0x" << STD_NAMESPACE hex << g << STD_NAMESPACE dec << OFendl;
      } else oss << "error" << OFendl;
      oss << "color ";
      if (EC_Normal == ps.getGraphicLayerRecommendedDisplayValueRGB(layer, r, g, b))
      {
        oss << "0x" << STD_NAMESPACE hex << r << "\\0x" << g << "\\0x" << b << STD_NAMESPACE dec << OFendl;
      } else oss << "error" << OFendl;
    } else oss << "none" << OFendl;

    // text objects
    max = ps.getNumberOfTextObjects(layer);
    oss << "  Number of text objects: " << max << OFendl;
    DVPSTextObject *ptext = NULL;
    for (size_t textidx=0; textidx<max; textidx++)
    {
      ptext = ps.getTextObject(layer, textidx);
      if (ptext)
      {
        // display contents of text object
        oss << "      text " << textidx+1 << ": \"" << ptext->getText() << "\"" << OFendl;
        oss << "        anchor point: ";
        if (ptext->haveAnchorPoint())
        {
          oss << ptext->getAnchorPoint_x() << "\\" << ptext->getAnchorPoint_y() << " units=";
          if (ptext->getAnchorPointAnnotationUnits()==DVPSA_display) oss << "display"; else oss << "pixel";
          oss << " visible=";
          if (ptext->anchorPointIsVisible()) oss << "yes"; else oss << "no";
          oss << OFendl;
        } else oss << "none" << OFendl;
        oss << "        bounding box: ";
        if (ptext->haveBoundingBox())
        {
          oss << "TLHC=";
          oss << ptext->getBoundingBoxTLHC_x() << "\\" << ptext->getBoundingBoxTLHC_y()
               << " BRHC=" << ptext->getBoundingBoxBRHC_x() << "\\" << ptext->getBoundingBoxBRHC_y()
               << " units=";
          if (ptext->getBoundingBoxAnnotationUnits()==DVPSA_display) oss << "display"; else oss << "pixel";

          DVPSTextJustification justification = ptext->getBoundingBoxHorizontalJustification();
          oss << " justification=";
          switch (justification)
          {
            case DVPSX_left:
              oss << "left";
              break;
            case DVPSX_right:
              oss << "right";
              break;
            case DVPSX_center:
              oss << "center";
              break;
          }
          oss << OFendl;
        } else oss << "none" << OFendl;
      }
    }

    // graphic objects
    max = ps.getNumberOfGraphicObjects(layer);
    oss << "  Number of graphic objects: " << max << OFendl;
    DVPSGraphicObject *pgraphic = NULL;
    for (size_t graphicidx=0; graphicidx<max; graphicidx++)
    {
      pgraphic = ps.getGraphicObject(layer, graphicidx);
      if (pgraphic)
      {
        // display contents of graphic object
        oss << "      graphic " << graphicidx+1 << ": points=" << pgraphic->getNumberOfPoints()
             << " type=";
        switch (pgraphic->getGraphicType())
        {
          case DVPST_polyline: oss << "polyline filled="; break;
          case DVPST_interpolated: oss << "interpolated filled="; break;
          case DVPST_circle: oss << "circle filled="; break;
          case DVPST_ellipse: oss << "ellipse filled="; break;
          case DVPST_point: oss << "point filled="; break;
        }
        if (pgraphic->isFilled()) oss << "yes units="; else oss << "no units=";
        if (pgraphic->getAnnotationUnits()==DVPSA_display) oss << "display"; else oss << "pixel";
        oss << OFendl << "        coordinates: ";
        j = pgraphic->getNumberOfPoints();
        Float32 fx=0.0, fy=0.0;
        for (i=0; i<j; i++)
        {
          if (EC_Normal==pgraphic->getPoint(i,fx,fy))
          {
            oss << fx << "\\" << fy << ", ";
          } else oss << "???\\???, ";
        }
        oss << OFendl;
      }
    }

    // curve objects
    max = ps.getNumberOfCurves(layer);
    oss << "  Number of activated curves: " << max << OFendl;
    DVPSCurve *pcurve = NULL;
    for (size_t curveidx=0; curveidx<max; curveidx++)
    {
      pcurve = ps.getCurve(layer, curveidx);
      if (pcurve)
      {
        // display contents of curve
        oss << "      curve " << curveidx+1 << ": points=" << pcurve->getNumberOfPoints()
            << " type=";
        switch (pcurve->getTypeOfData())
        {
          case DVPSL_roiCurve: oss << "roi units="; break;
          case DVPSL_polylineCurve: oss << "poly units="; break;
        }
        c = pcurve->getCurveAxisUnitsX();
        if (c && (strlen(c)>0)) oss << c << "\\"; else oss << "(none)\\";
        c = pcurve->getCurveAxisUnitsY();
        if (c && (strlen(c)>0)) oss << c << OFendl; else oss << "(none)" << OFendl;
        oss << "        label=";
        c = pcurve->getCurveLabel();
        if (c && (strlen(c)>0)) oss << c << " description="; else oss << "(none) description=";
        c = pcurve->getCurveDescription();
        if (c && (strlen(c)>0)) oss << c << OFendl; else oss << "(none)" << OFendl;
        oss << "        coordinates: ";
        j = pcurve->getNumberOfPoints();
        double dx=0.0, dy=0.0;
        for (i=0; i<j; i++)
        {
          if (EC_Normal==pcurve->getPoint(i,dx,dy))
          {
            oss << dx << "\\" << dy << ", ";
          } else oss << "???\\???, ";
        }
        oss << OFendl;
      } else oss << "      curve " << curveidx+1 << " not present in image." << OFendl;
    }

    // overlay objects
    const void *overlayData=NULL;
    unsigned int overlayWidth=0, overlayHeight=0, overlayLeft=0, overlayTop=0;
    OFBool overlayROI=OFFalse;
    Uint16 overlayTransp=0;
    char overlayfile[100];
    FILE *ofile=NULL;

    max = ps.getNumberOfActiveOverlays(layer);
    oss << "  Number of activated overlays: " << max << OFendl;
    for (size_t ovlidx=0; ovlidx<max; ovlidx++)
    {
      oss << "      overlay " << ovlidx+1 << ": group=0x" << STD_NAMESPACE hex
           << ps.getActiveOverlayGroup(layer, ovlidx) << STD_NAMESPACE dec << " label=\"";
      c=ps.getActiveOverlayLabel(layer, ovlidx);
      if (c) oss << c; else oss << "(none)";
      oss << "\" description=\"";
      c=ps.getActiveOverlayDescription(layer, ovlidx);
      if (c) oss << c; else oss << "(none)";
      oss << "\" type=";
      if (ps.activeOverlayIsROI(layer, ovlidx)) oss << "ROI"; else oss << "graphic";
      oss << OFendl;

      /* get overlay data */
      if (EC_Normal == ps.getOverlayData(layer, ovlidx, overlayData, overlayWidth, overlayHeight,
          overlayLeft, overlayTop, overlayROI, overlayTransp))
      {
        oss << "        columns=" << overlayWidth << " rows=" << overlayHeight << " left="
            << overlayLeft << " top=" << overlayTop << OFendl;
        sprintf(overlayfile, "ovl_%02d%02d.pgm", (int)layer+1, (int)ovlidx+1);
        oss << "        filename=\"" << overlayfile << "\"";

        ofile = fopen(overlayfile, "wb");
        if (ofile)
        {
          fprintf(ofile, "P5\n%d %d 255\n", overlayWidth, overlayHeight);
          if (fwrite(overlayData, overlayWidth, overlayHeight, ofile) == overlayHeight)
            oss << " - written." << OFendl;
          else
            oss << " -write error-" << OFendl;
          fclose(ofile);
        } else oss << " -write error-" << OFendl;
      } else {
        oss << "        unable to access overlay data!" << OFendl;
      }
    }
  }

  oss << OFendl;

  max = ps.getNumberOfVOILUTsInImage();
  oss << "VOI LUTs available in attached image: " << max << OFendl;
  for (size_t lutidx=0; lutidx<max; lutidx++)
  {
    oss << "  LUT #" << lutidx+1 << ": description=";
    c=ps.getDescriptionOfVOILUTsInImage(lutidx);
    if (c) oss << c << OFendl; else oss << "(none)" << OFendl;
  }

  max = ps.getNumberOfVOIWindowsInImage();
  oss << "VOI windows available in attached image: " << max << OFendl;
  for (size_t winidx=0; winidx<max; winidx++)
  {
    oss << "  Window #" << winidx+1 << ": description=";
    c=ps.getDescriptionOfVOIWindowsInImage(winidx);
    if (c) oss << c << OFendl; else oss << "(none)" << OFendl;
  }

  max = ps.getNumberOfOverlaysInImage();
  oss << "Overlays available (non-shadowed) in attached image: " << max << OFendl;
  for (size_t oidx=0; oidx<max; oidx++)
  {
    oss << "  Overlay #" << oidx+1 << ": group=0x" << STD_NAMESPACE hex << ps.getOverlayInImageGroup(oidx) << STD_NAMESPACE dec << " label=\"";
    c=ps.getOverlayInImageLabel(oidx);
    if (c) oss << c; else oss << "(none)";
    oss << "\" description=\"";
    c=ps.getOverlayInImageDescription(oidx);
    if (c) oss << c; else oss << "(none)";
    oss << "\" type=";
    if (ps.overlayInImageIsROI(oidx)) oss << "ROI"; else oss << "graphic";
    oss << OFendl;
  }

  oss << OFStringStream_ends;
  out << oss.str();
  OFSTRINGSTREAM_GETSTR(oss, res)
  OFLOG_INFO(dcmp2pgmLogger, res);
  OFSTRINGSTREAM_FREESTR(res)
}


int main(int argc, char *argv[])
{
  itk::wasm::Pipeline pipeline("apply-presentation-state-to-image", "Apply a presentation state to a given DICOM image and render output as pgm bitmap or dicom file.", argc, argv);
  // Inputs
  std::string imageIn;
  pipeline.add_option("image-in", imageIn, "Input DICOM file")->required()->check(CLI::ExistingFile)->type_name("INPUT_BINARY_FILE");

  // Outputs
  // Metadata output regarding overlays
  itk::wasm::OutputTextStream pstateOutStream;
  pipeline.add_option("presentation-state-out-stream", pstateOutStream, "Output overlay information")->type_name("OUTPUT_TEXT_STREAM");
  // Processed output image
  constexpr unsigned int Dimension = 2;
  using PixelType = unsigned char;
  using ImageType = itk::Image<PixelType, Dimension>;
  using OutputImageType = itk::wasm::OutputImage<ImageType>;
  OutputImageType outputImage;
  pipeline.add_option("output-image", outputImage, "Output image")->type_name("OUTPUT_IMAGE");

  // Parameters
  // addGroup "processing options:"
  std::string pstateFile;
  pipeline.add_option("--presentation-state-file", pstateFile, "[f]ilename: string, process using presentation state file")->required()->check(CLI::ExistingFile)->type_name("INPUT_BINARY_FILE");
  std::string configFile;
  pipeline.add_option("--config-file", configFile, "[f]ilename: string, process using settings from configuration file");
  // process a specific frame within the input dicom:
  int frame = 1;
  pipeline.add_option("--frame", frame, "[f]rame: integer, process using image frame f (default: 1)");

  // addGroup "output format:"
  bool pstateOutput{true};
  pipeline.add_flag("--presentation-state-output", pstateOutput, "get presentation state information in text stream (default: ON).");
  bool bitmapOutput{true};
  pipeline.add_flag("--bitmap-output", bitmapOutput, "get resulting image as bitmap output stream (default: ON).");

  bool outputFormatPGM{true};
  pipeline.add_flag("--pgm", outputFormatPGM, "save image as PGM (default)");
  bool outputFormatDICOM{false};
  pipeline.add_flag("--dicom", outputFormatDICOM, "save image as DICOM secondary capture");

  /* evaluate command line */
  ITK_WASM_PARSE(pipeline);

  // OFBool opt_dump_pstate     = OFFalse;              /* default: do not dump presentation state */
  OFBool opt_dicom_mode      = OFFalse;                 /* default: create PGM, not DICOM SC */
  OFCmdUnsignedInt opt_frame = frame;                   /* default: first frame */
  const char *opt_pstName    = NULL;                    /* pstate read file name */
  const char *opt_imgName    = imageIn.c_str();         /* image read file name */
  const char *opt_pgmName    = NULL;                    /* pgm save file name */
  const char *opt_cfgName    = NULL;                    /* config read file name */

  /* command line parameters and options */
  if (!pstateOutput && !bitmapOutput)
  {
    OFLOG_FATAL(dcmp2pgmLogger, "No output form requested. Specify either --presentation-state-output, --bitmap-output or both.");
  }

  if(!pstateFile.empty()) opt_pstName = pstateFile.c_str();
  if(!configFile.empty()) opt_cfgName = configFile.c_str();

  if (outputFormatPGM)         opt_dicom_mode = OFFalse;
  if (outputFormatDICOM)       opt_dicom_mode = OFTrue;

  /* print resource identifier */
  OFLOG_DEBUG(dcmp2pgmLogger, rcsid << OFendl);

  if (opt_cfgName)
  {
    FILE *cfgfile = fopen(opt_cfgName, "rb");
    if (cfgfile) fclose(cfgfile); else
    {
      OFLOG_FATAL(dcmp2pgmLogger, "can't open configuration file '" << opt_cfgName << "'");
      return 10;
    }
  }
  DVInterface dvi(opt_cfgName);
  OFCondition status = EC_Normal;

  if (opt_pstName == NULL)
  {
    OFLOG_DEBUG(dcmp2pgmLogger, "reading DICOM image file: " << opt_imgName);
    status = dvi.loadImage(opt_imgName);
  } else {
    OFLOG_DEBUG(dcmp2pgmLogger, "reading DICOM presentation-state file: " << opt_pstName);
    OFLOG_DEBUG(dcmp2pgmLogger, "reading DICOM image file: " << opt_imgName);
    status = dvi.loadPState(opt_pstName, opt_imgName);
  }

  if (status == EC_Normal)
  {
    if (pstateOutput) dumpPresentationState(pstateOutStream.Get(), dvi.getCurrentPState());
    if (bitmapOutput)
    {
      const void *pixelData = NULL;
      unsigned long width = 0;
      unsigned long height = 0;
      OFLOG_DEBUG(dcmp2pgmLogger, "creating pixel data");
      if ((opt_frame > 0) && (dvi.getCurrentPState().selectImageFrameNumber(opt_frame) != EC_Normal))
        OFLOG_ERROR(dcmp2pgmLogger, "cannot select frame " << opt_frame);

      std::array<double, 2> pixelSpacing{0.0, 0.0};
      if (EC_Normal != dvi.getCurrentPState().getDisplayedAreaPresentationPixelSpacing(pixelSpacing[0], pixelSpacing[1]))
        OFLOG_ERROR(dcmp2pgmLogger, "cannot read pixel spacing from presentation state.");

      if ((dvi.getCurrentPState().getPixelData(pixelData, width, height) == EC_Normal) && (pixelData != NULL))
      {
        if (opt_dicom_mode)
        {
          OFLOG_ERROR(dcmp2pgmLogger, "DICOM output format is currently not supported.");
        }
        else
        {
          using ImportFilterType = itk::ImportImageFilter<PixelType, Dimension>;
          auto importFilter = ImportFilterType::New();
          ImportFilterType::SizeType size;
          size[0] = width;
          size[1] = height;

          ImportFilterType::IndexType start;
          start.Fill(0);

          ImportFilterType::RegionType region;
          region.SetIndex(start);
          region.SetSize(size);
          importFilter->SetRegion(region);

          const itk::SpacePrecisionType origin[Dimension] = { 0.0, 0.0 };
          importFilter->SetOrigin(origin);
          const itk::SpacePrecisionType spacing[Dimension] = { pixelSpacing[0], pixelSpacing[1] };
          importFilter->SetSpacing(spacing);
          const unsigned int numberOfPixels = size[0] * size[1];
          importFilter->SetImportPointer((PixelType*)pixelData, numberOfPixels, false);
          importFilter->Update();

          // set as output image
          outputImage.Set(importFilter->GetOutput());
        }
      }
      else
      {
        OFLOG_FATAL(dcmp2pgmLogger, "Can't create output data.");
        return 10;
      }
    }
  }
  else
  {
    OFLOG_FATAL(dcmp2pgmLogger, "Can't open input file(s).");
    return 10;
  }

#ifdef DEBUG
  dcmDataDict.clear();  /* useful for debugging with dmalloc */
#endif

  return (status != EC_Normal);
}

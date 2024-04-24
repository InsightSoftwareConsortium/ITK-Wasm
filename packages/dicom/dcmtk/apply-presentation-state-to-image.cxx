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
 *  Copyright (C) 1994-2022, OFFIS e.V.
 *  All rights reserved.
 *
 *  This software and supporting documentation were developed by
 *
 *    OFFIS e.V.
 *    R&D Division Health
 *    Escherweg 2
 *    26121 Oldenburg, Germany
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions
 *  are met:
 *
 *  - Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *
 *  - Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 *  - Neither the name of OFFIS nor the names of its contributors may be
 *    used to endorse or promote products derived from this software
 *    without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *  "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *  LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *  A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *  HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 *
 *  Module:  dcmpstat
 *
 *  Authors: Joerg Riesmeier, Marco Eichelberg
 */

 /*
 *  Description
 *    This is a modified version of what was originally a DCMTK
 *    application (dcm2pgm). It takes two inputs:
 *    (1) a DICOM image, and
 *    (2) a grayscale presentation state file (DCM).
 *    It creates an output itkImage using the settings/attributes defined
 *    in the presentation state. Other information of the presentation
 *    state related to graphic overlays such as annotations, labels,
 *    shutters, bitmap overlays, etc are returned as a second output in
 *    the form of a JSON string.
 */

#include "itkImportImageFilter.h"
#include "itkOutputImage.h"
#include "itkOutputTextStream.h"
#include "itkPipeline.h"
#include "itkImageAlgorithm.h"

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

#include "dcmtk/ofstd/ofvector.h"

#include "cpp-base64/base64.h"
#include "rapidjson/document.h"
#include "rapidjson/prettywriter.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"
using namespace rapidjson;

#include <array>
#include <cstring>

#ifdef WITH_ZLIB
#include "itk_zlib.h"     /* for zlibVersion() */
#endif

#define OFFIS_CONSOLE_APPLICATION "apply-presentation-state-to-image"

static OFLogger appLogger = OFLog::getLogger("dcmtk.apps." OFFIS_CONSOLE_APPLICATION);

static char rcsid[] = "$dcmtk: " OFFIS_CONSOLE_APPLICATION " v"
  OFFIS_DCMTK_VERSION " " OFFIS_DCMTK_RELEASEDATE " $";

/** Set rapidjson Value to c const char * string if not null. */
void safeSetString(Value &v, const char *s, Document::AllocatorType& alloc)
{
  if (s) {
    v.SetString(s, std::strlen(s), alloc);
  } else {
    v.SetString("", 0, alloc);
  }
}

static void dumpPresentationState(STD_NAMESPACE ostream &out, DVPresentationState &ps, const char *pstName = NULL)
{
  size_t i, j, max;

  // START JSON structure
  Document doc(kObjectType);
  Document::AllocatorType& alloc = doc.GetAllocator();

  Value presentationLabel;
  safeSetString(presentationLabel, ps.getPresentationLabel(), alloc);
  doc.AddMember("PresentationLabel",
    presentationLabel, alloc);
  Value presentationDescription;
  safeSetString(presentationDescription, ps.getPresentationDescription(), alloc);
  doc.AddMember("PresentationDescription",
    presentationDescription, alloc);
  Value presentationCreatorsName;
  safeSetString(presentationCreatorsName, ps.getPresentationCreatorsName(), alloc);
  doc.AddMember("PresentationCreatorsName",
    presentationCreatorsName, alloc);
  if (ps.haveActiveVOIWindow())
  {
    double width=0.0, center=0.0;
    ps.getCurrentWindowWidth(width);
    ps.getCurrentWindowCenter(center);
    doc.AddMember("CurrentWindowCenter", Value(center), alloc);
    doc.AddMember("CurrentWindowWidth", Value(width), alloc);
    Value currentVoiDescription;
    safeSetString(currentVoiDescription, ps.getCurrentVOIDescription(), alloc);
    doc.AddMember("CurrentVOIDescription", currentVoiDescription, alloc);
  }
  else if (ps.haveActiveVOILUT())
  {
    Value currentVoiDescription;
    safeSetString(currentVoiDescription, ps.getCurrentVOIDescription(), alloc);
    doc.AddMember("CurrentVOIDescription", currentVoiDescription, alloc);
  }

  // ICC color Profile
  DcmFileFormat imageFF;
  OFCondition cond = imageFF.loadFile(pstName);
  if (cond.good())
  {
    const Uint8* iccProfile;
    unsigned long iccProfileSize = 0;
    cond = imageFF.getDataset()->findAndGetUint8Array(DCM_ICCProfile, iccProfile, &iccProfileSize);
    if (cond.good() && iccProfileSize > 0)
    {
      // Encode the binary color profile data as a base64 string
      doc.AddMember("ICCProfile", Value(base64_encode(iccProfile, iccProfileSize, false).c_str(), alloc), alloc);
    }
  }
  doc.AddMember("Flip", Value(ps.getFlip()), alloc);
  int rotation = 0;
  switch (ps.getRotation())
  {
    case DVPSR_0_deg:
      rotation = 0;
      break;
    case DVPSR_90_deg:
      rotation = 90;
      break;
    case DVPSR_180_deg:
      rotation = 180;
      break;
    case DVPSR_270_deg:
      rotation = 270;
      break;
  }
  doc.AddMember("Rotation", Value(rotation), alloc);

  DVPSPresentationSizeMode sizemode = ps.getDisplayedAreaPresentationSizeMode();
  double factor=1.0;
  std::string presentationSizeMode;
  switch (sizemode)
  {
    case DVPSD_scaleToFit:
      presentationSizeMode = "scaleToFit";
      break;
    case DVPSD_trueSize:
      presentationSizeMode = "trueSize";
      break;
    case DVPSD_magnify:
      presentationSizeMode = "magnify";
      ps.getDisplayedAreaPresentationPixelMagnificationRatio(factor);
      break;
  }
  doc.AddMember("PresentationSizeMode", Value(presentationSizeMode.c_str(), alloc), alloc);
  doc.AddMember("DisplayedAreaPresentationPixelMagnificationRatio", Value(factor), alloc);

  std::array<int, 4> displayArea{0, 0, 0, 0};
  ps.getStandardDisplayedArea(displayArea[0], displayArea[1], displayArea[2], displayArea[3]);
  auto dav = itk::wasm::getArrayJson(displayArea, alloc);
  doc.AddMember("StandardDisplayedArea", dav, alloc);

  std::array<double, 2> pixelSpacing{0.0, 0.0};
  if (EC_Normal == ps.getDisplayedAreaPresentationPixelSpacing(pixelSpacing[0], pixelSpacing[1]))
  {
    auto psv = itk::wasm::getArrayJson(pixelSpacing, alloc);
    doc.AddMember("DisplayedAreaPresentationPixelSpacing", psv, alloc);
  } else {
    auto aspectRatio = ps.getDisplayedAreaPresentationPixelAspectRatio();
    doc.AddMember("DisplayedAreaPresentationPixelAspectRatio", Value(aspectRatio), alloc);
  }

  if (ps.haveShutter(DVPSU_rectangular))
  {
    Value rectShutter(kObjectType);
    rectShutter.AddMember("RectShutterLV", Value(ps.getRectShutterLV()), alloc);
    rectShutter.AddMember("RectShutterRV", Value(ps.getRectShutterRV()), alloc);
    rectShutter.AddMember("RectShutterUH", Value(ps.getRectShutterUH()), alloc);
    rectShutter.AddMember("RectShutterLH", Value(ps.getRectShutterLH()), alloc);
    doc.AddMember("RectangularShutter", rectShutter, alloc);
  }

  if (ps.haveShutter(DVPSU_circular))
  {
    Value circularShutter(kObjectType);
    circularShutter.AddMember("CenterOfCircularShutter_x", Value(ps.getCenterOfCircularShutter_x()), alloc);
    circularShutter.AddMember("CenterOfCircularShutter_y", Value(ps.getCenterOfCircularShutter_y()), alloc);
    circularShutter.AddMember("RadiusOfCircularShutter", Value(ps.getRadiusOfCircularShutter()), alloc);
    doc.AddMember("CircularShutter", circularShutter, alloc);
  }

  if (ps.haveShutter(DVPSU_polygonal))
  {
    j = ps.getNumberOfPolyShutterVertices();
    Sint32 polyX, polyY;
    std::vector<Sint32> vertices;
    vertices.reserve(j*2);
    for (i=0; i<j; i++)
    {
      if (EC_Normal == ps.getPolyShutterVertex(i, polyX, polyY))
      {
        vertices.push_back(polyX);
        vertices.push_back(polyY);
      }
    }
    auto coordinates = itk::wasm::getArrayJson(vertices, alloc);
    Value polyShutter(kObjectType);

    // rapidjson::Value doesn't have a default constructor for size_t (aka unsigned long).
    // However, we can safely type-cast this value into a 32-bit unsigned integer (uint32_t)
    // based on DICOM standards value representation "Integer String" (IS).
    polyShutter.AddMember("NumberOfPolyShutterVertices", Value(static_cast<uint32_t>(ps.getNumberOfPolyShutterVertices())), alloc);

    polyShutter.AddMember("Coordinates", coordinates, alloc);
    doc.AddMember("PolygonalShutter", polyShutter, alloc);
  }

  // TODO: add support for Bitmap shutter (bitmap masking).
  if (ps.haveShutter(DVPSU_bitmap))
  {
    OFLOG_ERROR(appLogger, "Bitmap shutter is currently not supported.");
  }
  doc.AddMember("ShutterPresentationValue", Value(ps.getShutterPresentationValue()), alloc);

  ps.sortGraphicLayers();  // to order of display
  Value graphicsLayersJsonArray(kArrayType);
  for (size_t layer=0; layer<ps.getNumberOfGraphicLayers(); layer++)
  {
    Value layerJson(kObjectType);
    Value graphicLayerName;
    safeSetString(graphicLayerName, ps.getGraphicLayerName(layer), alloc);
    layerJson.AddMember("Name", graphicLayerName, alloc);
    Value graphicLayerDescription;
    safeSetString(graphicLayerDescription, ps.getGraphicLayerDescription(layer), alloc);
    layerJson.AddMember("Description", graphicLayerDescription, alloc);
    if (ps.haveGraphicLayerRecommendedDisplayValue(layer))
    {
      Uint16 r, g, b;
      if (EC_Normal == ps.getGraphicLayerRecommendedDisplayValueGray(layer, g))
      {
        layerJson.AddMember("RecommendedDisplayValueGray", Value(g), alloc);
      }

      if (EC_Normal == ps.getGraphicLayerRecommendedDisplayValueRGB(layer, r, g, b))
      {
        const std::array<Uint16, 3> rgb{r, g, b};
        layerJson.AddMember("RecommendedDisplayValueRGB", itk::wasm::getArrayJson(rgb, alloc), alloc);
      }
    }

    // text objects
    max = ps.getNumberOfTextObjects(layer);
    DVPSTextObject *ptext = NULL;

    // TextObjects[]
    Value textObjectsJsonArray(kArrayType);

    for (size_t textidx=0; textidx<max; textidx++)
    {
      ptext = ps.getTextObject(layer, textidx);
      if (ptext)
      {
        Value textObjectJson(kObjectType);
        // display contents of text object
        Value textObjectText;
        safeSetString(textObjectText, ptext->getText(), alloc);
        textObjectJson.AddMember("Text", textObjectText, alloc);
        if (ptext->haveAnchorPoint())
        {
          const std::array<double, 2> anchorPoint{ptext->getAnchorPoint_x(), ptext->getAnchorPoint_y()};
          auto apv = itk::wasm::getArrayJson(anchorPoint, alloc);
          textObjectJson.AddMember("AnchorPoint", apv, alloc);
          Value anchorPointUnits;
          std::string anchorPointUnitsString(ptext->getAnchorPointAnnotationUnits()==DVPSA_display? "display" : "pixel");
          anchorPointUnits.SetString(anchorPointUnitsString.c_str(), anchorPointUnitsString.length(), alloc);
          textObjectJson.AddMember("AnchorPointUnits", anchorPointUnits, alloc);
          textObjectJson.AddMember("AnchorPointVisible", Value(ptext->anchorPointIsVisible()), alloc);
        }

        if (ptext->haveBoundingBox())
        {
          const std::array<double, 4> box{ptext->getBoundingBoxTLHC_x(), ptext->getBoundingBoxTLHC_y(), ptext->getBoundingBoxBRHC_x(), ptext->getBoundingBoxBRHC_y()};
          auto bv = itk::wasm::getArrayJson(box, alloc);
          textObjectJson.AddMember("BoundingBox", itk::wasm::getArrayJson(box, alloc), alloc);
          Value boundingBoxUnits;
          std::string boundingBoxUnitsString(ptext->getBoundingBoxAnnotationUnits()==DVPSA_display ? "display" : "pixel");
          boundingBoxUnits.SetString(boundingBoxUnitsString.c_str(), boundingBoxUnitsString.length(), alloc);
          textObjectJson.AddMember("BoundingBoxUnits", boundingBoxUnits, alloc);

          DVPSTextJustification justification = ptext->getBoundingBoxHorizontalJustification();
          std::string horizontalJustification;
          switch (justification)
          {
            case DVPSX_left:
              horizontalJustification = "left";
              break;
            case DVPSX_right:
              horizontalJustification = "right";
              break;
            case DVPSX_center:
              horizontalJustification = "center";
              break;
          }
          textObjectJson.AddMember("BoundingBoxHorizontalJustification", Value(horizontalJustification.c_str(), alloc), alloc);
        }
        textObjectsJsonArray.PushBack(textObjectJson, alloc);
      }
    }

    layerJson.AddMember("TextObjects", textObjectsJsonArray, alloc);

    // graphic objects
    max = ps.getNumberOfGraphicObjects(layer);
    DVPSGraphicObject *pgraphic = NULL;

    // GraphicObjects[]
    Value graphicObjectsJsonArray(kArrayType);

    for (size_t graphicidx=0; graphicidx<max; graphicidx++)
    {
      pgraphic = ps.getGraphicObject(layer, graphicidx);
      if (pgraphic)
      {
        Value graphicJson(kObjectType);
        std::string graphicTypeString = "none";
        switch (pgraphic->getGraphicType())
        {
          case DVPST_polyline: graphicTypeString = "polyline"; break;
          case DVPST_interpolated: graphicTypeString = "interpolated"; break;
          case DVPST_circle: graphicTypeString = "circle"; break;
          case DVPST_ellipse: graphicTypeString = "ellipse"; break;
          case DVPST_point: graphicTypeString = "point"; break;
        }

        Value graphicType;
        graphicType.SetString(graphicTypeString.c_str(), graphicTypeString.length(), alloc);
        graphicJson.AddMember("GraphicType", graphicType, alloc);
        graphicJson.AddMember("IsFilled", Value(pgraphic->isFilled()), alloc);
        Value units;
        std::string unitsString(pgraphic->getAnnotationUnits()==DVPSA_display? "display" : "pixel");
        units.SetString(unitsString.c_str(), unitsString.length(), alloc);
        graphicJson.AddMember("Units", units, alloc);

        j = pgraphic->getNumberOfPoints();
        Float32 fx=0.0, fy=0.0;
        std::vector<float> points;
        for (i=0; i<j; i++)
        {
          if (EC_Normal==pgraphic->getPoint(i,fx,fy))
          {
            points.push_back(fx);
            points.push_back(fy);
          }
        }
        graphicJson.AddMember("Points", itk::wasm::getArrayJson(points, alloc), alloc);
        graphicObjectsJsonArray.PushBack(graphicJson, alloc);
      }
    }
    layerJson.AddMember("GraphicObjects", graphicObjectsJsonArray, alloc); // GraphicObjects[]

    // curve objects
    max = ps.getNumberOfCurves(layer);
    DVPSCurve *pcurve = NULL;

    // Curves[]
    Value curvesJsonArray(kArrayType);

    for (size_t curveidx=0; curveidx<max; curveidx++)
    {
      pcurve = ps.getCurve(layer, curveidx);
      if (pcurve)
      {
        Value curveJson(kObjectType); // curve{}
        std::string type;
        switch (pcurve->getTypeOfData())
        {
          case DVPSL_roiCurve: type = "roiCurve"; break;
          case DVPSL_polylineCurve: type = "polylineCurve"; break;
        }
        curveJson.AddMember("Type", Value(type.c_str(), alloc), alloc);
        curveJson.AddMember("AxisUnitsX", Value(pcurve->getCurveAxisUnitsX(), alloc), alloc);
        curveJson.AddMember("AxisUnitsY", Value(pcurve->getCurveAxisUnitsY(), alloc), alloc);
        Value label;
        safeSetString(label, pcurve->getCurveLabel(), alloc);
        curveJson.AddMember("Label", label, alloc);
        Value description;
        safeSetString(description, pcurve->getCurveDescription(), alloc);
        curveJson.AddMember("Description", description, alloc);

        j = pcurve->getNumberOfPoints();
        double dx=0.0, dy=0.0;
        std::vector<double> points;
        points.reserve(j*2);
        for (i=0; i<j; i++)
        {
          if (EC_Normal==pcurve->getPoint(i,dx,dy))
          {
            points.push_back(dx);
            points.push_back(dy);
          }
        }
        curveJson.AddMember("Points", itk::wasm::getArrayJson(points, alloc), alloc);
        curvesJsonArray.PushBack(curveJson, alloc);
      }
    }

    layerJson.AddMember("Curves", curvesJsonArray, alloc);

    // overlay objects
    const void *overlayData=NULL;
    unsigned int overlayWidth=0, overlayHeight=0, overlayLeft=0, overlayTop=0;
    OFBool overlayROI=OFFalse;
    Uint16 overlayTransp=0;
    char overlayfile[100];
    FILE *ofile=NULL;

    max = ps.getNumberOfActiveOverlays(layer);

    // Overlays[]
    Value overlaysJsonArray(kArrayType);

    for (size_t ovlidx=0; ovlidx<max; ovlidx++)
    {
      Value overlayJson(kObjectType);
      overlayJson.AddMember("Index", Value(static_cast<uint32_t>(ovlidx)), alloc);
      std::stringstream value;
      value << "0x" << STD_NAMESPACE hex << ps.getActiveOverlayGroup(layer, ovlidx) << STD_NAMESPACE dec;
      overlayJson.AddMember("Group", Value(value.str().c_str(), alloc), alloc);
      Value label;
      safeSetString(label, ps.getActiveOverlayLabel(layer, ovlidx), alloc);
      overlayJson.AddMember("Label", label, alloc);
      Value description;
      safeSetString(description, ps.getActiveOverlayDescription(layer, ovlidx), alloc);
      overlayJson.AddMember("Description", description, alloc);
      Value type;
      std::string typeString(ps.activeOverlayIsROI(layer, ovlidx) ? "ROI" : "graphic");
      type.SetString(typeString.c_str(), typeString.length(), alloc);
      overlayJson.AddMember("Type", type, alloc);

      /* get overlay data */
      if (EC_Normal == ps.getOverlayData(layer, ovlidx, overlayData, overlayWidth, overlayHeight,
          overlayLeft, overlayTop, overlayROI, overlayTransp))
      {
        overlayJson.AddMember("Width", Value(overlayWidth), alloc);
        overlayJson.AddMember("Height", Value(overlayHeight), alloc);
        overlayJson.AddMember("Left", Value(overlayLeft), alloc);
        overlayJson.AddMember("Top", Value(overlayTop), alloc);

        std::stringstream buff;
        buff << "P5\n" << overlayWidth << " " << overlayHeight << " " << "255\n";
        buff.write((const char*)overlayData, overlayWidth * overlayHeight);

        constexpr bool urlFriendly = false;
        overlayJson.AddMember("OverlayData", Value(base64_encode(buff.str(), urlFriendly).c_str(), alloc), alloc);
      } else {
        OFLOG_ERROR(appLogger, "unable to access overlay data!");
      }
      overlaysJsonArray.PushBack(overlayJson, alloc);
    }
    layerJson.AddMember("Overlays", overlaysJsonArray, alloc); // Overlays[]
    graphicsLayersJsonArray.PushBack(layerJson, alloc);
  }
  doc.AddMember("GraphicsLayers", graphicsLayersJsonArray, alloc); // GraphicsLayers[]

  // Pretty print the json into output stream.
  StringBuffer buffer;
  PrettyWriter<StringBuffer> writer(buffer);
  doc.Accept(writer);
  out << buffer.GetString();
}

constexpr unsigned int Dimension = 2;
using GrayPixelType = uint8_t;
using GrayImageType = itk::Image<GrayPixelType, Dimension>;
using OutputGrayImageType = itk::wasm::OutputImage<GrayImageType>;

using ColorPixelType = itk::RGBPixel<uint8_t>;
using ColorImageType = itk::Image<ColorPixelType, Dimension>;
using OutputColorImageType = itk::wasm::OutputImage<ColorImageType>;

template<typename OutputImageType, typename PixelType, unsigned int Dim>
int GenerateOutputImage(typename OutputImageType::Pointer & outputImage, const unsigned long width, const unsigned long height, const std::array<double, 2>& pixelSpacing, const void* pixelData)
{
  using ImportFilterType = itk::ImportImageFilter<PixelType, Dim>;
  auto importFilter = itk::ImportImageFilter<PixelType, Dim>::New();
  typename ImportFilterType::SizeType size;
  size[0] = width;
  size[1] = height;

  typename itk::ImportImageFilter<PixelType, Dim>::IndexType start;
  start.Fill(0);

  typename itk::ImportImageFilter<PixelType, Dim>::RegionType region;
  region.SetIndex(start);
  region.SetSize(size);
  importFilter->SetRegion(region);

  const itk::SpacePrecisionType origin[Dim] = { 0.0, 0.0 };
  importFilter->SetOrigin(origin);
  const itk::SpacePrecisionType spacing[Dim] = { pixelSpacing[0], pixelSpacing[1] };
  importFilter->SetSpacing(spacing);
  const unsigned int numberOfPixels = size[0] * size[1];
  // ColorImageType::Internal
  importFilter->SetImportPointer((PixelType*)pixelData, numberOfPixels, false);
  importFilter->Update();
  outputImage = importFilter->GetOutput();
  return EXIT_SUCCESS;
}

template int GenerateOutputImage<GrayImageType,  GrayPixelType,  2U>(typename GrayImageType::Pointer &,  const unsigned long, const unsigned long, const std::array<double, 2>&, const void*);
template int GenerateOutputImage<ColorImageType, ColorPixelType, 2U>(typename ColorImageType::Pointer &, const unsigned long, const unsigned long, const std::array<double, 2>&, const void*);

int main(int argc, char *argv[])
{
  itk::wasm::Pipeline pipeline("apply-presentation-state-to-image", "Apply a presentation state to a given DICOM image and render output as bitmap, or dicom file.", argc, argv);

  // Expecting color output
  bool colorOutput{false};
  pipeline.add_flag("--color-output", colorOutput, "output image as RGB (default: false)");

  // pre-parse command line to determine if we need color or gray output image
  ITK_WASM_PRE_PARSE(pipeline);

  // Inputs
  std::string imageIn;
  pipeline.add_option("image-in", imageIn, "Input DICOM file")->required()->check(CLI::ExistingFile)->type_name("INPUT_BINARY_FILE");

  std::string pstateFile;
  pipeline.add_option("presentation-state-file", pstateFile, "Process using presentation state file")->required()->check(CLI::ExistingFile)->type_name("INPUT_BINARY_FILE");

  // Outputs
  // Metadata output regarding overlays
  itk::wasm::OutputTextStream pstateOutStream;
  pipeline.add_option("presentation-state-out-stream", pstateOutStream, "Output overlay information")->type_name("OUTPUT_JSON");

  // Parameters
  std::string configFile;
  pipeline.add_option("--config-file", configFile, "filename: string. Process using settings from configuration file");
  // process a specific frame within the input dicom:
  int frame = 1;
  pipeline.add_option("--frame", frame, "frame: integer. Process using image frame f (default: 1)");

  // addGroup "output format:"
  bool noPstateOutput{false};
  pipeline.add_flag("--no-presentation-state-output", noPstateOutput, "Do not get presentation state information in text stream.");
  bool noBitmapOutput{false};
  pipeline.add_flag("--no-bitmap-output", noBitmapOutput, "Do not get resulting image as bitmap output stream.");

  // Define output image and bind to CLI option
  OutputGrayImageType outputGrayImage;
  OutputColorImageType outputColorImage;
  if (colorOutput)
  {
    pipeline.add_option("output-image", outputColorImage, "Output image")->type_name("OUTPUT_IMAGE");
  }
  else
  {
    pipeline.add_option("output-image", outputGrayImage, "Output image")->type_name("OUTPUT_IMAGE");
  }

  // DICOM output is currently not supported.
  // bool outputFormatPGM{true};
  // pipeline.add_flag("--pgm", outputFormatPGM, "save image as PGM (default)");
  // bool outputFormatDICOM{false};
  // pipeline.add_flag("--dicom", outputFormatDICOM, "save image as DICOM secondary capture");

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
  if (noPstateOutput && noBitmapOutput)
  {
    OFLOG_FATAL(appLogger, "No output form requested. Do not specify both --no-presentation-state-output and --no-bitmap-output.");
  }

  if(!pstateFile.empty()) opt_pstName = pstateFile.c_str();
  if(!configFile.empty()) opt_cfgName = configFile.c_str();

  // DICOM output is currently not supported
  // if (outputFormatPGM)         opt_dicom_mode = OFFalse;
  // if (outputFormatDICOM)       opt_dicom_mode = OFTrue;

  /* print resource identifier */
  OFLOG_DEBUG(appLogger, rcsid << OFendl);

  if (opt_cfgName)
  {
    FILE *cfgfile = fopen(opt_cfgName, "rb");
    if (cfgfile) fclose(cfgfile); else
    {
      OFLOG_FATAL(appLogger, "can't open configuration file '" << opt_cfgName << "'");
      return 10;
    }
  }
  DVInterface dvi(opt_cfgName);
  OFCondition status = EC_Normal;
  const void *pixelData = NULL;
  GrayImageType::Pointer grayImage;
  ColorImageType::Pointer colorImage;

  if (opt_pstName == NULL)
  {
    OFLOG_DEBUG(appLogger, "reading DICOM image file: " << opt_imgName);
    status = dvi.loadImage(opt_imgName);
  } else {
    OFLOG_DEBUG(appLogger, "reading DICOM presentation-state file: " << opt_pstName);
    OFLOG_DEBUG(appLogger, "reading DICOM image file: " << opt_imgName);
    status = dvi.loadPState(opt_pstName, opt_imgName);
  }

  if (status == EC_Normal)
  {
    if (!noPstateOutput) dumpPresentationState(pstateOutStream.Get(), dvi.getCurrentPState(), opt_pstName);
    if (!noBitmapOutput)
    {
      unsigned long width = 0;
      unsigned long height = 0;
      OFLOG_DEBUG(appLogger, "creating pixel data");
      if ((opt_frame > 0) && (dvi.getCurrentPState().selectImageFrameNumber(opt_frame) != EC_Normal))
        OFLOG_ERROR(appLogger, "cannot select frame " << opt_frame);

      std::array<double, 2> pixelSpacing{0.0, 0.0};
      if (EC_Normal != dvi.getCurrentPState().getDisplayedAreaPresentationPixelSpacing(pixelSpacing[0], pixelSpacing[1]))
        OFLOG_ERROR(appLogger, "cannot read pixel spacing from presentation state.");

      if ((dvi.getCurrentPState().getPixelData(pixelData, width, height) == EC_Normal) && (pixelData != NULL))
      {
        if (opt_dicom_mode)
        {
          OFLOG_ERROR(appLogger, "DICOM output format is currently not supported.");
        }
        else
        {
          if (colorOutput)
          {
            auto result =  GenerateOutputImage<ColorImageType, ColorPixelType, 2U>(colorImage, width, height, pixelSpacing, pixelData);
            outputColorImage.Set(colorImage);
            return result;
          }
          else
          {
            auto result = GenerateOutputImage<GrayImageType, GrayPixelType, 2U>(grayImage, width, height, pixelSpacing, pixelData);
            outputGrayImage.Set(grayImage);
            return result;
          }
        }
      }
      else
      {
        OFLOG_FATAL(appLogger, "Can't create output data.");
        return 10;
      }
    }
  }
  else
  {
    OFLOG_FATAL(appLogger, "Can't open input file(s).");
    return 10;
  }

#ifdef DEBUG
  dcmDataDict.clear();  /* useful for debugging with dmalloc */
#endif

  return (status != EC_Normal);
}

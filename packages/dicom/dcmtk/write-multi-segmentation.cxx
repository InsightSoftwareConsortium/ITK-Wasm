/*=========================================================================

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

// DCMQI includes
#include "dcmqi/Itk2DicomConverter.h"
#undef HAVE_SSTREAM // Avoid redefinition warning
#include "dcmqi/internal/VersionConfigure.h"

// DCMTK includes
#include "dcmtk/oflog/configrt.h"

#include "itkPipeline.h"
#include "itkInputImage.h"
#include "itkOutputBinaryStream.h"
#include "itkSupportInputImageTypes.h"
#include "itkSmartPointer.h"
#include "itkInputTextStream.h"

typedef dcmqi::Helper helper;
constexpr unsigned int Dimension = 3;
using PixelType = short;
using ScalarImageType = itk::Image<PixelType, Dimension>;

int runPipeline(
  itk::wasm::InputTextStream& metaInfoStream,
  const std::vector<std::string> & dicomImageFiles,
  const std::vector<std::string> & segImageFiles,
  const std::string & outputDicomFile,
  const bool skipEmptySlices,
  const bool useLabelIDAsSegmentNumber)
{
  const std::string metaInfo((std::istreambuf_iterator<char>(metaInfoStream.Get())),
                                      std::istreambuf_iterator<char>());

  // Pipeline code goes here
    if(dicomImageFiles.empty()){
    cerr << "Error: No input DICOM files specified!" << endl;
    return EXIT_FAILURE;
  }

  std::vector<ScalarImageType::ConstPointer> segmentations;
  for(size_t segFileNumber = 0; segFileNumber < segImageFiles.size(); ++segFileNumber)
  {
    ShortReaderType::Pointer reader = ShortReaderType::New();
    reader->SetFileName(segImageFiles[segFileNumber]);
    reader->Update();
    cout << "Loaded segmentation from " << segImageFiles[segFileNumber] << endl;

    ShortImageType::Pointer labelImage = reader->GetOutput();
    segmentations.push_back(labelImage);

    ShortImageType::SizeType ref_size, cmp_size;
    ref_size = segmentations[0]->GetLargestPossibleRegion().GetSize();
    cmp_size = labelImage->GetLargestPossibleRegion().GetSize();
    if(ref_size[0] != cmp_size[0] || ref_size[1] != cmp_size[1])
    {
      cerr << "Error: In-plane dimensions of segmentations are inconsistent!" << endl;
      cerr << ref_size << " vs " << cmp_size << endl;
      return EXIT_FAILURE;
    }
  }
  // itk::Indent indent;
  // img->Print(std::cout, indent);

#if !defined(NDEBUG) || defined(_DEBUG)
    // Display DCMTK debug, warning, and error logs in the console
    // For some reason, this code has no effect if it is called too early (e.g., directly after PARSE_ARGS)
    // therefore we call it here.
    dcmtk::log4cplus::BasicConfigurator::doConfigure();
#endif

  if(!helper::pathsExist(dicomImageFiles))
  {
    return EXIT_FAILURE;
  }

  std::vector<DcmDataset*> dcmDatasets = helper::loadDatasets(dicomImageFiles);

  if(dcmDatasets.empty())
  {
    cerr << "Error: no DICOM could be loaded from the specified list/directory" << endl;
    return EXIT_FAILURE;
  }

  /*
  ifstream metainfoStream(metaInfoFile.c_str(), ios_base::binary);
  std::string metadata( (std::istreambuf_iterator<char>(metainfoStream) ),
                       (std::istreambuf_iterator<char>()));
  */

  Json::Value metaRoot;
  istringstream metainfoisstream(metaInfo);
  metainfoisstream >> metaRoot;

  if(metaRoot.isMember("segmentAttributes"))
  {
    if(metaRoot["segmentAttributes"].size() != segImageFiles.size())
    {
      cerr << "Error: number of items in the \"segmentAttributes\" metadata array should match the number of input segmentation files!" << endl;
      cerr << "segmentAttributes has: " << metaRoot["segmentAttributes"].size() << " items, the are " << segImageFiles.size() << " input segmentation files!" << endl;
      return EXIT_FAILURE;
    }
  }

  if(metaRoot.isMember("segmentAttributesFileMapping"))
  {
    if(metaRoot["segmentAttributesFileMapping"].size() != metaRoot["segmentAttributes"].size())
    {
      cerr << "Number of files in segmentAttributesFileMapping should match the number of entries in segmentAttributes!" << endl;
      return EXIT_FAILURE;
    }
    // otherwise, re-order the entries in the segmentAtrributes list to match the order of files in segmentAttributesFileMapping
    Json::Value reorderedSegmentAttributes;
    vector<int> fileOrder(segImageFiles.size());
    fill(fileOrder.begin(), fileOrder.end(), -1);
    vector<ShortImageType::ConstPointer> segmentationsReordered(segImageFiles.size());
    for(size_t filePosition=0;filePosition<segImageFiles.size();filePosition++)
    {
      for(size_t mappingPosition=0;mappingPosition<segImageFiles.size();mappingPosition++)
      {
        string mappingItem = metaRoot["segmentAttributesFileMapping"][static_cast<int>(mappingPosition)].asCString();
        size_t foundPos = segImageFiles[filePosition].rfind(mappingItem);
        if(foundPos != std::string::npos)
        {
          fileOrder[filePosition] = mappingPosition;
          break;
        }
      }
      if(fileOrder[filePosition] == -1)
      {
        cerr << "Failed to map " << segImageFiles[filePosition] << " from the segmentAttributesFileMapping attribute to an input file name!" << endl;
        return EXIT_FAILURE;
      }
    }
    cout << "Order of input ITK images updated as shown below based on the segmentAttributesFileMapping attribute:" << endl;
    for(size_t i=0;i<segImageFiles.size();i++)
    {
      cout << " image " << i << " moved to position " << fileOrder[i] << endl;
      segmentationsReordered[fileOrder[i]] = segmentations[i];
    }
    segmentations = segmentationsReordered;
  }

  try
  {
    DcmDataset* result = dcmqi::Itk2DicomConverter::itkimage2dcmSegmentation(dcmDatasets,
      segmentations,
      metaInfo,
      skipEmptySlices,
      useLabelIDAsSegmentNumber);

    if (result == NULL)
    {
      std::cerr << "ERROR: Conversion failed." << std::endl;
      return EXIT_FAILURE;
    }
    else
    {
      DcmFileFormat segdocFF(result);
      bool compress = false;
      if (compress)
      {
        CHECK_COND(segdocFF.saveFile(outputDicomFile.c_str(), EXS_DeflatedLittleEndianExplicit));
      }
      else
      {
        CHECK_COND(segdocFF.saveFile(outputDicomFile.c_str(), EXS_LittleEndianExplicit));
      }

      std::cout << "Saved segmentation as " << outputDicomFile << endl;
    }

    for (size_t i = 0; i < dcmDatasets.size(); i++)
    {
      delete dcmDatasets[i];
    }

    if (result != NULL)
    {
      delete result;
    }
    return EXIT_SUCCESS;
  }
  catch (int e)
  {
    std::cerr << "Fatal error encountered." << std::endl;
  }
  return EXIT_SUCCESS;
}

int main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("write-multi-segmentation", "Write DICOM segmentation object using multiple input images.", argc, argv);

  //itk::wasm::InputImage<ScalarImageType> inputImage;
  //pipeline.add_option("seg-image", inputImage, "dicom segmentation object as an image")->required()->type_name("INPUT_IMAGE");

  itk::wasm::InputTextStream metaInfo;
  pipeline.add_option("meta-info", metaInfo, "JSON file containing the meta-information that describes" \
    "the measurements to be encoded. See DCMQI documentation for details.")->required()->type_name("INPUT_JSON");

  std::string outputDicomFile;
  pipeline.add_option("output-dicom-file", outputDicomFile, "File name of the DICOM SEG object that will store the" \
    "result of conversion.")->required()->type_name("OUTPUT_BINARY_FILE");

  std::vector<std::string> refDicomSeriesFiles;
  pipeline.add_option("-r,--ref-dicom-series", refDicomSeriesFiles, "List of DICOM files that correspond to the original." \
    "image that was segmented.")->required()->check(CLI::ExistingFile)->expected(1,-1)->type_name("INPUT_BINARY_FILE");

  std::vector<std::string> segImageFiles;
  pipeline.add_option("-i,--seg-images", segImageFiles, "List of input segmentation images." \
    "image that was segmented.")->required()->check(CLI::ExistingFile)->expected(1,-1)->type_name("INPUT_BINARY_FILE");

  bool skipEmptySlices{false};
  pipeline.add_flag("-s,--skip-empty-slices", skipEmptySlices, "Skip empty slices while encoding segmentation image." \
    "By default, empty slices will not be encoded, resulting in a smaller output file size.");

  bool useLabelIDAsSegmentNumber{false};
  pipeline.add_flag("-l,--use-labelid-as-segmentnumber", useLabelIDAsSegmentNumber, "Use label IDs from ITK images as" \
    "Segment Numbers in DICOM. Only works if label IDs are consecutively numbered starting from 1, otherwise conversion will fail.");

  ITK_WASM_PARSE(pipeline);

  return runPipeline(
    metaInfo,
    refDicomSeriesFiles,
    segImageFiles,
    outputDicomFile,
    skipEmptySlices,
    useLabelIDAsSegmentNumber
  );
}

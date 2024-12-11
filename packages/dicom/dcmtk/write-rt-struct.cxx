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
#include <string>
#include <vector>
#include <fstream>
#include <memory>

#include "rt_study.h"

#include "itkPipeline.h"
#include "itkOutputImage.h"
#include "itkOutputTextStream.h"

int main (int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("write-rt-struct", "Write a DICOM RT Struct file for the given reference dicom series and ROI contours", argc, argv);
  pipeline.set_version("1.0.0");

  // std::vector<std::string> inputFileNames;
  // pipeline.add_option("-i,--input-images", inputFileNames, "File names in the series")->required()->check(CLI::ExistingFile)->expected(1,-1)->type_name("INPUT_BINARY_FILE");

  std::string referenceDicomSeries;
  auto referenceDicomSeriesOption = pipeline.add_option("reference-dicom-series", referenceDicomSeries, "Directory with the reference image DICOM series");

  std::string inputCxt;
  auto inputCxtOption = pipeline.add_option("input-cxt", inputCxt, "Input CXT structure set file");

  bool fileNamesWithUids = false;
  auto fileNamesWithUidsOption = pipeline.add_flag("--file-names-with-uids", fileNamesWithUids, "Use file names with UIDs");

  std::string outputDicom;
  auto outputDicomOption = pipeline.add_option("output-dicom", outputDicom, "Output DICOM directory");

  ITK_WASM_PARSE(pipeline);

  Rt_study rt_study;

  rt_study.load_dicom_dir(referenceDicomSeries.c_str());
  rt_study.load_cxt(inputCxt.c_str());

  rt_study.save_dicom(outputDicom.c_str(), fileNamesWithUids);

  return EXIT_SUCCESS;
}

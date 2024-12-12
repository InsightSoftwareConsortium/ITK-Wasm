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

  std::string inputCxt;
  auto inputCxtOption = pipeline.add_option("input-cxt", inputCxt, "Input CXT structure set file");

  bool fileNamesWithUids = false;
  auto fileNamesWithUidsOption = pipeline.add_flag("--file-names-with-uids", fileNamesWithUids, "Use file names with UIDs");

  std::string outputDicom;
  auto outputDicomOption = pipeline.add_option("output-dicom", outputDicom, "Output DICOM directory");

  ITK_WASM_PARSE(pipeline);

  Rt_study rt_study;

  rt_study.load_cxt(inputCxt.c_str());

  Rt_study_metadata::Pointer rt_study_metadata = rt_study.get_rt_study_metadata();
  rt_study_metadata->set_study_description("A Test Prostate Lesion RT Struct Study");
  rt_study_metadata->set_patient_birth_date("19700101");
  rt_study_metadata->print();
  // rt_study.set_rt_study_metadata(rt_study_metadata);
  // rt_study_metadata->set_study_instance_uid("
  Metadata::Pointer study_metadata = rt_study_metadata->get_study_metadata();
  study_metadata->print_metadata();

  Metadata::Pointer rtstruct_metadata = rt_study_metadata->get_rtstruct_metadata();
  rtstruct_metadata->print_metadata();

  rt_study.save_dicom(outputDicom.c_str(), fileNamesWithUids);

  return EXIT_SUCCESS;
}

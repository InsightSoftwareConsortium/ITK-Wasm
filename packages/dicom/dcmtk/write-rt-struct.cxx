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

#include "itk_wasm_rt_study.h"
#include "itk_wasm_rt_study_metadata.h"
#include "plm_uid_prefix.h"

#include "itkPipeline.h"
#include "itkInputTextStream.h"

#include "glaze/glaze.hpp"

int main (int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("write-rt-struct", "Write a DICOM RT Struct Structured Set for the given ROI contours and DICOM metadata", argc, argv);
  pipeline.set_version("0.1.0");

  std::string inputCxt;
  auto inputCxtOption = pipeline.add_option("input-cxt", inputCxt, "Input Plastimatch CXT structure set file")->required()->check(CLI::ExistingFile)->type_name("INPUT_TEXT_FILE");

  std::string outputDicom;
  auto outputDicomOption = pipeline.add_option("output-dicom", outputDicom, "Output DICOM RT Struct Structure Set file")->required()->type_name("OUTPUT_BINARY_FILE");

  itk::wasm::InputTextStream dicomMetadataJson;
  auto dicomMetadataOption = pipeline.add_option("--dicom-metadata", dicomMetadataJson, "Additional DICOM metadata")->type_name("INPUT_JSON");

  ITK_WASM_PARSE(pipeline);

  std::string dicomMetadataString("{}");
  if (dicomMetadataOption->count() > 0)
  {
    std::cout << "Reading DICOM metadata from JSON: " << dicomMetadataOption->count() << std::endl;
    dicomMetadataString = std::string(std::istreambuf_iterator<char>(dicomMetadataJson.Get()), {});
  }
  auto deserializedAttempt = glz::read_json<ItkWasmRtStudyMetadata>(dicomMetadataString);
  if (!deserializedAttempt)
  {
    const std::string descriptiveError = glz::format_error(deserializedAttempt, dicomMetadataString);
    std::cerr << "Failed to deserialize dicom metadata: " << descriptiveError << std::endl;
    return EXIT_FAILURE;
  }
  const auto dicomMetadata = deserializedAttempt.value();

  std::cout << "UID Prefix: " << dicomMetadata.uidPrefix << std::endl;

  PlmUidPrefix::getInstance().set(dicomMetadata.uidPrefix);

  Itk_wasm_rt_study rt_study;

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


  rt_study.save_rtss(outputDicom.c_str(), dicomMetadata);

  return EXIT_SUCCESS;
}

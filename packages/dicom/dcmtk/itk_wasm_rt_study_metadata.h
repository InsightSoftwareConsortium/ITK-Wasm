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
#ifndef _itk_wasm_rt_study_metadata_h_
#define _itk_wasm_rt_study_metadata_h_

struct ItkWasmRoiMetadata
{
  std::string roiGenerationAlgorithm{ "" };
  std::string roiDescription{ "" };
  std::string rtRoiInterpretedType{ "" };
};

/** Additional RT Study Metadata applied by ITK-Wasm. */
struct ItkWasmRtStudyMetadata
{
  // ITK-Wasm's DICOM UID Prefix
  // Vendor's should replace this with their own UID prefix
  std::string uidPrefix{ "1.2.826.0.1.3680043.10.1541.1" };
  std::string manufacturer{ "ITK-Wasm" };
  std::string manufacturerModelName{ "ITK-Wasm RT Struct" };
  std::vector<ItkWasmRoiMetadata> roiMetadata;
};

#endif

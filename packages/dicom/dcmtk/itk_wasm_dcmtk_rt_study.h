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
#ifndef _itk_wasm_dcmtk_rt_study_h_
#define _itk_wasm_dcmtk_rt_study_h_

#include "dcmtk_rt_study.h"

#include "itk_wasm_rt_study_metadata.h"

class PLMBASE_API Itk_wasm_dcmtk_rt_study : public Dcmtk_rt_study
{
public:
  Itk_wasm_dcmtk_rt_study();
  ~Itk_wasm_dcmtk_rt_study();

  void
  save_rtss(const char * fname, const ItkWasmRtStudyMetadata & metadata);

protected:
};

#endif

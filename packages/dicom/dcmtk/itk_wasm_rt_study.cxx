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
#include "itk_wasm_rt_study.h"

#include "rt_study_p.h"
#include "itk_wasm_dcmtk_rt_study.h"

Itk_wasm_rt_study::Itk_wasm_rt_study ()
{
}

Itk_wasm_rt_study::~Itk_wasm_rt_study ()
{
}

void
Itk_wasm_rt_study::save_rtss (const char* fname, const ItkWasmRtStudyMetadata& metadata)
{
  // Modified:
  // rt_study.cxx Rt_study::save_dicom
  if (this->d_ptr->m_img) {
    this->d_ptr->m_drs->set_image_header (this->d_ptr->m_img);
  }
  if (this->d_ptr->m_seg) {
    this->d_ptr->m_seg->cxt_extract ();
  }

  // Modified:
  // rtds_dcmtk.cxx Rt_study::save_dcmtk
  Itk_wasm_dcmtk_rt_study drs;
  drs.set_rt_study_metadata (this->d_ptr->m_drs);
  drs.set_image (this->d_ptr->m_img);
  if (d_ptr->m_seg) {
    /* GCS FIX. This call to prune_empty() is a hack.
    It should be allowed to write empty structures, but
    current plastimatch logic sets num_structures to max
    when performing cxt_extract().  Segmentation class
    logic should be improved to better keep track of
    when structure names are valid to avoid this. */
    this->d_ptr->m_seg->prune_empty ();
    this->d_ptr->m_seg->keyholize ();
    drs.set_rtss (this->d_ptr->m_seg->get_structure_set());
  }
  drs.set_dose (this->d_ptr->m_dose);
  drs.set_rtplan (this->d_ptr->m_rtplan);

  drs.save_rtss(fname, metadata);
}
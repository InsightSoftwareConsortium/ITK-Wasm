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
#ifndef _itk_wasm_rt_study_h_
#define _itk_wasm_rt_study_h_

#include "rt_study.h"
#include "rt_study_metadata.h"

#include "itk_wasm_rt_study_metadata.h"

/*! \brief
 * The Rt_study class encapsulates the concept of a radiotherapy planning
 * data set, including image, structure set, and dose.
 *
 * Itk_wasm_rt_study supports writing to an output RT Struct file and setting
 * additional metadata.
 */
class PLMBASE_API Itk_wasm_rt_study: public Rt_study {
public:
    SMART_POINTER_SUPPORT (Itk_wasm_rt_study);
public:
    // Itk_wasm_rt_study_private *d_ptr;

public:
    Itk_wasm_rt_study ();
    ~Itk_wasm_rt_study ();

    void save_rtss (const char *fname, const ItkWasmRtStudyMetadata &metadata);

    // /*! \brief Get the Rt_study_metadata */
    // const Rt_study_metadata::Pointer& get_rt_study_metadata () const;
    // Rt_study_metadata::Pointer& get_rt_study_metadata ();
    // /*! \brief Set metadata items into study_metadata portion of Rt_study_metadata */
    // void set_study_metadata (const std::vector<std::string>& metadata);
    // /*! \brief Get the study_metadata portion of Rt_study_metadata */
    // Metadata::Pointer& get_study_metadata ();
    // /*! \brief Set metadata items into image portion of Rt_study_metadata */
    // void set_image_metadata (const std::vector<std::string>& metadata);
    // /*! \brief Get the image portion of Rt_study_metadata */
    // Metadata::Pointer& get_image_metadata ();
    // /*! \brief Set metadata items into dose portion of Rt_study_metadata */
    // void set_dose_metadata (const std::vector<std::string>& metadata);
    // /*! \brief Get the dose portion of Rt_study_metadata */
    // Metadata::Pointer& get_dose_metadata ();
    // /*! \brief Set metadata items into rtstruct portion 
    //   of Rt_study_metadata */
    // void set_rtstruct_metadata (const std::vector<std::string>& metadata);
    // /*! \brief Get the rtstruct portion of Rt_study_metadata */
    // Metadata::Pointer& get_rtstruct_metadata ();
    // /*! \brief Create new StudyInstanceUID and FrameOfReferenceUID for the study */
    // void generate_new_study_uids ();
    // /*! \brief Force the CT series UID to a certain value when saving */
    // void force_ct_series_uid (const std::string& series_uid);

protected:
    // void save_dcmtk (const char *dicom_dir, bool filenames_with_uid);
};

#endif

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
#include "itk_wasm_dcmtk_rt_study.h"

#include "dcmtk_rt_study_p.h"

#include "plmbase_config.h"
#include <stdlib.h>
#include <stdio.h>
#include "dcmtk_config.h"
#include "dcmtk/ofstd/ofstream.h"
#include "dcmtk/dcmdata/dctk.h"

#include "dcmtk_file.h"
#include "dcmtk_metadata.h"
#include "dcmtk_module.h"
#include "dcmtk_rt_study.h"
#include "dcmtk_rt_study_p.h"
#include "dcmtk_series.h"
#include "dcmtk_slice_data.h"
#include "dcmtk_util.h"
#include "file_util.h"
#include "logfile.h"
#include "metadata.h"
#include "plm_uid_prefix.h"
#include "plm_version.h"
#include "print_and_exit.h"
#include "rtss.h"
#include "rtss_contour.h"
#include "rtss_roi.h"
#include "string_util.h"

Itk_wasm_dcmtk_rt_study::Itk_wasm_dcmtk_rt_study ()
{
}

Itk_wasm_dcmtk_rt_study::~Itk_wasm_dcmtk_rt_study ()
{
}

void
Itk_wasm_dcmtk_rt_study::save_rtss (const char * fname, const ItkWasmRtStudyMetadata & metadata)
{
    // Modified:
    // rt_study.cxx Rt_study::save_dicom
    this->d_ptr->rt_study_metadata->generate_new_rtstruct_instance_uid ();

    // Modified:
    // rtds_dcmtk.cxx Rt_study::rtss_save

    OFCondition ofc;
    Rtss::Pointer& rtss = this->d_ptr->rtss;
    Metadata::Pointer rtstruct_metadata;
    if (this->d_ptr->rt_study_metadata) {
        rtstruct_metadata = d_ptr->rt_study_metadata->get_rtstruct_metadata ();
    }

    /* Prepare structure set with slice uids */
    const Slice_list *slice_list = d_ptr->rt_study_metadata->get_slice_list ();
    rtss->apply_slice_list (slice_list);

    /* Prepare dcmtk */
    DcmFileFormat fileformat;
    DcmDataset *dataset = fileformat.getDataset();

    /* Add entries for common modules */
    Dcmtk_module::set_sop_common (dataset);

    /* GCS FIX, remove below code, use common modules instead */

    /* ----------------------------------------------------------------- */
    /*     Part 1  -- General header                                     */
    /* ----------------------------------------------------------------- */
    dataset->putAndInsertOFStringArray(DCM_InstanceCreationDate,
        d_ptr->rt_study_metadata->get_study_date());
    dataset->putAndInsertOFStringArray(DCM_InstanceCreationTime,
        d_ptr->rt_study_metadata->get_study_time());
    dataset->putAndInsertOFStringArray(DCM_InstanceCreatorUID,
        PlmUidPrefix::getInstance().get().c_str());
    dataset->putAndInsertString (DCM_SOPClassUID, UID_RTStructureSetStorage);
    dcmtk_put (dataset, DCM_SOPInstanceUID,
        d_ptr->rt_study_metadata->get_rtstruct_instance_uid());
    dataset->putAndInsertOFStringArray (DCM_StudyDate,
        d_ptr->rt_study_metadata->get_study_date());
    dataset->putAndInsertOFStringArray (DCM_StudyTime,
        d_ptr->rt_study_metadata->get_study_time());
    dcmtk_copy_from_metadata (dataset, rtstruct_metadata,
        DCM_StudyDescription, "");

    dataset->putAndInsertOFStringArray (DCM_AccessionNumber, "");
    dataset->putAndInsertOFStringArray (DCM_Modality, "RTSTRUCT");
    dataset->putAndInsertString (DCM_Manufacturer, metadata.manufacturer.c_str());
    dataset->putAndInsertString (DCM_InstitutionName, "");
    dataset->putAndInsertString (DCM_ReferringPhysicianName, "");
    dataset->putAndInsertString (DCM_StationName, "");
    dcmtk_copy_from_metadata (dataset, rtstruct_metadata, 
        DCM_SeriesDescription, "");
    dataset->putAndInsertString (DCM_ManufacturerModelName, metadata.manufacturerModelName.c_str());

    dcmtk_copy_from_metadata (dataset, rtstruct_metadata, DCM_PatientName, "");
    dcmtk_copy_from_metadata (dataset, rtstruct_metadata, DCM_PatientID, "");
    dataset->putAndInsertString (DCM_PatientBirthDate, "");
    dcmtk_copy_from_metadata (dataset, rtstruct_metadata, DCM_PatientSex, "O");
    dataset->putAndInsertString (DCM_SoftwareVersions,
        PLASTIMATCH_VERSION_STRING);

    dataset->putAndInsertString (DCM_StudyInstanceUID, 
        d_ptr->rt_study_metadata->get_study_uid().c_str());
    dataset->putAndInsertString (DCM_SeriesInstanceUID, 
        d_ptr->rt_study_metadata->get_rtstruct_series_uid());
    dcmtk_copy_from_metadata (dataset, rtstruct_metadata, DCM_StudyID, "10001");
    dcmtk_copy_from_metadata (dataset, rtstruct_metadata, DCM_SeriesNumber, "1");
    dataset->putAndInsertString (DCM_InstanceNumber, "1");
    dataset->putAndInsertString (DCM_StructureSetLabel, "AutoSS");
    dataset->putAndInsertString (DCM_StructureSetName, "AutoSS");
    dataset->putAndInsertOFStringArray (DCM_StructureSetDate, 
        d_ptr->rt_study_metadata->get_study_date());
    dataset->putAndInsertOFStringArray (DCM_StructureSetTime, 
        d_ptr->rt_study_metadata->get_study_time());

    /* ----------------------------------------------------------------- */
    /*     Part 2  -- UID's for CT series                                */
    /* ----------------------------------------------------------------- */
    DcmSequenceOfItems *rfor_seq = 0;
    DcmItem *rfor_item = 0;
    dataset->findOrCreateSequenceItem (
        DCM_ReferencedFrameOfReferenceSequence, rfor_item, -2);
    rfor_item->putAndInsertString (DCM_FrameOfReferenceUID, 
        d_ptr->rt_study_metadata->get_frame_of_reference_uid().c_str());
    dataset->findAndGetSequence (
        DCM_ReferencedFrameOfReferenceSequence, rfor_seq);
    DcmItem *rtrstudy_item = 0;
    rfor_item->findOrCreateSequenceItem (
        DCM_RTReferencedStudySequence, rtrstudy_item, -2);
    rtrstudy_item->putAndInsertString (
        DCM_ReferencedSOPClassUID, 
        UID_RETIRED_StudyComponentManagementSOPClass);
    rtrstudy_item->putAndInsertString (
        DCM_ReferencedSOPInstanceUID,
        d_ptr->rt_study_metadata->get_study_uid().c_str());
    DcmItem *rtrseries_item = 0;
    rtrstudy_item->findOrCreateSequenceItem (
        DCM_RTReferencedSeriesSequence, rtrseries_item, -2);
    rtrseries_item->putAndInsertString (
        DCM_SeriesInstanceUID, d_ptr->rt_study_metadata->get_ct_series_uid());

    for (int k = 0; k < d_ptr->rt_study_metadata->num_slices(); k++) {
        DcmItem *ci_item = 0;
        rtrseries_item->findOrCreateSequenceItem (
            DCM_ContourImageSequence, ci_item, -2);
        ci_item->putAndInsertString (
            DCM_ReferencedSOPClassUID, UID_CTImageStorage);
        ci_item->putAndInsertString (
            DCM_ReferencedSOPInstanceUID, 
            d_ptr->rt_study_metadata->get_slice_uid (k));
    }

    /* ----------------------------------------------------------------- */
    /*     Part 3  -- Structure info                                     */
    /* ----------------------------------------------------------------- */
    for (size_t i = 0; i < rtss->num_structures; i++) {
        DcmItem *ssroi_item = 0;
        std::string tmp;
        dataset->findOrCreateSequenceItem (
            DCM_StructureSetROISequence, ssroi_item, -2);
        tmp = string_format ("%d", rtss->slist[i]->id);
        ssroi_item->putAndInsertString (DCM_ROINumber, tmp.c_str());
        ssroi_item->putAndInsertString (DCM_ReferencedFrameOfReferenceUID,
            d_ptr->rt_study_metadata->get_frame_of_reference_uid().c_str());
        ssroi_item->putAndInsertString (DCM_ROIName, 
            rtss->slist[i]->name.c_str());
        if (metadata.roiMetadata.size() > i) {
            ssroi_item->putAndInsertString (DCM_ROIGenerationAlgorithm,
                metadata.roiMetadata[i].roiGenerationAlgorithm.c_str());
            ssroi_item->putAndInsertString (DCM_ROIDescription,
                metadata.roiMetadata[i].roiDescription.c_str());
        }
        else {
            ssroi_item->putAndInsertString (DCM_ROIGenerationAlgorithm, "");
        }
    }

    /* ----------------------------------------------------------------- */
    /*     Part 4  -- Contour info                                       */
    /* ----------------------------------------------------------------- */
    for (size_t i = 0; i < rtss->num_structures; i++) {
	Rtss_roi *curr_structure = rtss->slist[i];
        DcmItem *roic_item = 0;
        dataset->findOrCreateSequenceItem (
            DCM_ROIContourSequence, roic_item, -2);
        std::string tmp = curr_structure->get_dcm_color_string ();
        roic_item->putAndInsertString (DCM_ROIDisplayColor, tmp.c_str());
	for (size_t j = 0; j < curr_structure->num_contours; j++) {
	    Rtss_contour *curr_contour = curr_structure->pslist[j];
	    if (curr_contour->num_vertices <= 0) continue;

#if defined (commentout)
            /* GCS 2013-07-02:  DICOM standard allows contours without 
               an associated slice UID.  Maybe this bug is now 
               fixed in XiO??? */
	    /* GE -> XiO transfer does not work if contour does not have 
	       corresponding slice uid */
	    if (curr_contour->ct_slice_uid.empty()) {
		printf ("Warning: Omitting contour (%ld,%ld)\n", 
                    (long) i, (long) j);
		continue;
	    }
#endif

            /* Add item to ContourSequence */
            DcmItem *c_item = 0;
            roic_item->findOrCreateSequenceItem (
                DCM_ContourSequence, c_item, -2);

	    /* ContourImageSequence */
	    if (curr_contour->ct_slice_uid != "") {
                DcmItem *ci_item = 0;
                c_item->findOrCreateSequenceItem (
                    DCM_ContourImageSequence, ci_item, -2);
                ci_item->putAndInsertString (DCM_ReferencedSOPClassUID,
                    UID_CTImageStorage);
                ci_item->putAndInsertString (DCM_ReferencedSOPInstanceUID,
                    curr_contour->ct_slice_uid.c_str());
            }

            /* ContourGeometricType */
            c_item->putAndInsertString (DCM_ContourGeometricType, 
                "CLOSED_PLANAR");

            /* NumberOfContourPoints */
            tmp = string_format ("%d", curr_contour->num_vertices);
            c_item->putAndInsertString (DCM_NumberOfContourPoints, tmp.c_str());

	    /* ContourData */
            tmp = string_format ("%.8g\\%.8g\\%.8g", 
                curr_contour->x[0],
                curr_contour->y[0],
                curr_contour->z[0]);
	    for (size_t k = 1; k < curr_contour->num_vertices; k++) {
                std::string tmp2 = string_format ("\\%.8g\\%.8g\\%.8g",
		    curr_contour->x[k],
		    curr_contour->y[k],
		    curr_contour->z[k]);
                tmp += tmp2;
	    }
            c_item->putAndInsertString (DCM_ContourData, tmp.c_str());
        }

        tmp = string_format ("%d", (int) curr_structure->id);
        roic_item->putAndInsertString (DCM_ReferencedROINumber, tmp.c_str());
    }

    /* ----------------------------------------------------------------- */
    /*     Part 5  -- More structure info                                */
    /* ----------------------------------------------------------------- */
    for (size_t i = 0; i < rtss->num_structures; i++) {
		Rtss_roi *curr_structure = rtss->slist[i];
			std::string tmp;

			/* RTROIObservationsSequence */
			DcmItem *rtroio_item = 0;
			dataset->findOrCreateSequenceItem (
				DCM_RTROIObservationsSequence, rtroio_item, -2);

		/* ObservationNumber */
			tmp = string_format ("%d", (int) curr_structure->id);
		rtroio_item->putAndInsertString (DCM_ObservationNumber, tmp.c_str());
		/* ReferencedROINumber */
		rtroio_item->putAndInsertString (DCM_ReferencedROINumber, tmp.c_str());
        if (metadata.roiMetadata.size() > i) {
            rtroio_item->putAndInsertString (DCM_RTROIInterpretedType,
                metadata.roiMetadata[i].rtRoiInterpretedType.c_str());
        }
        else {
            rtroio_item->putAndInsertString (DCM_RTROIInterpretedType, "");
        }
		/* ROIInterpreter */
		rtroio_item->putAndInsertString (DCM_ROIInterpreter, "");
		///* ROIPhysicalProperty */
        if(rtss->slist[i]->rsp_value > -1.0)
        {
			DcmItem *rsp_item = NULL;
			if (rtroio_item->findOrCreateSequenceItem(
                DCM_ROIPhysicalPropertiesSequence, rsp_item, -2).good())
                {
					rsp_item->putAndInsertString(DCM_ROIPhysicalProperty, "REL_STOP_RATIO");
					rsp_item->putAndInsertString(DCM_ROIPhysicalPropertyValue, std::to_string(rtss->slist[i]->rsp_value).c_str());
				}
		}
    }

    /* ----------------------------------------------------------------- */
    /*     Write the output file                                         */
    /* ----------------------------------------------------------------- */
    make_parent_directories (fname);

    ofc = fileformat.saveFile (fname, EXS_LittleEndianExplicit);
    if (ofc.bad()) {
        print_and_exit ("Error: cannot write DICOM RTSTRUCT (%s)\n",
            ofc.text());
    }
}
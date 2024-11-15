/* -----------------------------------------------------------------------
   See COPYRIGHT.TXT and LICENSE.TXT for copyright and license information
   ----------------------------------------------------------------------- */
#ifndef _rt_study_h_
#define _rt_study_h_

#include "plmbase_config.h"
#include <vector>
#include "itk_image_type.h"
#include "plm_file_format.h"
#include "plm_image.h"
#include "plm_image_type.h"
#include "rt_study_metadata.h"
#include "rtplan.h"
#include "segmentation.h"

class Metadata;
class Plm_image;
class Rtplan;
class Rt_study_private;
class Volume;
class Xio_ct_transform;

/*! \brief 
 * The Rt_study class encapsulates the concept of a radiotherapy planning 
 * data set, including image, structure set, and dose.
 */
class PLMBASE_API Rt_study {
public:
    SMART_POINTER_SUPPORT (Rt_study);
public:
    Rt_study_private *d_ptr;

public:
    Rt_study ();
    ~Rt_study ();

    void load (const char* input_path, 
        Plm_file_format file_type = PLM_FILE_FMT_UNKNOWN);
    void load (const std::string& input_path,
        Plm_file_format file_type = PLM_FILE_FMT_UNKNOWN);
    void load_dicom_dir (const char *dicom_dir);
    void load_dicom (const char *dicom_dir); 
    void load_dicom_dose (const char *dicom_path);
    void load_dicom_rtss (const char *dicom_path);
    void load_dicom_rtplan(const char *dicom_path);
    void load_image (const char *fn);
    void load_image (const std::string& fn);
    void load_xio (const char *xio_dir);
    void load_rt_study_dir (const char *rt_study_dir);
    void load_rt_study_dir (const std::string& rt_study_dir);
    void load_ss_img (const char *ss_img, const char *ss_list);
    void load_dose_img (const char *dose_img);
    void load_dose_xio (const char *dose_xio);
    void load_dose_astroid (const char *dose_astroid);
    void load_dose_mc (const char *dose_mc);
    void load_rdd (const char *image_directory);
    void load_dcmtk (const char *dicom_dir); 
    void load_gdcm (const char *dicom_dir); 

    void load_cxt (const char *input_fn);
    void load_prefix (const char *input_fn);
    void load_prefix (const std::string& input_fn);

    /*! \brief Save as directory of nrrd files */
    void save (const std::string& output_dir);

    void save_dicom (const std::string& output_dir,
        bool filenames_with_uid = true);
    void save_dicom (const char *output_dir,
        bool filenames_with_uid = true);
    void save_dicom_dose (const char *output_dir);

    void save_image (const std::string& fname);
    void save_image (const char* fname);
    void save_image (const char* fname, Plm_image_type image_type);

    void save_dose (const std::string& fname);
    void save_dose (const char* fname);
    void save_dose (const char* fname, Plm_image_type image_type);

    void save_prefix (const std::string& output_prefix, 
        const std::string& extension = "mha");

    /*! \brief Get the Rt_study_metadata */
    const Rt_study_metadata::Pointer& get_rt_study_metadata () const;
    Rt_study_metadata::Pointer& get_rt_study_metadata ();
    /*! \brief Set metadata items into study_metadata portion of Rt_study_metadata */
    void set_study_metadata (const std::vector<std::string>& metadata);
    /*! \brief Get the study_metadata portion of Rt_study_metadata */
    Metadata::Pointer& get_study_metadata ();
    /*! \brief Set metadata items into image portion of Rt_study_metadata */
    void set_image_metadata (const std::vector<std::string>& metadata);
    /*! \brief Get the image portion of Rt_study_metadata */
    Metadata::Pointer& get_image_metadata ();
    /*! \brief Set metadata items into dose portion of Rt_study_metadata */
    void set_dose_metadata (const std::vector<std::string>& metadata);
    /*! \brief Get the dose portion of Rt_study_metadata */
    Metadata::Pointer& get_dose_metadata ();
    /*! \brief Set metadata items into rtstruct portion 
      of Rt_study_metadata */
    void set_rtstruct_metadata (const std::vector<std::string>& metadata);
    /*! \brief Get the rtstruct portion of Rt_study_metadata */
    Metadata::Pointer& get_rtstruct_metadata ();
    /*! \brief Create new StudyInstanceUID and FrameOfReferenceUID for the study */
    void generate_new_study_uids ();
    /*! \brief Force the CT series UID to a certain value when saving */
    void force_ct_series_uid (const std::string& series_uid);

    bool have_image ();
    void set_image (ShortImageType::Pointer& itk_image);
    void set_image (FloatImageType::Pointer& itk_image);
    void set_image (Plm_image* pli);
    void set_image (const Plm_image::Pointer& pli);
    Plm_image::Pointer& get_image ();

    bool have_dose ();
    void set_dose (Plm_image *pli);
    void set_dose (FloatImageType::Pointer itk_dose);
    void set_dose (Volume *vol);
    void set_dose (const Plm_image::Pointer& pli);
    Plm_image::Pointer get_dose ();

    bool have_segmentation ();
    Segmentation::Pointer get_segmentation ();
    void set_segmentation (Segmentation::Pointer seg);
    void add_structure (
        const UCharImageType::Pointer& itk_image, 
        const char *structure_name = 0,
        const char *structure_color = 0);

    bool have_plan ();
    Rtplan::Pointer& get_plan ();

    const std::string& get_xio_dose_filename () const;
    Xio_ct_transform* get_xio_ct_transform ();

    Volume::Pointer get_image_volume_short ();
    Volume::Pointer get_image_volume_float ();

    bool has_dose ();
    Volume::Pointer get_dose_volume_float ();

    void resample (float spacing[3]);

protected:
    void save_dcmtk (const char *dicom_dir, bool filenames_with_uid);
    void save_dcmtk_dose (const char *dicom_dir);
    void convert_ss_img_to_cxt ();
};

#endif

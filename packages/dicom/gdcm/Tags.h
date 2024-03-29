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
#ifndef TAGS_H
#define TAGS_H

#include <string>
#include <unordered_set>
#include "itkGDCMImageIO.h"

using TagKey = std::string;
using TagKeys = std::unordered_set<TagKey>;
using TagNames = std::unordered_map<TagKey, std::string>;
using TagMap = TagNames; // TagKey -> TagValue

// Tag names from https://docs.aws.amazon.com/healthimaging/latest/devguide/reference-dicom-support.html
const TagNames PATIENT_TAG_NAMES = {
    // Patient Module Elements
    {"0010|0010", "Patient's Name"},
    {"0010|0020", "Patient ID"},
    // Issuer of Patient ID Macro Elements
    {"0010|0021", "Issuer of Patient ID"},
    {"0010|0024", "Issuer of Patient ID Qualifiers Sequence"},
    {"0010|0022", "Type of Patient ID"},
    {"0010|0030", "Patient's Birth Date"},
    {"0010|0033", "Patient's Birth Date in Alternative Calendar"},
    {"0010|0034", "Patient's Death Date in Alternative Calendar"},
    {"0010|0035", "Patient's Alternative Calendar Attribute"},
    {"0010|0040", "Patient's Sex"},
    {"0010|1100", "Referenced Patient Photo Sequence"},
    {"0010|0200", "Quality Control Subject"},
    {"0008|1120", "Referenced Patient Sequence"},
    {"0010|0032", "Patient's Birth Time"},
    {"0010|1002", "Other Patient IDs Sequence"},
    {"0010|1001", "Other Patient Names"},
    {"0010|2160", "Ethnic Group"},
    {"0010|4000", "Patient Comments"},
    {"0010|2201", "Patient Species Description"},
    {"0010|2202", "Patient Species Code Sequence Attribute"},
    {"0010|2292", "Patient Breed Description"},
    {"0010|2293", "Patient Breed Code Sequence"},
    {"0010|2294", "Breed Registration Sequence Attribute"},
    {"0010|0212", "Strain Description"},
    {"0010|0213", "Strain Nomenclature Attribute"},
    {"0010|0219", "Strain Code Sequence"},
    {"0010|0218", "Strain Additional Information Attribute"},
    {"0010|0216", "Strain Stock Sequence"},
    {"0010|0221", "Genetic Modifications Sequence Attribute"},
    {"0010|2297", "Responsible Person"},
    {"0010|2298", "Responsible Person Role Attribute"},
    {"0010|2299", "Responsible Organization"},
    {"0012|0062", "Patient Identity Removed"},
    {"0012|0063", "De-identification Method"},
    {"0012|0064", "De-identification Method Code Sequence"},
    // Patient Group Macro Elements
    {"0010|0026", "Source Patient Group Identification Sequence"},
    {"0010|0027", "Group of Patients Identification Sequence"},
    // Clinical Trial Subject Module
    {"0012|0010", "Clinical Trial Sponsor Name"},
    {"0012|0020", "Clinical Trial Protocol ID"},
    {"0012|0021", "Clinical Trial Protocol Name Attribute"},
    {"0012|0030", "Clinical Trial Site ID"},
    {"0012|0031", "Clinical Trial Site Name"},
    {"0012|0040", "Clinical Trial Subject ID"},
    {"0012|0042", "Clinical Trial Subject Reading ID"},
    {"0012|0081", "Clinical Trial Protocol Ethics Committee Name"},
    {"0012|0082", "Clinical Trial Protocol Ethics Committee Approval Number"},
};

const TagNames STUDY_TAG_NAMES = {
    // General Study Module
    {"0020|000d", "Study Instance UID"},
    {"0008|0020", "Study Date"},
    {"0008|0030", "Study Time"},
    {"0008|0090", "Referring Physician's Name"},
    {"0008|0096", "Referring Physician Identification Sequence"},
    {"0008|009c", "Consulting Physician's Name"},
    {"0008|009d", "Consulting Physician Identification Sequence"},
    {"0020|0010", "Study ID"},
    {"0008|0050", "Accession Number"},
    {"0008|0051", "Issuer of Accession Number Sequence"},
    {"0008|1030", "Study Description"},
    {"0008|1048", "Physician(s) of Record"},
    {"0008|1049", "Physician(s) of Record Identification Sequence"},
    {"0008|1060", "Name of Physician(s) Reading Study"},
    {"0008|1062", "Physician(s) Reading Study Identification Sequence"},
    {"0032|1033", "Requesting Service"},
    {"0032|1034", "Requesting Service Code Sequence"},
    {"0008|1110", "Referenced Study Sequence"},
    {"0008|1032", "Procedure Code Sequence"},
    {"0040|1012", "Reason For Performed Procedure Code Sequence"},
    // Patient Study Module
    {"0008|1080", "Admitting Diagnoses Description"},
    {"0008|1084", "Admitting Diagnoses Code Sequence"},
    {"0010|1010", "Patient's Age"},
    {"0010|1020", "Patient's Size"},
    {"0010|1030", "Patient's Weight"},
    {"0010|1022", "Patient's Body Mass Index"},
    {"0010|1023", "Measured AP Dimension"},
    {"0010|1024", "Measured Lateral Dimension"},
    {"0010|1021", "Patient's Size Code Sequence"},
    {"0010|2000", "Medical Alerts"},
    {"0010|2110", "Allergies"},
    {"0010|21a0", "Smoking Status"},
    {"0010|21c0", "Pregnancy Status"},
    {"0010|21d0", "Last Menstrual Date"},
    {"0038|0500", "Patient State"},
    {"0010|2180", "Occupation"},
    {"0010|21b0", "Additional Patient History"},
    {"0038|0010", "Admission ID"},
    {"0038|0014", "Issuer of Admission ID Sequence"},
    {"0032|1066", "Reason for Visit"},
    {"0032|1067", "Reason for Visit Code Sequence"},
    {"0038|0060", "Service Episode ID"},
    {"0038|0064", "Issuer of Service Episode ID Sequence"},
    {"0038|0062", "Service Episode Description"},
    {"0010|2203", "Patient's Sex Neutered"},
    // Clinical Trial Study Module
    {"0012|0050", "Clinical Trial Time Point ID"},
    {"0012|0051", "Clinical Trial Time Point Description"},
    {"0012|0052", "Longitudinal Temporal Offset from Event"},
    {"0012|0053", "Longitudinal Temporal Event Type"},
    {"0012|0083", "Consent for Clinical Trial Use Sequence"},
};

const TagNames SERIES_TAG_NAMES = {
    // General Series Module
    {"0008|0060", "Modality"},
    {"0020|000e", "Series Instance UID"},
    {"0020|0011", "Series Number"},
    {"0020|0060", "Laterality"},
    {"0008|0021", "Series Date"},
    {"0008|0031", "Series Time"},
    {"0008|1050", "Performing Physician's Name"},
    {"0008|1052", "Performing Physician Identification Sequence"},
    {"0018|1030", "Protocol Name"},
    {"0008|103e", "Series Description"},
    {"0008|103f", "Series Description Code Sequence"},
    {"0008|1070", "Operators' Name"},
    {"0008|1072", "Operator Identification Sequence"},
    {"0008|1111", "Referenced Performed Procedure Step Sequence"},
    {"0008|1250", "Related Series Sequence"},
    {"0018|0015", "Body Part Examined"},
    {"0018|5100", "Patient Position"},
    {"0028|0108", "Smallest Pixel Value in Series"},
    {"0028|0109", "Largest Pixel Value in Series"},
    {"0040|0275", "Request Attributes Sequence"},
    {"0010|2210", "Anatomical Orientation Type"},
    {"300a|0700", "Treatment Session UID"},
    // Clinical Trial Series Module
    {"0012|0060", "Clinical Trial Coordinating Center Name"},
    {"0012|0071", "Clinical Trial Series ID"},
    {"0012|0072", "Clinical Trial Series Description"},
    // General Equipment Module
    {"0008|0070", "Manufacturer"},
    {"0008|0080", "Institution Name"},
    {"0008|0081", "Institution Address"},
    {"0008|1010", "Station Name"},
    {"0008|1040", "Institutional Department Name"},
    {"0008|1041", "Institutional Department Type Code Sequence"},
    {"0008|1090", "Manufacturer's Model Name"},
    {"0018|100b", "Manufacturer's Device Class UID"},
    {"0018|1000", "Device Serial Number"},
    {"0018|1020", "Software Versions"},
    {"0018|1008", "Gantry ID"},
    {"0018|100a", "UDI Sequence"},
    {"0018|1002", "Device UID"},
    {"0018|1050", "Spatial Resolution"},
    {"0018|1200", "Date of Last Calibration"},
    {"0018|1201", "Time of Last Calibration"},
    {"0028|0120", "Pixel Padding Value"},
    // Frame of Reference Module
    {"0020|0052", "Frame of Reference UID"},
    {"0020|1040", "Position Reference Indicator"},
};

TagMap extractAndRename(const TagMap &tags, const TagNames &keeperTags)
{
    TagMap extracted;
    for (const auto &[key, name] : keeperTags)
    {
        const auto it = tags.find(key);
        if (it != tags.end())
        {
            extracted[name] = it->second;
        }
    }
    return extracted;
}

TagMap remove(const TagMap &tags, const TagNames &removeTags)
{
    TagMap filteredTags = tags;
    for (const auto &[key, name] : removeTags)
    {
        filteredTags.erase(key);
    }
    return filteredTags;
}

TagMap relabel(const TagMap &tags)
{
    TagMap relabelTags;
    for (const auto &[key, value] : tags)
    {
        std::string name = key;
        if (itk::GDCMImageIO::GetLabelFromTag(key, name))
        {
            relabelTags[name] = value;
        }
        else
        {
            relabelTags[key] = value;
        }
    }
    return relabelTags;
}

#endif // TAGS_H
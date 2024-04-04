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
#include <set>
#include "itkGDCMImageIO.h"

using Tag = gdcm::Tag;
using Tags = std::set<Tag>;

const Tag STUDY_UID(0x0020, 0x000d);    // "Study Instance UID"
const Tag SERIES_UID(0x0020, 0x000e);   // "Series Instance UID"
const Tag INSTANCE_UID(0x0008, 0x0018); // "Instance UID"

const Tag FRAME_OF_REFERENCE_UID(0x0020, 0x0052);
const Tag IMAGE_ORIENTATION_PATIENT(0x0020, 0x0037);

const Tag SPECIFIC_CHARACTER_SET(0x0008, 0x0005);
const Tag PIXEL_DATA_TAG(0x7fe0, 0x0010);

const Tags EMPTY_TAGS = {};

// Tag names from https://docs.aws.amazon.com/healthimaging/latest/devguide/reference-dicom-support.html
const Tags PATIENT_TAGS = {
    // Patient Module Elements
    Tag(0x0010, 0x0010), // "Patient's Name"
    Tag(0x0010, 0x0020), // "Patient ID"
    // Issuer of Patient ID Macro Elements
    Tag(0x0010, 0x0021), // "Issuer of Patient ID"
    Tag(0x0010, 0x0024), // "Issuer of Patient ID Qualifiers Sequence"
    Tag(0x0010, 0x0022), // "Type of Patient ID"
    Tag(0x0010, 0x0030), // "Patient's Birth Date"
    Tag(0x0010, 0x0033), // "Patient's Birth Date in Alternative Calendar"
    Tag(0x0010, 0x0034), // "Patient's Death Date in Alternative Calendar"
    Tag(0x0010, 0x0035), // "Patient's Alternative Calendar Attribute"
    Tag(0x0010, 0x0040), // "Patient's Sex"
    Tag(0x0010, 0x1100), // "Referenced Patient Photo Sequence"
    Tag(0x0010, 0x0200), // "Quality Control Subject"
    Tag(0x0008, 0x1120), // "Referenced Patient Sequence"
    Tag(0x0010, 0x0032), // "Patient's Birth Time"
    Tag(0x0010, 0x1002), // "Other Patient IDs Sequence"
    Tag(0x0010, 0x1001), // "Other Patient Names"
    Tag(0x0010, 0x2160), // "Ethnic Group"
    Tag(0x0010, 0x4000), // "Patient Comments"
    Tag(0x0010, 0x2201), // "Patient Species Description"
    Tag(0x0010, 0x2202), // "Patient Species Code Sequence Attribute"
    Tag(0x0010, 0x2292), // "Patient Breed Description"
    Tag(0x0010, 0x2293), // "Patient Breed Code Sequence"
    Tag(0x0010, 0x2294), // "Breed Registration Sequence Attribute"
    Tag(0x0010, 0x0212), // "Strain Description"
    Tag(0x0010, 0x0213), // "Strain Nomenclature Attribute"
    Tag(0x0010, 0x0219), // "Strain Code Sequence"
    Tag(0x0010, 0x0218), // "Strain Additional Information Attribute"
    Tag(0x0010, 0x0216), // "Strain Stock Sequence"
    Tag(0x0010, 0x0221), // "Genetic Modifications Sequence Attribute"
    Tag(0x0010, 0x2297), // "Responsible Person"
    Tag(0x0010, 0x2298), // "Responsible Person Role Attribute"
    Tag(0x0010, 0x2299), // "Responsible Organization"
    Tag(0x0012, 0x0062), // "Patient Identity Removed"
    Tag(0x0012, 0x0063), // "De-identification Method"
    Tag(0x0012, 0x0064), // "De-identification Method Code Sequence"
    // Patient Group Macro Elements
    Tag(0x0010, 0x0026), // "Source Patient Group Identification Sequence"
    Tag(0x0010, 0x0027), // "Group of Patients Identification Sequence"
    // Clinical Trial Subject Module
    Tag(0x0012, 0x0010), // "Clinical Trial Sponsor Name"
    Tag(0x0012, 0x0020), // "Clinical Trial Protocol ID"
    Tag(0x0012, 0x0021), // "Clinical Trial Protocol Name Attribute"
    Tag(0x0012, 0x0030), // "Clinical Trial Site ID"
    Tag(0x0012, 0x0031), // "Clinical Trial Site Name"
    Tag(0x0012, 0x0040), // "Clinical Trial Subject ID"
    Tag(0x0012, 0x0042), // "Clinical Trial Subject Reading ID"
    Tag(0x0012, 0x0081), // "Clinical Trial Protocol Ethics Committee Name"
    Tag(0x0012, 0x0082)  // "Clinical Trial Protocol Ethics Committee Approval Number"
};

const Tags STUDY_TAGS = {
    // General Study Module
    Tag(0x0020, 0x000d), // "Study Instance UID"
    Tag(0x0008, 0x0020), // "Study Date"
    Tag(0x0008, 0x0030), // "Study Time"
    Tag(0x0008, 0x0090), // "Referring Physician's Name"
    Tag(0x0008, 0x0096), // "Referring Physician Identification Sequence"
    Tag(0x0008, 0x009c), // "Consulting Physician's Name"
    Tag(0x0008, 0x009d), // "Consulting Physician Identification Sequence"
    Tag(0x0020, 0x0010), // "Study ID"
    Tag(0x0008, 0x0050), // "Accession Number"
    Tag(0x0008, 0x0051), // "Issuer of Accession Number Sequence"
    Tag(0x0008, 0x1030), // "Study Description"
    Tag(0x0008, 0x1048), // "Physician(s) of Record"
    Tag(0x0008, 0x1049), // "Physician(s) of Record Identification Sequence"
    Tag(0x0008, 0x1060), // "Name of Physician(s) Reading Study"
    Tag(0x0008, 0x1062), // "Physician(s) Reading Study Identification Sequence"
    Tag(0x0032, 0x1033), // "Requesting Service"
    Tag(0x0032, 0x1034), // "Requesting Service Code Sequence"
    Tag(0x0008, 0x1110), // "Referenced Study Sequence"
    Tag(0x0008, 0x1032), // "Procedure Code Sequence"
    Tag(0x0040, 0x1012), // "Reason For Performed Procedure Code Sequence"
    // Patient Study Module
    Tag(0x0008, 0x1080), // "Admitting Diagnoses Description"
    Tag(0x0008, 0x1084), // "Admitting Diagnoses Code Sequence"
    Tag(0x0010, 0x1010), // "Patient's Age"
    Tag(0x0010, 0x1020), // "Patient's Size"
    Tag(0x0010, 0x1030), // "Patient's Weight"
    Tag(0x0010, 0x1022), // "Patient's Body Mass Index"
    Tag(0x0010, 0x1023), // "Measured AP Dimension"
    Tag(0x0010, 0x1024), // "Measured Lateral Dimension"
    Tag(0x0010, 0x1021), // "Patient's Size Code Sequence"
    Tag(0x0010, 0x2000), // "Medical Alerts"
    Tag(0x0010, 0x2110), // "Allergies"
    Tag(0x0010, 0x21a0), // "Smoking Status"
    Tag(0x0010, 0x21c0), // "Pregnancy Status"
    Tag(0x0010, 0x21d0), // "Last Menstrual Date"
    Tag(0x0038, 0x0500), // "Patient State"
    Tag(0x0010, 0x2180), // "Occupation"
    Tag(0x0010, 0x21b0), // "Additional Patient History"
    Tag(0x0038, 0x0010), // "Admission ID"
    Tag(0x0038, 0x0014), // "Issuer of Admission ID Sequence"
    Tag(0x0032, 0x1066), // "Reason for Visit"
    Tag(0x0032, 0x1067), // "Reason for Visit Code Sequence"
    Tag(0x0038, 0x0060), // "Service Episode ID"
    Tag(0x0038, 0x0064), // "Issuer of Service Episode ID Sequence"
    Tag(0x0038, 0x0062), // "Service Episode Description"
    Tag(0x0010, 0x2203), // "Patient's Sex Neutered"
    // Clinical Trial Study Module
    Tag(0x0012, 0x0050), // "Clinical Trial Time Point ID"
    Tag(0x0012, 0x0051), // "Clinical Trial Time Point Description"
    Tag(0x0012, 0x0052), // "Longitudinal Temporal Offset from Event"
    Tag(0x0012, 0x0053), // "Longitudinal Temporal Event Type"
    Tag(0x0012, 0x0083)  // "Consent for Clinical Trial Use Sequence"
};

const Tags SERIES_TAGS = {
    // General Series Module
    Tag(0x0008, 0x0060), // "Modality"
    Tag(0x0020, 0x000e), // "Series Instance UID"
    Tag(0x0020, 0x0011), // "Series Number"
    Tag(0x0020, 0x0060), // "Laterality"
    Tag(0x0008, 0x0021), // "Series Date"
    Tag(0x0008, 0x0031), // "Series Time"
    Tag(0x0008, 0x1050), // "Performing Physician's Name"
    Tag(0x0008, 0x1052), // "Performing Physician Identification Sequence"
    Tag(0x0018, 0x1030), // "Protocol Name"
    Tag(0x0008, 0x103e), // "Series Description"
    Tag(0x0008, 0x103f), // "Series Description Code Sequence"
    Tag(0x0008, 0x1070), // "Operators' Name"
    Tag(0x0008, 0x1072), // "Operator Identification Sequence"
    Tag(0x0008, 0x1111), // "Referenced Performed Procedure Step Sequence"
    Tag(0x0008, 0x1250), // "Related Series Sequence"
    Tag(0x0018, 0x0015), // "Body Part Examined"
    Tag(0x0018, 0x5100), // "Patient Position"
    Tag(0x0028, 0x0108), // "Smallest Pixel Value in Series"
    Tag(0x0028, 0x0109), // "Largest Pixel Value in Series"
    Tag(0x0040, 0x0275), // "Request Attributes Sequence"
    Tag(0x0010, 0x2210), // "Anatomical Orientation Type"
    Tag(0x300a, 0x0700), // "Treatment Session UID"
    // Clinical Trial Series Module
    Tag(0x0012, 0x0060), // "Clinical Trial Coordinating Center Name"
    Tag(0x0012, 0x0071), // "Clinical Trial Series ID"
    Tag(0x0012, 0x0072), // "Clinical Trial Series Description"
    // General Equipment Module
    Tag(0x0008, 0x0070), // "Manufacturer"
    Tag(0x0008, 0x0080), // "Institution Name"
    Tag(0x0008, 0x0081), // "Institution Address"
    Tag(0x0008, 0x1010), // "Station Name"
    Tag(0x0008, 0x1040), // "Institutional Department Name"
    Tag(0x0008, 0x1041), // "Institutional Department Type Code Sequence"
    Tag(0x0008, 0x1090), // "Manufacturer's Model Name"
    Tag(0x0018, 0x100b), // "Manufacturer's Device Class UID"
    Tag(0x0018, 0x1000), // "Device Serial Number"
    Tag(0x0018, 0x1020), // "Software Versions"
    Tag(0x0018, 0x1008), // "Gantry ID"
    Tag(0x0018, 0x100a), // "UDI Sequence"
    Tag(0x0018, 0x1002), // "Device UID"
    Tag(0x0018, 0x1050), // "Spatial Resolution"
    Tag(0x0018, 0x1200), // "Date of Last Calibration"
    Tag(0x0018, 0x1201), // "Time of Last Calibration"
    Tag(0x0028, 0x0120), // "Pixel Padding Value"
    // Frame of Reference Module
    Tag(0x0020, 0x0052), // "Frame of Reference UID"
    Tag(0x0020, 0x1040), // "Position Reference Indicator"
};

const Tags NON_INSTANCE = {
    // Patient Module Elements
    Tag(0x0010, 0x0010), // "Patient's Name"
    Tag(0x0010, 0x0020), // "Patient ID"
    // Issuer of Patient ID Macro Elements
    Tag(0x0010, 0x0021), // "Issuer of Patient ID"
    Tag(0x0010, 0x0024), // "Issuer of Patient ID Qualifiers Sequence"
    Tag(0x0010, 0x0022), // "Type of Patient ID"
    Tag(0x0010, 0x0030), // "Patient's Birth Date"
    Tag(0x0010, 0x0033), // "Patient's Birth Date in Alternative Calendar"
    Tag(0x0010, 0x0034), // "Patient's Death Date in Alternative Calendar"
    Tag(0x0010, 0x0035), // "Patient's Alternative Calendar Attribute"
    Tag(0x0010, 0x0040), // "Patient's Sex"
    Tag(0x0010, 0x1100), // "Referenced Patient Photo Sequence"
    Tag(0x0010, 0x0200), // "Quality Control Subject"
    Tag(0x0008, 0x1120), // "Referenced Patient Sequence"
    Tag(0x0010, 0x0032), // "Patient's Birth Time"
    Tag(0x0010, 0x1002), // "Other Patient IDs Sequence"
    Tag(0x0010, 0x1001), // "Other Patient Names"
    Tag(0x0010, 0x2160), // "Ethnic Group"
    Tag(0x0010, 0x4000), // "Patient Comments"
    Tag(0x0010, 0x2201), // "Patient Species Description"
    Tag(0x0010, 0x2202), // "Patient Species Code Sequence Attribute"
    Tag(0x0010, 0x2292), // "Patient Breed Description"
    Tag(0x0010, 0x2293), // "Patient Breed Code Sequence"
    Tag(0x0010, 0x2294), // "Breed Registration Sequence Attribute"
    Tag(0x0010, 0x0212), // "Strain Description"
    Tag(0x0010, 0x0213), // "Strain Nomenclature Attribute"
    Tag(0x0010, 0x0219), // "Strain Code Sequence"
    Tag(0x0010, 0x0218), // "Strain Additional Information Attribute"
    Tag(0x0010, 0x0216), // "Strain Stock Sequence"
    Tag(0x0010, 0x0221), // "Genetic Modifications Sequence Attribute"
    Tag(0x0010, 0x2297), // "Responsible Person"
    Tag(0x0010, 0x2298), // "Responsible Person Role Attribute"
    Tag(0x0010, 0x2299), // "Responsible Organization"
    Tag(0x0012, 0x0062), // "Patient Identity Removed"
    Tag(0x0012, 0x0063), // "De-identification Method"
    Tag(0x0012, 0x0064), // "De-identification Method Code Sequence"
    // Patient Group Macro Elements
    Tag(0x0010, 0x0026), // "Source Patient Group Identification Sequence"
    Tag(0x0010, 0x0027), // "Group of Patients Identification Sequence"
    // Clinical Trial Subject Module
    Tag(0x0012, 0x0010), // "Clinical Trial Sponsor Name"
    Tag(0x0012, 0x0020), // "Clinical Trial Protocol ID"
    Tag(0x0012, 0x0021), // "Clinical Trial Protocol Name Attribute"
    Tag(0x0012, 0x0030), // "Clinical Trial Site ID"
    Tag(0x0012, 0x0031), // "Clinical Trial Site Name"
    Tag(0x0012, 0x0040), // "Clinical Trial Subject ID"
    Tag(0x0012, 0x0042), // "Clinical Trial Subject Reading ID"
    Tag(0x0012, 0x0081), // "Clinical Trial Protocol Ethics Committee Name"
    Tag(0x0012, 0x0082),  // "Clinical Trial Protocol Ethics Committee Approval Number"
    // General Study Module
    Tag(0x0020, 0x000d), // "Study Instance UID"
    Tag(0x0008, 0x0020), // "Study Date"
    Tag(0x0008, 0x0030), // "Study Time"
    Tag(0x0008, 0x0090), // "Referring Physician's Name"
    Tag(0x0008, 0x0096), // "Referring Physician Identification Sequence"
    Tag(0x0008, 0x009c), // "Consulting Physician's Name"
    Tag(0x0008, 0x009d), // "Consulting Physician Identification Sequence"
    Tag(0x0020, 0x0010), // "Study ID"
    Tag(0x0008, 0x0050), // "Accession Number"
    Tag(0x0008, 0x0051), // "Issuer of Accession Number Sequence"
    Tag(0x0008, 0x1030), // "Study Description"
    Tag(0x0008, 0x1048), // "Physician(s) of Record"
    Tag(0x0008, 0x1049), // "Physician(s) of Record Identification Sequence"
    Tag(0x0008, 0x1060), // "Name of Physician(s) Reading Study"
    Tag(0x0008, 0x1062), // "Physician(s) Reading Study Identification Sequence"
    Tag(0x0032, 0x1033), // "Requesting Service"
    Tag(0x0032, 0x1034), // "Requesting Service Code Sequence"
    Tag(0x0008, 0x1110), // "Referenced Study Sequence"
    Tag(0x0008, 0x1032), // "Procedure Code Sequence"
    Tag(0x0040, 0x1012), // "Reason For Performed Procedure Code Sequence"
    // Patient Study Module
    Tag(0x0008, 0x1080), // "Admitting Diagnoses Description"
    Tag(0x0008, 0x1084), // "Admitting Diagnoses Code Sequence"
    Tag(0x0010, 0x1010), // "Patient's Age"
    Tag(0x0010, 0x1020), // "Patient's Size"
    Tag(0x0010, 0x1030), // "Patient's Weight"
    Tag(0x0010, 0x1022), // "Patient's Body Mass Index"
    Tag(0x0010, 0x1023), // "Measured AP Dimension"
    Tag(0x0010, 0x1024), // "Measured Lateral Dimension"
    Tag(0x0010, 0x1021), // "Patient's Size Code Sequence"
    Tag(0x0010, 0x2000), // "Medical Alerts"
    Tag(0x0010, 0x2110), // "Allergies"
    Tag(0x0010, 0x21a0), // "Smoking Status"
    Tag(0x0010, 0x21c0), // "Pregnancy Status"
    Tag(0x0010, 0x21d0), // "Last Menstrual Date"
    Tag(0x0038, 0x0500), // "Patient State"
    Tag(0x0010, 0x2180), // "Occupation"
    Tag(0x0010, 0x21b0), // "Additional Patient History"
    Tag(0x0038, 0x0010), // "Admission ID"
    Tag(0x0038, 0x0014), // "Issuer of Admission ID Sequence"
    Tag(0x0032, 0x1066), // "Reason for Visit"
    Tag(0x0032, 0x1067), // "Reason for Visit Code Sequence"
    Tag(0x0038, 0x0060), // "Service Episode ID"
    Tag(0x0038, 0x0064), // "Issuer of Service Episode ID Sequence"
    Tag(0x0038, 0x0062), // "Service Episode Description"
    Tag(0x0010, 0x2203), // "Patient's Sex Neutered"
    // Clinical Trial Study Module
    Tag(0x0012, 0x0050), // "Clinical Trial Time Point ID"
    Tag(0x0012, 0x0051), // "Clinical Trial Time Point Description"
    Tag(0x0012, 0x0052), // "Longitudinal Temporal Offset from Event"
    Tag(0x0012, 0x0053), // "Longitudinal Temporal Event Type"
    Tag(0x0012, 0x0083),  // "Consent for Clinical Trial Use Sequence"

    // General Series Module
    Tag(0x0008, 0x0060), // "Modality"
    Tag(0x0020, 0x000e), // "Series Instance UID"
    Tag(0x0020, 0x0011), // "Series Number"
    Tag(0x0020, 0x0060), // "Laterality"
    Tag(0x0008, 0x0021), // "Series Date"
    Tag(0x0008, 0x0031), // "Series Time"
    Tag(0x0008, 0x1050), // "Performing Physician's Name"
    Tag(0x0008, 0x1052), // "Performing Physician Identification Sequence"
    Tag(0x0018, 0x1030), // "Protocol Name"
    Tag(0x0008, 0x103e), // "Series Description"
    Tag(0x0008, 0x103f), // "Series Description Code Sequence"
    Tag(0x0008, 0x1070), // "Operators' Name"
    Tag(0x0008, 0x1072), // "Operator Identification Sequence"
    Tag(0x0008, 0x1111), // "Referenced Performed Procedure Step Sequence"
    Tag(0x0008, 0x1250), // "Related Series Sequence"
    Tag(0x0018, 0x0015), // "Body Part Examined"
    Tag(0x0018, 0x5100), // "Patient Position"
    Tag(0x0028, 0x0108), // "Smallest Pixel Value in Series"
    Tag(0x0028, 0x0109), // "Largest Pixel Value in Series"
    Tag(0x0040, 0x0275), // "Request Attributes Sequence"
    Tag(0x0010, 0x2210), // "Anatomical Orientation Type"
    Tag(0x300a, 0x0700), // "Treatment Session UID"
    // Clinical Trial Series Module
    Tag(0x0012, 0x0060), // "Clinical Trial Coordinating Center Name"
    Tag(0x0012, 0x0071), // "Clinical Trial Series ID"
    Tag(0x0012, 0x0072), // "Clinical Trial Series Description"
    // General Equipment Module
    Tag(0x0008, 0x0070), // "Manufacturer"
    Tag(0x0008, 0x0080), // "Institution Name"
    Tag(0x0008, 0x0081), // "Institution Address"
    Tag(0x0008, 0x1010), // "Station Name"
    Tag(0x0008, 0x1040), // "Institutional Department Name"
    Tag(0x0008, 0x1041), // "Institutional Department Type Code Sequence"
    Tag(0x0008, 0x1090), // "Manufacturer's Model Name"
    Tag(0x0018, 0x100b), // "Manufacturer's Device Class UID"
    Tag(0x0018, 0x1000), // "Device Serial Number"
    Tag(0x0018, 0x1020), // "Software Versions"
    Tag(0x0018, 0x1008), // "Gantry ID"
    Tag(0x0018, 0x100a), // "UDI Sequence"
    Tag(0x0018, 0x1002), // "Device UID"
    Tag(0x0018, 0x1050), // "Spatial Resolution"
    Tag(0x0018, 0x1200), // "Date of Last Calibration"
    Tag(0x0018, 0x1201), // "Time of Last Calibration"
    Tag(0x0028, 0x0120), // "Pixel Padding Value"
    // Frame of Reference Module
    Tag(0x0020, 0x0052), // "Frame of Reference UID"
    Tag(0x0020, 0x1040), // "Position Reference Indicator"
};

std::pair<const char *, size_t>
getTagBuffer(const gdcm::DataSet &ds, const gdcm::Tag &tag)
{
  if (!ds.FindDataElement(tag) || ds.GetDataElement(tag).IsEmpty())
  {
    return std::make_pair(nullptr, 0);
  }
  const gdcm::DataElement de = ds.GetDataElement(tag);
  const gdcm::ByteValue *bv = de.GetByteValue();
  const char *tagValue = bv->GetPointer();
  size_t len = bv->GetLength();
  return std::make_pair(tagValue, len);
}

#endif // TAGS_H
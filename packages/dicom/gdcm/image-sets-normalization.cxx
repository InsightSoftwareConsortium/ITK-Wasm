/*=========================================================================

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
#include "itkPipeline.h"
#include "itkOutputTextStream.h"

#include "rapidjson/document.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"

#include "gdcmDiscriminateVolume.h"
#include "DICOMTagReader.h"

const std::set<std::string> PATIENT_TAGS = {
    "0010|0010", // Patient's Name
    "0010|0020", // Patient ID
    "0010|0030", // Patient's Birth Date
    "0010|0040", // Patient's Sex
    "0010|1010", // Patient's Age
    "0010|1030", // Patient's Weight
    "0010|21b0", // Additional Patient's History
};

const std::set<std::string> STUDY_TAGS = {
    "0008|0020", // Study Date
    "0008|0030", // Study Time
    "0008|1030", // Study Description
    "0008|0050", // Accession Number
};

const std::set<std::string> SERIES_TAGS = {
    "0020|000e", // Series Instance UID
    "0008|103e", // Series Description
    "0008|0060", // Modality
};

const std::set<std::string> NON_INSTANCE_TAGS = {
    "0010|0010", // Patient's Name
    "0010|0020", // Patient ID
    "0010|0030", // Patient's Birth Date
    "0010|0040", // Patient's Sex
    "0010|1010", // Patient's Age
    "0010|1030", // Patient's Weight
    "0010|21b0", // Additional Patient's History
    "0008|0020", // Study Date
    "0008|0030", // Study Time
    "0008|1030", // Study Description
    "0008|0050", // Accession Number
    "0020|000e", // Series Instance UID
    "0008|103e", // Series Description
    "0008|0060", // Modality
};


rapidjson::Value mapToJsonObj(const itk::DICOMTagReader::TagMapType &tags,  rapidjson::Document::AllocatorType &allocator)
{
  rapidjson::Value json(rapidjson::kObjectType);
  for (const auto &[tag, value] : tags)
  {
    rapidjson::Value tagName;
    tagName.SetString(tag.c_str(), tag.size(), allocator);
    rapidjson::Value tagValue;
    tagValue.SetString(value.c_str(), value.size(), allocator);
    json.AddMember(tagName, tagValue, allocator);
  }
  return json;
}

itk::DICOMTagReader::TagMapType filterTags(const itk::DICOMTagReader::TagMapType &tags, const std::set<std::string> &keeperTagKeys)
{
  itk::DICOMTagReader::TagMapType filteredTags;
  for (const auto &tagName : keeperTagKeys)
  {
    const auto it = tags.find(tagName);
    if (it != tags.end())
    {
      filteredTags[tagName] = it->second;
    }
  }
  return filteredTags;
}

rapidjson::Value jsonFromTags(const itk::DICOMTagReader::TagMapType &tags, const std::set<std::string> &tagKeys, rapidjson::Document::AllocatorType &allocator)
{
  const itk::DICOMTagReader::TagMapType filteredTags = filterTags(tags, tagKeys);
  return mapToJsonObj(filteredTags, allocator);
}

int main(int argc, char *argv[])
{
  itk::wasm::Pipeline pipeline("image-sets-normalization", "Group DICOM files into image sets", argc, argv);

  std::vector<std::string> files;
  pipeline.add_option("--files", files, "DICOM files")->required()->check(CLI::ExistingFile)->type_size(1, -1)->type_name("INPUT_BINARY_FILE");

  itk::wasm::OutputTextStream imageSetsMetadata;
  pipeline.add_option("image-sets-metadata", imageSetsMetadata, "Image sets JSON")->required()->type_name("OUTPUT_JSON");

  ITK_WASM_PARSE(pipeline);

  std::vector<gdcm::Directory::FilenamesType> volumes;
  gdcm::Scanner s;

  const gdcm::Tag t1(0x0020, 0x000d); // Study Instance UID
  const gdcm::Tag t2(0x0020, 0x000e); // Series Instance UID
  const gdcm::Tag t3(0x0020, 0x0052); // Frame of Reference UID
  const gdcm::Tag t4(0x0020, 0x0037); // Image Orientation (Patient)

  s.AddTag(t1);
  s.AddTag(t2);
  s.AddTag(t3);
  s.AddTag(t4);

  bool b = s.Scan(files);
  if (!b)
  {
    std::cerr << "Scanner failed" << std::endl;
    return EXIT_FAILURE;
  }

  gdcm::DiscriminateVolume dv;
  dv.ProcessIntoVolume(s);

  std::vector<gdcm::Directory::FilenamesType> sorted = dv.GetSortedFiles();
  for (gdcm::Directory::FilenamesType &volume : sorted)
  {
    volumes.push_back(volume);
  }

  std::vector<gdcm::Directory::FilenamesType> unsorted = dv.GetUnsortedFiles();
  for (gdcm::Directory::FilenamesType fileGroups : unsorted)
  {
    volumes.push_back(fileGroups);
  }

  rapidjson::Document imageSetsJson(rapidjson::kArrayType);
  rapidjson::Document::AllocatorType &allocator = imageSetsJson.GetAllocator();

  itk::DICOMTagReader tagReader;

  // read all tags for file
  for (const auto &fileNames : volumes)
  {
    itk::DICOMTagReader::TagMapType dicomTags; // series/study/patent tags are pulled from last file
    rapidjson::Value instances(rapidjson::kObjectType);
    for (const auto &fileName : fileNames)
    {
      if (!tagReader.CanReadFile(fileName))
      {
        std::cerr << "Could not read the input DICOM file: " << fileName << std::endl;
        return EXIT_FAILURE;
      }
      tagReader.SetFileName(fileName);
      dicomTags = tagReader.ReadAllTags();

      // filter out patient, study, series tags
      itk::DICOMTagReader::TagMapType instanceTags;
      for (const auto &[tag, value] : dicomTags)
      {
        if (NON_INSTANCE_TAGS.find(tag) == NON_INSTANCE_TAGS.end())
        {
          instanceTags[tag] = value;
        }
      }
      rapidjson::Value instanceTagsJson =  mapToJsonObj(instanceTags, allocator);
      rapidjson::Value instance(rapidjson::kObjectType);
      instance.AddMember("DICOM", instanceTagsJson, allocator);
      rapidjson::Value fileNameValue;
      fileNameValue.SetString(fileName.c_str(), fileName.size(), allocator);
      instance.AddMember("fileName", fileNameValue, allocator);

      // instance by UID under instances
      itk::DICOMTagReader::TagMapType::iterator it = dicomTags.find("0008|0018");
      if (it == dicomTags.end())
      {
        std::cerr << "Instance UID not found in dicomTags" << std::endl;
        return EXIT_FAILURE;
      }
      const auto tag = it->second;
      rapidjson::Value instanceId;
      instanceId.SetString(tag.c_str(), tag.size(), allocator);
      instances.AddMember(instanceId, instance, allocator);
    }

    rapidjson::Value seriesTags = jsonFromTags(dicomTags, SERIES_TAGS, allocator);
    rapidjson::Value series(rapidjson::kObjectType);
    series.AddMember("DICOM", seriesTags, allocator);
    series.AddMember("Instances", instances, allocator);
    // series by ID under study
    itk::DICOMTagReader::TagMapType::iterator it = dicomTags.find("0020|000e");
    if (it == dicomTags.end())
    {
      std::cerr << "Series UID not found in dicomTags" << std::endl;
      return EXIT_FAILURE;
    }
    const auto tag = it->second;
    rapidjson::Value seriesId;
    seriesId.SetString(tag.c_str(), tag.size(), allocator);
    rapidjson::Value seriesById(rapidjson::kObjectType);
    seriesById.AddMember(seriesId, series, allocator);

    rapidjson::Value imageSet(rapidjson::kObjectType);

    rapidjson::Value patient(rapidjson::kObjectType);
    rapidjson::Value patientTags = jsonFromTags(dicomTags, PATIENT_TAGS, allocator);
    patient.AddMember("DICOM", patientTags, allocator);
    imageSet.AddMember("Patient", patient, allocator);

    rapidjson::Value study(rapidjson::kObjectType);
    rapidjson::Value studyTagsJson = jsonFromTags(dicomTags, STUDY_TAGS, allocator);
    study.AddMember("DICOM", studyTagsJson, allocator);
    study.AddMember("Series", seriesById, allocator);
    imageSet.AddMember("Study", study, allocator);

    imageSetsJson.PushBack(imageSet, allocator);
  }

  rapidjson::StringBuffer stringBuffer;
  rapidjson::Writer<rapidjson::StringBuffer> writer(stringBuffer);
  imageSetsJson.Accept(writer);
  imageSetsMetadata.Get() << stringBuffer.GetString();

  return EXIT_SUCCESS;
}

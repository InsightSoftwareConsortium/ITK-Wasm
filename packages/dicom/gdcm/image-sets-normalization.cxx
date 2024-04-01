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
/*=========================================================================

  Program: GDCM (Grassroots DICOM). A DICOM library

  Copyright (c) 2006-2011 Mathieu Malaterre
  All rights reserved.
  See Copyright.txt or http://gdcm.sourceforge.net/Copyright.html for details.

     This software is distributed WITHOUT ANY WARRANTY; without even
     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
     PURPOSE.  See the above copyright notice for more information.

=========================================================================*/
#include <unordered_set>

#include "rapidjson/document.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"

#include "gdcmGlobal.h"
#include "gdcmDicts.h"
#include "gdcmImageReader.h"

#include "itksys/SystemTools.hxx"
#include "itksys/Base64.h"
#include "itkMakeUniqueForOverwrite.h"

#include "itkPipeline.h"
#include "itkOutputTextStream.h"

#include "DICOMTagReader.h"
#include "Tags.h"
#include "SortSpatially.h"

std::string getLabelFromTag(const gdcm::Tag &tag, const gdcm::DataSet &dataSet)
{
  std::string strowner;
  const char *owner = 0;
  if (tag.IsPrivate() && !tag.IsPrivateCreator())
  {
    strowner = dataSet.GetPrivateCreator(tag);
    owner = strowner.c_str();
  }
  const gdcm::Global &g = gdcm::Global::GetInstance();
  const gdcm::Dicts &dicts = g.GetDicts();
  const gdcm::DictEntry &entry = dicts.GetDictEntry(tag, owner);
  return entry.GetKeyword();
}

namespace gdcm
{

  inline bool canContainBackslash(const VR::VRType vrType)
  {
    assert(VR::IsASCII(vrType));
    // PS 3.5-2011 / Table 6.2-1 DICOM VALUE REPRESENTATIONS
    switch (vrType)
    {
    case VR::AE: // ScheduledStationAETitle
                 // case VR::AS: // no
                 // case VR::AT: // binary
    case VR::CS: // SpecificCharacterSet
    case VR::DA: // CalibrationDate
    case VR::DS: // FrameTimeVector
    case VR::DT: // ReferencedDateTime
                 // case VR::FD: // binary
                 // case VR::FL:
    case VR::IS: // ReferencedFrameNumber
    case VR::LO: // OtherPatientIDs
                 // case VR::LT: // VM1
                 // case VR::OB: // binary
                 // case VR::OD: // binary
                 // case VR::OF: // binary
                 // case VR::OW: // binary
    case VR::PN: // PerformingPhysicianName
    case VR::SH: // PatientTelephoneNumbers
                 // case VR::SL: // binary
                 // case VR::SQ: // binary
                 // case VR::SS: // binary
                 // case VR::ST: // VM1
    case VR::TM: // CalibrationTime
    case VR::UI: // SOPClassesInStudy
      // case VR::UL: // binary
      // case VR::UN: // binary
      // case VR::US: // binary
      // case VR::UT: // VM1
      assert(!(vrType & VR::VR_VM1));
      return true;
    default:;
    }
    return false;
  }

  void dataElementToJSONArray(const VR::VRType vr, const DataElement &de, rapidjson::Value &jsonArray, rapidjson::Document::AllocatorType &allocator)
  {
    jsonArray.SetArray();
    if (de.IsEmpty())
    {
      // F.2.5 DICOM JSON Model Null Values
      if (vr == VR::PN)
      {
        jsonArray.PushBack(rapidjson::Value(rapidjson::kObjectType), allocator);
      }
      return;
    }
    const bool checkbackslash = canContainBackslash(vr);
    const ByteValue *bv = de.GetByteValue();
    const char *value = bv->GetPointer();
    size_t len = bv->GetLength();

    if (vr == VR::UI)
    {
      const std::string strui(value, len);
      const size_t lenuid = strlen(strui.c_str()); // trick to remove trailing \0
      rapidjson::Value stringValue;
      stringValue.SetString(strui.c_str(), lenuid, allocator);
      jsonArray.PushBack(stringValue, allocator);
    }
    else if (vr == VR::PN)
    {
      const char *str1 = value;
      // remove whitespace:
      while (str1[len - 1] == ' ')
      {
        len--;
      }
      assert(str1);
      std::stringstream ss;
      // static const char *Keys[] = {
      //     "Alphabetic",
      //     "Ideographic",
      //     "Phonetic",
      // };
      while (1)
      {
        assert(str1 && (size_t)(str1 - value) <= len);
        const char *sep = strchr(str1, '\\');
        const size_t llen = (sep != NULL) ? (sep - str1) : (value + len - str1);
        const std::string component(str1, llen);

        const char *str2 = component.c_str();
        assert(str2);
        const size_t len2 = component.size();
        assert(len2 == llen);

        int idx = 0;
        // Just get Alphabetic name, hence the comments and extra breaks
        // rapidjson::Value namesObject(rapidjson::kObjectType);
        rapidjson::Value name;
        while (1)
        {
          assert(str2 && (size_t)(str2 - component.c_str()) <= len2);
          const char *sep2 = strchr(str2, '=');
          const size_t llen2 = (sep2 != NULL) ? (sep2 - str2) : (component.c_str() + len2 - str2);
          const std::string group(str2, llen2);
          // const char *thekey = Keys[idx++];

          // rapidjson::Value nameType(thekey, allocator);
          name.SetString(group.c_str(), group.size(), allocator);

          // namesObject.AddMember(nameType, name, allocator);
          break; // just Alphabetic, short circuit
          // if (sep2 == NULL)
          //   break;
          // str2 = sep2 + 1;
        }
        // jsonArray.PushBack(namesObject, allocator);
        jsonArray.PushBack(name, allocator);
        break; // just Alphabetic, short circuit
        if (sep == NULL)
          break;
        str1 = sep + 1;
        assert(checkbackslash);
      }
    }
    else if (vr == VR::DS || vr == VR::IS)
    {
      const char *str1 = value;
      assert(str1);
      VRToType<VR::IS>::Type vris;
      VRToType<VR::DS>::Type vrds;
      while (1)
      {
        std::stringstream ss;
        assert(str1 && (size_t)(str1 - value) <= len);
        const char *sep = strchr(str1, '\\');
        const size_t llen = (sep != NULL) ? (sep - str1) : (value + len - str1);
        rapidjson::Value elementValue;
        // This is complex, IS/DS should not be stored as string anymore
        switch (vr)
        {
        case VR::IS:
          ss.str(std::string(str1, llen));
          ss >> vris;
          elementValue.SetInt(vris);
          jsonArray.PushBack(elementValue, allocator);
          break;
        case VR::DS:
          ss.str(std::string(str1, llen));
          ss >> vrds;
          jsonArray.PushBack(rapidjson::Value(vrds), allocator);
          break;
        default:
          assert(0); // programmer error
        }
        if (sep == NULL)
          break;
        str1 = sep + 1;
        assert(checkbackslash);
      }
    }
    else if (checkbackslash)
    {
      const char *str1 = value;
      assert(str1);
      while (1)
      {
        assert(str1 && (size_t)(str1 - value) <= len);
        const char *sep = strchr(str1, '\\');
        const size_t llen = (sep != NULL) ? (sep - str1) : (value + len - str1);
        // json_object_array_add(my_array, json_object_new_string_len(str1, llen));
        rapidjson::Value valueString;
        valueString.SetString(str1, llen, allocator);
        jsonArray.PushBack(valueString, allocator);
        if (sep == NULL)
          break;
        str1 = sep + 1;
      }
    }
    else // default
    {
      rapidjson::Value valueString;
      valueString.SetString(value, len, allocator);
      jsonArray.PushBack(valueString, allocator);
    }
  }

  const gdcm::Tag PIXEL_DATA_TAG = gdcm::Tag(0x7fe0, 0x0010);
  rapidjson::Value *toJson(const gdcm::DataSet &dataSet, const Tags pickTags, const Tags skipTags, rapidjson::Value &dicomTagsObject, rapidjson::Document::AllocatorType &allocator)
  {
    for (gdcm::DataSet::ConstIterator it = dataSet.Begin(); it != dataSet.End(); ++it)
    {
      const gdcm::DataElement &de = *it;
      VR::VRType vr = de.GetVR();
      const gdcm::Tag &t = de.GetTag();
      if (t.IsGroupLength() || t == PIXEL_DATA_TAG || skipTags.find(t) != skipTags.end())
        continue; // skip useless group length and pixel data tag
      if (!pickTags.empty() && pickTags.find(t) == pickTags.end())
        continue; // skip tags that are not in the pick list if it has any

      const bool isSequence = vr == VR::SQ || de.IsUndefinedLength();
      const bool isPrivateCreator = t.IsPrivateCreator();
      if (isSequence)
        vr = VR::SQ;
      else if (isPrivateCreator)
        vr = VR::LO; // always prefer VR::LO (over invalid/UN)
      else if (vr == VR::INVALID)
        vr = VR::UN;
      const char *vr_str = VR::GetVRString(vr);
      assert(VR::GetVRTypeFromFile(vr_str) != VR::INVALID);

      rapidjson::Value tagValue;

      if (vr == VR::SQ)
      {
        // Sequence Value Representations are nested datasets
        SmartPointer<SequenceOfItems> sqi;
        sqi = de.GetValueAsSQ();
        if (sqi)
        {
          tagValue.SetArray();
          int nitems = sqi->GetNumberOfItems();
          for (int i = 1; i <= nitems; ++i)
          {
            const Item &item = sqi->GetItem(i);
            const DataSet &nested = item.GetNestedDataSet();
            rapidjson::Value sequenceObject(rapidjson::kObjectType);
            // grab all nested tags, empty pick and skip tag sets
            toJson(nested, {}, {}, sequenceObject, allocator);
            tagValue.PushBack(sequenceObject, allocator);
          }
        }

        // Strange code from gdcmJSON.cxx
        // else if (const SequenceOfFragments *sqf = de.GetSequenceOfFragments())
        // {
        //   tagValue.SetNull(); // FIXME
        // assert(0);
        // }
        // else
        // {
        //   assert(de.IsEmpty());
        //   // json_object_array_add(my_array, NULL ); // F.2.5 req ?
        // }
      }
      else if (VR::IsASCII(vr))
      {
        dataElementToJSONArray(vr, de, tagValue, allocator);
      }
      else
      {
        tagValue.SetArray();

        switch (vr)
        {
        case VR::FD:
        {
          Element<VR::FD, VM::VM1_n> el;
          el.Set(de.GetValue());
          int ellen = el.GetLength();
          for (int i = 0; i < ellen; ++i)
          {
            rapidjson::Value elValue;
            elValue.SetDouble(el.GetValue(i));
            tagValue.PushBack(elValue, allocator);
          }
        }
        break;
        case VR::FL:
        {
          Element<VR::FL, VM::VM1_n> el;
          el.Set(de.GetValue());
          int ellen = el.GetLength();
          for (int i = 0; i < ellen; ++i)
          {
            rapidjson::Value elValue;
            elValue.SetFloat(el.GetValue(i));
            tagValue.PushBack(elValue, allocator);
          }
        }
        break;
        case VR::SS:
        {
          Element<VR::SS, VM::VM1_n> el;
          el.Set(de.GetValue());
          int ellen = el.GetLength();
          for (int i = 0; i < ellen; ++i)
          {
            rapidjson::Value elValue;
            elValue.SetInt(el.GetValue(i));
            tagValue.PushBack(elValue, allocator);
          }
        }
        break;
        case VR::US:
        {
          Element<VR::US, VM::VM1_n> el;
          el.Set(de.GetValue());
          int ellen = el.GetLength();
          for (int i = 0; i < ellen; ++i)
          {
            rapidjson::Value elValue;
            elValue.SetUint(el.GetValue(i));
            tagValue.PushBack(elValue, allocator);
          }
        }
        break;
        case VR::SL:
        {
          Element<VR::SL, VM::VM1_n> el;
          el.Set(de.GetValue());
          int ellen = el.GetLength();
          for (int i = 0; i < ellen; ++i)
          {
            rapidjson::Value elValue;
            elValue.SetInt(el.GetValue(i));
            tagValue.PushBack(elValue, allocator);
          }
        }
        break;
        case VR::UL:
        {
          Element<VR::UL, VM::VM1_n> el;
          el.Set(de.GetValue());
          int ellen = el.GetLength();
          for (int i = 0; i < ellen; ++i)
          {
            rapidjson::Value elValue;
            elValue.SetUint(el.GetValue(i));
            tagValue.PushBack(elValue, allocator);
          }
        }
        break;
        case VR::AT:
        {
          Element<VR::AT, VM::VM1_n> el;
          el.Set(de.GetValue());
          int ellen = el.GetLength();
          for (int i = 0; i < ellen; ++i)
          {
            const std::string atstr = el.GetValue(i).PrintAsContinuousUpperCaseString();
            rapidjson::Value jsonElement;
            jsonElement.SetString(atstr.c_str(), atstr.size(), allocator);
            tagValue.PushBack(jsonElement, allocator);
          }
        }
        break;
        case VR::UN:
        case VR::INVALID:
        case VR::OD:
        case VR::OF:
        case VR::OB:
        case VR::OW:
        {
          assert(!de.IsUndefinedLength()); // handled before
          const gdcm::ByteValue *bv = de.GetByteValue();
          if (bv)
          {
            // base64 streams have to be a multiple of 4 bytes in length
            int encodedLengthEstimate = 2 * bv->GetLength();
            encodedLengthEstimate = ((encodedLengthEstimate / 4) + 1) * 4;

            const auto bin = itk::make_unique_for_overwrite<char[]>(encodedLengthEstimate);
            auto encodedLengthActual =
                static_cast<unsigned int>(itksysBase64_Encode((const unsigned char *)bv->GetPointer(),
                                                              static_cast<itk::SizeValueType>(bv->GetLength()),
                                                              (unsigned char *)bin.get(),
                                                              0));
            std::string encodedValue(bin.get(), encodedLengthActual);
            tagValue.SetString(encodedValue.c_str(), encodedValue.size(), allocator);
          }
        }
        break;
        default:
          assert(0); // programmer error
        }            // end switch
      }              // end array else

      if (tagValue.IsArray())
      {
        int arraySize = tagValue.Size();
        if (arraySize == 0)
        {
          continue; // skip empty arrays
        }
        else if (arraySize == 1)
        {
          // Unwrap array of size 1
          tagValue = tagValue[0]; // different from gdcmJSON.cxx
        }
      }

      const std::string &label = getLabelFromTag(t, dataSet);
      rapidjson::Value tagName;
      tagName.SetString(label.c_str(), label.size(), allocator);
      dicomTagsObject.AddMember(tagName, tagValue, allocator);
    }
    return &dicomTagsObject;
  }
}

using FileName = std::string;

struct DicomFile
{
  FileName fileName;
  gdcm::DataSet dataSet;

  DicomFile(const FileName &fileName)
      : fileName(fileName)
  {
    itk::DICOMTagReader tagReader;
    if (!tagReader.CanReadFile(fileName))
    {
      throw std::runtime_error("Can not read the input DICOM file: " + fileName);
    }
    tagReader.SetFileName(fileName);

    gdcm::ImageReader reader;
    reader.SetFileName(fileName.c_str());
    if (!reader.Read())
    {
      throw std::runtime_error("Failed to read the input DICOM file: " + fileName);
    }
    const gdcm::File &f = reader.GetFile();
    dataSet = f.GetDataSet();
  }

  bool operator==(const DicomFile &other) const
  {
    return fileName == other.fileName;
  }
};

struct dicomFileHash
{
  std::size_t operator()(const DicomFile &dicomFile) const
  {
    return std::hash<FileName>{}(dicomFile.fileName);
  }
};
using DicomFiles = std::unordered_set<DicomFile, dicomFileHash>;

DicomFiles loadFiles(const std::vector<FileName> &fileNames)
{
  DicomFiles dicomFiles;
  itk::DICOMTagReader tagReader;
  for (const FileName &fileName : fileNames)
  {
    dicomFiles.insert(DicomFile(fileName));
  }
  return dicomFiles;
}

using Volume = std::vector<DicomFile>;
using Volumes = std::vector<Volume>; // aka ImageSet
using ImageSets = std::vector<Volumes>;

std::pair<const char *, size_t> getTagBuffer(const gdcm::DataSet &ds, const gdcm::Tag &tag)
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

bool compareTags(const gdcm::DataSet &tagsA, const gdcm::DataSet &tagsB, const Tags &tagKeys)
{
  for (const auto &tagKey : tagKeys)
  {
    const auto tagA = getTagBuffer(tagsA, tagKey);
    const auto tagB = getTagBuffer(tagsB, tagKey);
    if (tagA.first == nullptr || tagB.first == nullptr)
    {
      return false;
    }
    if (std::memcmp(tagA.first, tagB.first, tagB.second) != 0)
    {
      return false;
    }
  }
  return true;
}

bool isSameVolume(const gdcm::DataSet &tagsA, const gdcm::DataSet &tagsB)
{
  const Tags criteria = {SERIES_UID, FRAME_OF_REFERENCE_UID};
  return compareTags(tagsA, tagsB, criteria);
}

Volumes groupByVolume(const DicomFiles &dicomFiles)
{
  Volumes volumes;
  for (const DicomFile &dicomFile : dicomFiles)
  {
    const auto candidate = dicomFile.dataSet;
    auto matchingVolume = std::find_if(volumes.begin(), volumes.end(), [&candidate](const Volume &volume)
                                       { return isSameVolume(volume.begin()->dataSet, candidate); });

    if (matchingVolume != volumes.end())
    {
      matchingVolume->push_back(dicomFile);
    }
    else
    {
      Volume newVolume({dicomFile});
      volumes.push_back(newVolume);
    }
  }
  return volumes;
}

ImageSets groupByImageSet(const Volumes &volumes)
{
  ImageSets imageSets;
  for (const Volume &volume : volumes)
  {
    const gdcm::DataSet volumeDataSet = volume.begin()->dataSet;
    auto matchingImageSet = std::find_if(imageSets.begin(), imageSets.end(), [&volumeDataSet](const Volumes &volumes)
                                         {
      const gdcm::DataSet imageSetDataSet = volumes.begin()->begin()->dataSet;
      return compareTags(volumeDataSet, imageSetDataSet, {STUDY_UID}); });
    if (matchingImageSet != imageSets.end())
    {
      matchingImageSet->push_back(volume);
    }
    else
    {
      Volumes newImageSet({volume});
      imageSets.push_back(newImageSet);
    }
  }
  return imageSets;
}

Volumes sortSpatially(Volumes &volumes)
{
  Volumes sortedVolumes;
  for (Volume &volume : volumes)
  {
    std::vector<std::string> unsortedSeriesFileNames;
    for (const DicomFile &dicomFile : volume)
    {
      unsortedSeriesFileNames.push_back(dicomFile.fileName);
    }
    std::vector<std::string> sortedFileNames = sortSpatially(unsortedSeriesFileNames);

    Volume sorted;
    for (const auto &fileName : sortedFileNames)
    {
      const auto matchingDicomFile = std::find_if(volume.begin(), volume.end(), [&fileName](const DicomFile &dicomFile)
                                                  { return dicomFile.fileName == fileName; });
      if (matchingDicomFile != volume.end())
      {
        sorted.push_back(*matchingDicomFile);
      }
    }
    sortedVolumes.push_back(sorted);
  }
  return sortedVolumes;
}

std::string getUID(const gdcm::DataSet &ds, const Tag &tag)
{
  if (!ds.FindDataElement(tag) || ds.GetDataElement(tag).IsEmpty())
  {
    throw std::runtime_error("Tag not found");
  }
  const gdcm::DataElement de = ds.GetDataElement(tag);
  const gdcm::ByteValue *bv = de.GetByteValue();
  const char *tagValue = bv->GetPointer();
  size_t len = bv->GetLength();
  return std::string(tagValue, len);
}

rapidjson::Document toJson(const ImageSets &imageSets)
{
  rapidjson::Document imageSetsJson(rapidjson::kArrayType);
  rapidjson::Document::AllocatorType &allocator = imageSetsJson.GetAllocator();
  gdcm::DataSet dataSet;
  Tags instanceSkipTags; // filter out patient, study, series tags from instance object
  instanceSkipTags.insert(PATIENT_TAGS.begin(), PATIENT_TAGS.end());
  instanceSkipTags.insert(STUDY_TAGS.begin(), STUDY_TAGS.end());
  instanceSkipTags.insert(SERIES_TAGS.begin(), SERIES_TAGS.end());
  for (const Volumes &volumes : imageSets)
  {
    rapidjson::Value seriesById(rapidjson::kObjectType);
    for (const Volume &volume : volumes)
    {
      rapidjson::Value instances(rapidjson::kObjectType);
      for (const auto &dicomFile : volume)
      {
        FileName file = dicomFile.fileName;
        dataSet = dicomFile.dataSet;
        rapidjson::Value instanceTagsJson(rapidjson::kObjectType);
        toJson(dataSet, {}, instanceSkipTags, instanceTagsJson, allocator);
        rapidjson::Value instance(rapidjson::kObjectType);
        instance.AddMember("DICOM", instanceTagsJson, allocator);

        rapidjson::Value fileNameValue;
        fileNameValue.SetString(file.c_str(), file.size(), allocator);
        rapidjson::Value imageFrame(rapidjson::kObjectType);
        imageFrame.AddMember("ID", fileNameValue, allocator);
        rapidjson::Value imageFrames(rapidjson::kArrayType);
        imageFrames.PushBack(imageFrame, allocator);
        instance.AddMember("ImageFrames", imageFrames, allocator);

        // instance by UID under instances
        const std::string instanceUID = getUID(dataSet, INSTANCE_UID);
        rapidjson::Value instanceId;
        instanceId.SetString(instanceUID.c_str(), instanceUID.size(), allocator);
        instances.AddMember(instanceId, instance, allocator);
      }

      // Series
      rapidjson::Value seriesTags(rapidjson::kObjectType);
      toJson(dataSet, SERIES_TAGS, {}, seriesTags, allocator);
      rapidjson::Value series(rapidjson::kObjectType);
      series.AddMember("DICOM", seriesTags, allocator);
      series.AddMember("Instances", instances, allocator);

      int volumeIndex = std::distance(volumes.begin(), std::find(volumes.begin(), volumes.end(), volume));
      const std::string seriesId = getUID(dataSet, SERIES_UID) + '.' + std::to_string(volumeIndex);

      rapidjson::Value seriesIdJson;
      seriesIdJson.SetString(seriesId.c_str(), seriesId.size(), allocator);
      seriesById.AddMember(seriesIdJson, series, allocator);
    }

    rapidjson::Value imageSet(rapidjson::kObjectType);

    // Patient
    rapidjson::Value patientTags(rapidjson::kObjectType);
    toJson(dataSet, PATIENT_TAGS, {}, patientTags, allocator);
    rapidjson::Value patient(rapidjson::kObjectType);
    patient.AddMember("DICOM", patientTags, allocator);
    imageSet.AddMember("Patient", patient, allocator);

    // Study
    rapidjson::Value studyTags(rapidjson::kObjectType);
    toJson(dataSet, STUDY_TAGS, {}, studyTags, allocator);
    rapidjson::Value study(rapidjson::kObjectType);
    study.AddMember("DICOM", studyTags, allocator);
    study.AddMember("Series", seriesById, allocator);
    imageSet.AddMember("Study", study, allocator);

    imageSetsJson.PushBack(imageSet, allocator);
  }
  return imageSetsJson;
}

int main(int argc, char *argv[])
{
  itk::wasm::Pipeline pipeline("image-sets-normalization", "Group DICOM files into image sets", argc, argv);

  std::vector<std::string> files;
  pipeline.add_option("--files", files, "DICOM files")->required()->check(CLI::ExistingFile)->type_size(1, -1)->type_name("INPUT_BINARY_FILE");

  itk::wasm::OutputTextStream imageSetsOutput;
  pipeline.add_option("image-sets", imageSetsOutput, "Image sets JSON")->required()->type_name("OUTPUT_JSON");

  ITK_WASM_PARSE(pipeline);

  const DicomFiles dicomFiles = loadFiles(files);
  Volumes volumes = groupByVolume(dicomFiles);
  volumes = sortSpatially(volumes);
  const ImageSets imageSets = groupByImageSet(volumes);

  rapidjson::Document imageSetsJson = toJson(imageSets);

  rapidjson::StringBuffer stringBuffer;
  rapidjson::Writer<rapidjson::StringBuffer> writer(stringBuffer);
  imageSetsJson.Accept(writer);
  imageSetsOutput.Get() << stringBuffer.GetString();

  return EXIT_SUCCESS;
}

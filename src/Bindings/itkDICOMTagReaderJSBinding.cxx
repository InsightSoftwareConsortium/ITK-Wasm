/*=========================================================================
 *
 *  Copyright Insight Software Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *=========================================================================*/
#include <algorithm>
#include <fstream>
#include <iostream>
#include <memory>
#include <sstream>
#include <stdexcept>
#include <string>
#include <vector>

#include <emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/val.h>

#include "itkCommonEnums.h"
#include "itkGDCMImageIO.h"
#include "itkGDCMSeriesFileNames.h"
#include "itkImageIOBase.h"
#include "itkMetaDataObject.h"

namespace itk
{

/** \class DICOMTagReaderJSBinding
 *
 * \brief Reads DICOM tags from a DICOM object.
 */
class DICOMTagReaderJSBinding
{
public:
  using MetaDictType = itk::MetaDataDictionary;
  using TagMapType = std::map<std::string, std::string>;

  DICOMTagReaderJSBinding()
    : m_dirtyCache(true)
  {
    m_GDCMImageIO = GDCMImageIO::New();
  }

  /** Sets file name. */
  void
  SetFileName(std::string file)
  {
    m_fileName = file;
    m_GDCMImageIO->SetFileName(file);
    m_dirtyCache = true;
  }

  /** Verify file can be read. */
  bool
  CanReadFile(std::string file)
  {
    return m_GDCMImageIO->CanReadFile(file.c_str());
  }

  std::string
  ReadTag(std::string tag)
  {

    if (m_dirtyCache)
    {
      m_GDCMImageIO->SetUseStreamedReading(true);
      m_GDCMImageIO->ReadImageInformation();
      m_tagDict = m_GDCMImageIO->GetMetaDataDictionary();
      m_dirtyCache = false;
    }

    auto value = unpackMetaAsString(m_tagDict[tag]);
    return value;
  }

  TagMapType
  ReadAllTags()
  {

    if (m_dirtyCache)
    {
      m_GDCMImageIO->SetUseStreamedReading(true);
      m_GDCMImageIO->ReadImageInformation();
      m_tagDict = m_GDCMImageIO->GetMetaDataDictionary();
      m_dirtyCache = false;
    }

    TagMapType allTagsDict;
    for (auto it = m_tagDict.Begin(); it != m_tagDict.End(); ++it)
    {
      auto value = unpackMetaAsString(it->second);
      allTagsDict[it->first] = value;
    }

    return allTagsDict;
  }

private:
  std::string               m_fileName;
  itk::GDCMImageIO::Pointer m_GDCMImageIO;
  MetaDictType              m_tagDict;
  bool                      m_dirtyCache;
};

} // end namespace itk

EMSCRIPTEN_BINDINGS(itk_dicom_tag_reader_js_binding)
{
  emscripten::register_vector<std::string>("vector<std::string>");
  emscripten::register_map<std::string, std::string>("TagMapType");
  emscripten::class_<itk::DICOMTagReaderJSBinding>("ITKDICOMTagReader")
    .constructor<>()
    .function("SetFileName", &itk::DICOMTagReaderJSBinding::SetFileName)
    .function("CanReadFile", &itk::DICOMTagReaderJSBinding::CanReadFile)
    .function("ReadTag", &itk::DICOMTagReaderJSBinding::ReadTag)
    .function("ReadAllTags", &itk::DICOMTagReaderJSBinding::ReadAllTags);
}

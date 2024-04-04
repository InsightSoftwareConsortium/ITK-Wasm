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
#ifndef DICOM_TAG_READER_H
#define DICOM_TAG_READER_H

#include <algorithm>
#include <fstream>
#include <iostream>
#include <memory>
#include <sstream>
#include <stdexcept>
#include <string>
#include <vector>
#include <string.h>

#include <iconv.h>

#include "rapidjson/document.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"

#include "itkCommonEnums.h"
#include "itkGDCMImageIO.h"
#include "itkGDCMSeriesFileNames.h"
#include "itkImageIOBase.h"
#include "itkMetaDataObject.h"

#include "CharStringToUTF8Converter.h"

std::string
unpackMetaAsString(const itk::MetaDataObjectBase::Pointer &metaValue)
{
    using MetaDataStringType = itk::MetaDataObject<std::string>;
    MetaDataStringType::Pointer value = dynamic_cast<MetaDataStringType *>(metaValue.GetPointer());
    if (value != nullptr)
    {
        return value->GetMetaDataObjectValue();
    }
    return {};
}

namespace itk
{

    /** \class DICOMTagReader
     *
     * \brief Reads DICOM tags from a DICOM object.
     */
    class DICOMTagReader
    {
    public:
        using MetaDictType = itk::MetaDataDictionary;
        using TagMapType = std::unordered_map<std::string, std::string>;

        DICOMTagReader()
            : m_dirtyCache(true)
        {
            m_GDCMImageIO = GDCMImageIO::New();
        }

        /** Sets file name. */
        void
        SetFileName(const std::string &file)
        {
            m_fileName = file;
            m_GDCMImageIO->SetFileName(file);
            m_dirtyCache = true;
        }

        /** Verify file can be read. */
        bool
        CanReadFile(const std::string &file)
        {
            return m_GDCMImageIO->CanReadFile(file.c_str());
        }

        std::string
        ReadTag(const std::string &tag)
        {

            if (m_dirtyCache)
            {
                m_GDCMImageIO->SetUseStreamedReading(true);
                m_GDCMImageIO->ReadImageInformation();
                m_tagDict = m_GDCMImageIO->GetMetaDataDictionary();
                auto specificCharacterSet = unpackMetaAsString(m_tagDict["0008|0005"]);
                m_decoder = CharStringToUTF8Converter(specificCharacterSet);
                m_dirtyCache = false;
            }

            auto value = unpackMetaAsString(m_tagDict[tag]);
            return m_decoder.convertCharStringToUTF8(value);
        }

        TagMapType
        ReadAllTags()
        {

            if (m_dirtyCache)
            {
                m_GDCMImageIO->SetUseStreamedReading(true);
                m_GDCMImageIO->ReadImageInformation();
                m_tagDict = m_GDCMImageIO->GetMetaDataDictionary();
                auto specificCharacterSet = unpackMetaAsString(m_tagDict["0008|0005"]);
                m_decoder = CharStringToUTF8Converter(specificCharacterSet);
                m_dirtyCache = false;
            }

            TagMapType allTagsDict;
            for (auto it = m_tagDict.Begin(); it != m_tagDict.End(); ++it)
            {
                auto value = unpackMetaAsString(it->second);
                allTagsDict[it->first] = m_decoder.convertCharStringToUTF8(value);
            }

            return allTagsDict;
        }

    private:
        std::string m_fileName;
        itk::GDCMImageIO::Pointer m_GDCMImageIO;
        MetaDictType m_tagDict;
        CharStringToUTF8Converter m_decoder = CharStringToUTF8Converter("");
        bool m_dirtyCache;
    };

} // end namespace itk

#endif // DICOM_TAG_READER_H
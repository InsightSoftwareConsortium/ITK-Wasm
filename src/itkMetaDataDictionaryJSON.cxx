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
#include "itkMetaDataDictionaryJSON.h"

namespace itk
{

void
metaDataDictionaryToJSON(const itk::MetaDataDictionary & dictionary, MetadataJSON & metaDataJSON)
{
  metaDataJSON.clear();

  auto itr = dictionary.Begin();
  auto end = dictionary.End();
  while (itr != end)
  {
    // glaze types
    using MetaDataBoolType = MetaDataObject<bool>;
    using MetaDataDoubleType = MetaDataObject<double>;
    using MetaDataStringType = MetaDataObject<std::string>;
    using MetaDataVectorDoubleType = MetaDataObject<std::vector<double>>;
    using MetaDataVectorStringType = MetaDataObject<std::vector<std::string>>;
    using MetaDataVectorVectorDoubleType = MetaDataObject<std::vector<std::vector<double>>>;

    // Additional ITK used MetaDataDictionary types
    // see ITK/Modules/Core/Common/src/itkMetaDataObject.cxx
    using MetaDataUcharType = MetaDataObject<unsigned char>;
    using MetaDataCharType = MetaDataObject<char>;
    using MetaDataSignedCharType = MetaDataObject<signed char>;
    using MetaDataUshortType = MetaDataObject<unsigned short>;
    using MetaDataShortType = MetaDataObject<short>;
    using MetaDataUlongType = MetaDataObject<unsigned long>;
    using MetaDataLongType = MetaDataObject<long>;
    using MetaDataUlongLongType = MetaDataObject<unsigned long long>;
    using MetaDataLongLongType = MetaDataObject<long long>;
    using MetaDataArrayCharType = MetaDataObject<Array<char>>;
    using MetaDataArrayIntType = MetaDataObject<Array<int>>;
    using MetaDataArrayFloatType = MetaDataObject<Array<float>>;
    using MetaDataArrayDoubleType = MetaDataObject<Array<double>>;
    using MetaDataMatrixFloat44Type = MetaDataObject<Matrix<float, 4, 4>>;
    using MetaDataMatrixDoubleType = MetaDataObject<Matrix<double>>;

    MetaDataObjectBase::Pointer entry = itr->second;
    const std::string key = itr->first;

    const auto boolValue = dynamic_cast<MetaDataBoolType *>(entry.GetPointer());
    if (boolValue)
    {
      const bool value = boolValue->GetMetaDataObjectValue();
      metaDataJSON.push_back({ key, value });
      ++itr;
      continue;
    }
    const auto doubleValue = dynamic_cast<MetaDataDoubleType *>(entry.GetPointer());
    if (doubleValue)
    {
      const double value = doubleValue->GetMetaDataObjectValue();
      metaDataJSON.push_back({ key, value });
      ++itr;
      continue;
    }
    const auto stringValue = dynamic_cast<MetaDataStringType *>(entry.GetPointer());
    if (stringValue)
    {
      const std::string value = stringValue->GetMetaDataObjectValue();
      metaDataJSON.push_back({ key, value });
      ++itr;
      continue;
    }

    const auto doubleVectorValue = dynamic_cast<MetaDataVectorDoubleType *>(entry.GetPointer());
    if (doubleVectorValue)
    {
      const std::vector<double> value = doubleVectorValue->GetMetaDataObjectValue();
      const glz::json_t::array_t valueDouble(value.begin(), value.end());
      metaDataJSON.push_back({ key, valueDouble });
      ++itr;
      continue;
    }
    const auto stringVectorValue = dynamic_cast<MetaDataVectorStringType *>(entry.GetPointer());
    if (stringVectorValue)
    {
      const std::vector<std::string> value = stringVectorValue->GetMetaDataObjectValue();
      const glz::json_t::array_t valueString(value.begin(), value.end());
      metaDataJSON.push_back({ key, valueString });
      ++itr;
      continue;
    }

    const auto doubleVectorVectorValue = dynamic_cast<MetaDataVectorVectorDoubleType *>(entry.GetPointer());
    if (doubleVectorVectorValue)
    {
      const std::vector<std::vector<double>> value = doubleVectorVectorValue->GetMetaDataObjectValue();
      glz::json_t::array_t valueDouble;
      for (const auto & v : value)
      {
        valueDouble.push_back(glz::json_t::array_t(v.begin(), v.end()));
      }
      metaDataJSON.push_back({ key, valueDouble });
      ++itr;
      continue;
    }

    const auto ucharValue = dynamic_cast<MetaDataUcharType *>(entry.GetPointer());
    if (ucharValue)
    {
      const unsigned char value = ucharValue->GetMetaDataObjectValue();
      metaDataJSON.push_back({ key, static_cast<double>(value) });
      ++itr;
      continue;
    }
    const auto charValue = dynamic_cast<MetaDataCharType *>(entry.GetPointer());
    if (charValue)
    {
      const char value = charValue->GetMetaDataObjectValue();
      metaDataJSON.push_back({ key, static_cast<double>(value) });
      ++itr;
      continue;
    }
    const auto signedCharValue = dynamic_cast<MetaDataSignedCharType *>(entry.GetPointer());
    if (signedCharValue)
    {
      const signed char value = signedCharValue->GetMetaDataObjectValue();
      metaDataJSON.push_back({ key, static_cast<double>(value) });
      ++itr;
      continue;
    }
    const auto ushortValue = dynamic_cast<MetaDataUshortType *>(entry.GetPointer());
    if (ushortValue)
    {
      const unsigned short value = ushortValue->GetMetaDataObjectValue();
      metaDataJSON.push_back({ key, static_cast<double>(value) });
      ++itr;
      continue;
    }
    const auto shortValue = dynamic_cast<MetaDataShortType *>(entry.GetPointer());
    if (shortValue)
    {
      const short value = shortValue->GetMetaDataObjectValue();
      metaDataJSON.push_back({ key, static_cast<double>(value) });
      ++itr;
      continue;
    }
    const auto ulongValue = dynamic_cast<MetaDataUlongType *>(entry.GetPointer());
    if (ulongValue)
    {
      const unsigned long value = ulongValue->GetMetaDataObjectValue();
      metaDataJSON.push_back({ key, static_cast<double>(value) });
      ++itr;
      continue;
    }
    const auto longValue = dynamic_cast<MetaDataLongType *>(entry.GetPointer());
    if (longValue)
    {
      const long value = longValue->GetMetaDataObjectValue();
      metaDataJSON.push_back({ key, static_cast<double>(value) });
      ++itr;
      continue;
    }
    const auto ulongLongValue = dynamic_cast<MetaDataUlongLongType *>(entry.GetPointer());
    if (ulongLongValue)
    {
      const unsigned long long value = ulongLongValue->GetMetaDataObjectValue();
      metaDataJSON.push_back({ key, static_cast<double>(value) });
      ++itr;
      continue;
    }
    const auto longLongValue = dynamic_cast<MetaDataLongLongType *>(entry.GetPointer());
    if (longLongValue)
    {
      const long long value = longLongValue->GetMetaDataObjectValue();
      metaDataJSON.push_back({ key, static_cast<double>(value) });
      ++itr;
      continue;
    }
    const auto arrayCharValue = dynamic_cast<MetaDataArrayCharType *>(entry.GetPointer());
    if (arrayCharValue)
    {
      const Array<char> valueArray = arrayCharValue->GetMetaDataObjectValue();
      const glz::json_t::array_t valueDouble(valueArray.begin(), valueArray.end());
      metaDataJSON.push_back({ key, valueDouble });
      ++itr;
      continue;
    }
    const auto arrayFloatValue = dynamic_cast<MetaDataArrayFloatType *>(entry.GetPointer());
    if (arrayFloatValue)
    {
      const Array<float> valueArray = arrayFloatValue->GetMetaDataObjectValue();
      const glz::json_t::array_t valueDouble(valueArray.begin(), valueArray.end());
      metaDataJSON.push_back({ key, valueDouble });
      ++itr;
      continue;
    }
    const auto arrayDoubleValue = dynamic_cast<MetaDataArrayDoubleType *>(entry.GetPointer());
    if (arrayDoubleValue)
    {
      const Array<double> valueArray = arrayDoubleValue->GetMetaDataObjectValue();
      const glz::json_t::array_t valueDouble(valueArray.begin(), valueArray.end());
      metaDataJSON.push_back({ key, valueDouble });
      ++itr;
      continue;
    }
    const auto matrixFloat44Value = dynamic_cast<MetaDataMatrixFloat44Type *>(entry.GetPointer());
    if (matrixFloat44Value)
    {
      const Matrix<float, 4, 4> valueArray = matrixFloat44Value->GetMetaDataObjectValue();
      glz::json_t::array_t valueDouble;
      for (unsigned int i = 0; i < 4; ++i)
      {
        valueDouble.push_back(glz::json_t::array_t(valueArray[i], valueArray[i] + 4));
      }
      metaDataJSON.push_back({ key, valueDouble });
      ++itr;
      continue;
    }
    const auto matrixDoubleValue = dynamic_cast<MetaDataMatrixDoubleType *>(entry.GetPointer());
    if (matrixDoubleValue)
    {
      const Matrix<double, 3, 3> valueArray = matrixDoubleValue->GetMetaDataObjectValue();
      glz::json_t::array_t valueDouble;
      for (unsigned int i = 0; i < 3; ++i)
      {
        valueDouble.push_back(glz::json_t::array_t(valueArray[i], valueArray[i] + 3));
      }
      metaDataJSON.push_back({ key, valueDouble });
      ++itr;
      continue;
    }
    ++itr;
  }
}

void
jsonToMetaDataDictionary(const MetadataJSON & metaDataJSON, itk::MetaDataDictionary & dictionary)
{
  dictionary.Clear();

  for (const auto metaDataEntry : metaDataJSON)
  {
    const std::string & key = std::get<0>(metaDataEntry);
    const glz::json_t & value = std::get<1>(metaDataEntry);

    if (value.is_boolean())
    {
      EncapsulateMetaData<bool>(dictionary, key, value.get_boolean());
    }
    else if (value.is_number())
    {
      EncapsulateMetaData<double>(dictionary, key, value.get_number());
    }
    else if (value.is_string())
    {
      EncapsulateMetaData<std::string>(dictionary, key, value.get_string());
    }
    else if (value.is_array())
    {
      if (value.size() > 0)
      {
        if (value[0].is_number())
        {
          std::vector<double> valueDouble;
          for (const auto & v : value.get_array())
          {
            valueDouble.push_back(v.get_number());
          }
          EncapsulateMetaData<std::vector<double>>(dictionary, key, valueDouble);
        }
        else if (value[0].is_string())
        {
          std::vector<std::string> valueString;
          for (const auto & v : value.get_array())
          {
            valueString.push_back(v.get_string());
          }
          EncapsulateMetaData<std::vector<std::string>>(dictionary, key, valueString);
        }
        else if (value[0].is_array())
        {
          if (value[0].size() > 0)
          {
            if (value[0][0].is_number())
            {
              std::vector<std::vector<double>> valueDouble;
              for (const auto & v : value.get_array())
              {
                std::vector<double> valueDoubleInner;
                for (const auto & vv : v.get_array())
                {
                  valueDoubleInner.push_back(vv.get_number());
                }
                valueDouble.push_back(valueDoubleInner);
              }
              EncapsulateMetaData<std::vector<std::vector<double>>>(dictionary, key, valueDouble);
            }
            else if (value[0][0].is_string())
            {
              std::vector<std::vector<std::string>> valueString;
              for (const auto & v : value.get_array())
              {
                std::vector<std::string> valueStringInner;
                for (const auto & vv : v.get_array())
                {
                  valueStringInner.push_back(vv.get_string());
                }
                valueString.push_back(valueStringInner);
              }
              EncapsulateMetaData<std::vector<std::vector<std::string>>>(dictionary, key, valueString);
            }
          }
          else
          {
            EncapsulateMetaData<std::vector<std::vector<double>>>(dictionary, key, {});
          }
        }
      }
      else
      {
        EncapsulateMetaData<std::vector<double>>(dictionary, key, {});
      }
    }
    else
    {
      itkGenericExceptionMacro("Unsupported MetadataObjectJSON type");
    }
  }
}

} // end namespace itk

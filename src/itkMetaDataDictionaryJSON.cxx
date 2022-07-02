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

namespace wasm
{

void ConvertMetaDataDictionaryToJSON(const itk::MetaDataDictionary & dictionary, rapidjson::Value & metadataJson, rapidjson::Document::AllocatorType& allocator)
{
  auto itr = dictionary.Begin();
  auto end = dictionary.End();
  while (itr != end)
  {
    // rapidjson types
    using MetaDataBoolType = MetaDataObject<bool>;
    using MetaDataIntType = MetaDataObject<int>;
    using MetaDataUintType = MetaDataObject<unsigned int>;
    using MetaDataInt64Type = MetaDataObject<int64_t>;
    using MetaDataUint64Type = MetaDataObject<uint64_t>;
    using MetaDataFloatType = MetaDataObject<float>;
    using MetaDataDoubleType = MetaDataObject<double>;
    using MetaDataStringType = MetaDataObject<std::string>;
    using MetaDataVectorIntType = MetaDataObject<std::vector<int>>;
    using MetaDataVectorUintType = MetaDataObject<std::vector<unsigned int>>;
    using MetaDataVectorInt64Type = MetaDataObject<std::vector<int64_t>>;
    using MetaDataVectorUint64Type = MetaDataObject<std::vector<uint64_t>>;
    using MetaDataVectorFloatType = MetaDataObject<std::vector<float>>;
    using MetaDataVectorDoubleType = MetaDataObject<std::vector<double>>;
    using MetaDataVectorStringType = MetaDataObject<std::vector<std::string>>;
    using MetaDataVectorVectorIntType = MetaDataObject<std::vector<std::vector<int>>>;
    using MetaDataVectorVectorUintType = MetaDataObject<std::vector<std::vector<unsigned int>>>;
    using MetaDataVectorVectorInt64Type = MetaDataObject<std::vector<std::vector<int64_t>>>;
    using MetaDataVectorVectorUint64Type = MetaDataObject<std::vector<std::vector<uint64_t>>>;
    using MetaDataVectorVectorFloatType = MetaDataObject<std::vector<std::vector<float>>>;
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
    rapidjson::Value entryJson(rapidjson::kArrayType);
    const std::string key = itr->first;
    entryJson.PushBack(rapidjson::Value().SetString(key.c_str(), allocator), allocator);

    const auto boolValue = dynamic_cast<MetaDataBoolType *>(entry.GetPointer());
    if (boolValue)
    {
      const bool value = boolValue->GetMetaDataObjectValue();
      entryJson.PushBack(rapidjson::Value().SetBool(value), allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto intValue = dynamic_cast<MetaDataIntType *>(entry.GetPointer());
    if (intValue)
    {
      const int value = intValue->GetMetaDataObjectValue();
      entryJson.PushBack(rapidjson::Value().SetInt(value), allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto uintValue = dynamic_cast<MetaDataUintType *>(entry.GetPointer());
    if (uintValue)
    {
      const unsigned int value = uintValue->GetMetaDataObjectValue();
      entryJson.PushBack(rapidjson::Value().SetUint(value), allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto int64Value = dynamic_cast<MetaDataInt64Type *>(entry.GetPointer());
    if (int64Value)
    {
      const int64_t value = int64Value->GetMetaDataObjectValue();
      entryJson.PushBack(rapidjson::Value().SetInt64(value), allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto uint64Value = dynamic_cast<MetaDataUint64Type *>(entry.GetPointer());
    if (uint64Value)
    {
      const uint64_t value = uint64Value->GetMetaDataObjectValue();
      entryJson.PushBack(rapidjson::Value().SetUint64(value), allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto doubleValue = dynamic_cast<MetaDataDoubleType *>(entry.GetPointer());
    if (doubleValue)
    {
      const double value = doubleValue->GetMetaDataObjectValue();
      entryJson.PushBack(rapidjson::Value().SetDouble(value), allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto floatValue = dynamic_cast<MetaDataFloatType *>(entry.GetPointer());
    if (floatValue)
    {
      const float value = floatValue->GetMetaDataObjectValue();
      entryJson.PushBack(rapidjson::Value().SetFloat(value), allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto stringValue = dynamic_cast<MetaDataStringType *>(entry.GetPointer());
    if (stringValue)
    {
      const std::string value = stringValue->GetMetaDataObjectValue();
      entryJson.PushBack(rapidjson::Value().SetString(value.c_str(), allocator), allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }

    const auto intVectorValue = dynamic_cast<MetaDataVectorIntType *>(entry.GetPointer());
    if (intVectorValue)
    {
      const std::vector<int> value = intVectorValue->GetMetaDataObjectValue();
      rapidjson::Value valueJson(rapidjson::kArrayType);
      for(auto vv: value)
      {
        valueJson.PushBack(rapidjson::Value().SetInt(vv), allocator);
      }
      entryJson.PushBack(valueJson, allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto uintVectorValue = dynamic_cast<MetaDataVectorUintType *>(entry.GetPointer());
    if (uintVectorValue)
    {
      const std::vector<unsigned int> value = uintVectorValue->GetMetaDataObjectValue();
      rapidjson::Value valueJson(rapidjson::kArrayType);
      for(auto vv: value)
      {
        valueJson.PushBack(rapidjson::Value().SetUint(vv), allocator);
      }
      entryJson.PushBack(valueJson, allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto int64VectorValue = dynamic_cast<MetaDataVectorInt64Type *>(entry.GetPointer());
    if (int64VectorValue)
    {
      const std::vector<int64_t> value = int64VectorValue->GetMetaDataObjectValue();
      rapidjson::Value valueJson(rapidjson::kArrayType);
      for(auto vv: value)
      {
        valueJson.PushBack(rapidjson::Value().SetInt64(vv), allocator);
      }
      entryJson.PushBack(valueJson, allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto uint64VectorValue = dynamic_cast<MetaDataVectorUint64Type *>(entry.GetPointer());
    if (uint64VectorValue)
    {
      const std::vector<uint64_t> value = uint64VectorValue->GetMetaDataObjectValue();
      rapidjson::Value valueJson(rapidjson::kArrayType);
      for(auto vv: value)
      {
        valueJson.PushBack(rapidjson::Value().SetUint64(vv), allocator);
      }
      entryJson.PushBack(valueJson, allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto doubleVectorValue = dynamic_cast<MetaDataVectorDoubleType *>(entry.GetPointer());
    if (doubleVectorValue)
    {
      const std::vector<double> value = doubleVectorValue->GetMetaDataObjectValue();
      rapidjson::Value valueJson(rapidjson::kArrayType);
      for(auto vv: value)
      {
        valueJson.PushBack(rapidjson::Value().SetDouble(vv), allocator);
      }
      entryJson.PushBack(valueJson, allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto floatVectorValue = dynamic_cast<MetaDataVectorFloatType *>(entry.GetPointer());
    if (floatVectorValue)
    {
      const std::vector<float> value = floatVectorValue->GetMetaDataObjectValue();
      rapidjson::Value valueJson(rapidjson::kArrayType);
      for(auto vv: value)
      {
        valueJson.PushBack(rapidjson::Value().SetFloat(vv), allocator);
      }
      entryJson.PushBack(valueJson, allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto stringVectorValue = dynamic_cast<MetaDataVectorStringType *>(entry.GetPointer());
    if (stringVectorValue)
    {
      const std::vector<std::string> value = stringVectorValue->GetMetaDataObjectValue();
      rapidjson::Value valueJson(rapidjson::kArrayType);
      for(auto vv: value)
      {
        valueJson.PushBack(rapidjson::Value().SetString(vv.c_str(), allocator), allocator);
      }
      entryJson.PushBack(valueJson, allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }

    const auto intVectorVectorValue = dynamic_cast<MetaDataVectorVectorIntType *>(entry.GetPointer());
    if (intVectorVectorValue)
    {
      const std::vector<std::vector<int>> value = intVectorVectorValue->GetMetaDataObjectValue();
      rapidjson::Value valueJson(rapidjson::kArrayType);
      for(auto aa: value)
      {
        rapidjson::Value vvJson(rapidjson::kArrayType);
        for(auto vv: value)
        {
          for(auto uu: vv)
          {
          vvJson.PushBack(rapidjson::Value().SetInt(uu), allocator);
          }
        }
        valueJson.PushBack(vvJson, allocator);
      }
      entryJson.PushBack(valueJson, allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto uintVectorVectorValue = dynamic_cast<MetaDataVectorVectorUintType *>(entry.GetPointer());
    if (uintVectorVectorValue)
    {
      const std::vector<std::vector<unsigned int>> value = uintVectorVectorValue->GetMetaDataObjectValue();
      rapidjson::Value valueJson(rapidjson::kArrayType);
      for(auto aa: value)
      {
        rapidjson::Value vvJson(rapidjson::kArrayType);
        for(auto vv: value)
        {
          for(auto uu: vv)
          {
          vvJson.PushBack(rapidjson::Value().SetUint(uu), allocator);
          }
        }
        valueJson.PushBack(vvJson, allocator);
      }
      entryJson.PushBack(valueJson, allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto int64VectorVectorValue = dynamic_cast<MetaDataVectorVectorInt64Type *>(entry.GetPointer());
    if (int64VectorVectorValue)
    {
      const std::vector<std::vector<int64_t>> value = int64VectorVectorValue->GetMetaDataObjectValue();
      rapidjson::Value valueJson(rapidjson::kArrayType);
      for(auto aa: value)
      {
        rapidjson::Value vvJson(rapidjson::kArrayType);
        for(auto vv: value)
        {
          for(auto uu: vv)
          {
          vvJson.PushBack(rapidjson::Value().SetInt64(uu), allocator);
          }
        }
        valueJson.PushBack(vvJson, allocator);
      }
      entryJson.PushBack(valueJson, allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto uint64VectorVectorValue = dynamic_cast<MetaDataVectorVectorUint64Type *>(entry.GetPointer());
    if (int64VectorVectorValue)
    {
      const std::vector<std::vector<uint64_t>> value = uint64VectorVectorValue->GetMetaDataObjectValue();
      rapidjson::Value valueJson(rapidjson::kArrayType);
      for(auto aa: value)
      {
        rapidjson::Value vvJson(rapidjson::kArrayType);
        for(auto vv: value)
        {
          for(auto uu: vv)
          {
          vvJson.PushBack(rapidjson::Value().SetUint64(uu), allocator);
          }
        }
        valueJson.PushBack(vvJson, allocator);
      }
      entryJson.PushBack(valueJson, allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto doubleVectorVectorValue = dynamic_cast<MetaDataVectorVectorDoubleType *>(entry.GetPointer());
    if (doubleVectorVectorValue)
    {
      const std::vector<std::vector<double>> value = doubleVectorVectorValue->GetMetaDataObjectValue();
      rapidjson::Value valueJson(rapidjson::kArrayType);
      for(auto aa: value)
      {
        rapidjson::Value vvJson(rapidjson::kArrayType);
        for(auto vv: value)
        {
          for(auto uu: vv)
          {
          vvJson.PushBack(rapidjson::Value().SetDouble(uu), allocator);
          }
        }
        valueJson.PushBack(vvJson, allocator);
      }
      entryJson.PushBack(valueJson, allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto floatVectorVectorValue = dynamic_cast<MetaDataVectorVectorFloatType *>(entry.GetPointer());
    if (floatVectorVectorValue)
    {
      const std::vector<std::vector<float>> value = floatVectorVectorValue->GetMetaDataObjectValue();
      rapidjson::Value valueJson(rapidjson::kArrayType);
      for(auto aa: value)
      {
        rapidjson::Value vvJson(rapidjson::kArrayType);
        for(auto vv: value)
        {
          for(auto uu: vv)
          {
          vvJson.PushBack(rapidjson::Value().SetFloat(uu), allocator);
          }
        }
        valueJson.PushBack(vvJson, allocator);
      }
      entryJson.PushBack(valueJson, allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }

    const auto ucharValue = dynamic_cast<MetaDataUcharType *>(entry.GetPointer());
    if (ucharValue)
    {
      const unsigned char value = ucharValue->GetMetaDataObjectValue();
      entryJson.PushBack(rapidjson::Value().SetUint(value), allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto charValue = dynamic_cast<MetaDataCharType *>(entry.GetPointer());
    if (charValue)
    {
      const char value = charValue->GetMetaDataObjectValue();
      entryJson.PushBack(rapidjson::Value().SetInt(value), allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto signedCharValue = dynamic_cast<MetaDataSignedCharType *>(entry.GetPointer());
    if (signedCharValue)
    {
      const signed char value = signedCharValue->GetMetaDataObjectValue();
      entryJson.PushBack(rapidjson::Value().SetInt(value), allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto ushortValue = dynamic_cast<MetaDataUshortType *>(entry.GetPointer());
    if (ushortValue)
    {
      const unsigned short value = ushortValue->GetMetaDataObjectValue();
      entryJson.PushBack(rapidjson::Value().SetUint(value), allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto shortValue = dynamic_cast<MetaDataShortType *>(entry.GetPointer());
    if (shortValue)
    {
      const short value = shortValue->GetMetaDataObjectValue();
      entryJson.PushBack(rapidjson::Value().SetInt(value), allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto ulongValue = dynamic_cast<MetaDataUlongType *>(entry.GetPointer());
    if (ulongValue)
    {
      const unsigned long value = ulongValue->GetMetaDataObjectValue();
      entryJson.PushBack(rapidjson::Value().SetUint64(value), allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto longValue = dynamic_cast<MetaDataLongType *>(entry.GetPointer());
    if (longValue)
    {
      const long value = longValue->GetMetaDataObjectValue();
      entryJson.PushBack(rapidjson::Value().SetInt64(value), allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto ulongLongValue = dynamic_cast<MetaDataUlongLongType *>(entry.GetPointer());
    if (ulongLongValue)
    {
      const unsigned long long value = ulongLongValue->GetMetaDataObjectValue();
      entryJson.PushBack(rapidjson::Value().SetUint64(value), allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto longLongValue = dynamic_cast<MetaDataLongLongType *>(entry.GetPointer());
    if (longLongValue)
    {
      const long long value = longLongValue->GetMetaDataObjectValue();
      entryJson.PushBack(rapidjson::Value().SetInt64(value), allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto arrayCharValue = dynamic_cast<MetaDataArrayCharType *>(entry.GetPointer());
    if (arrayCharValue)
    {
      const Array<char> value = arrayCharValue->GetMetaDataObjectValue();
      rapidjson::Value valueJson(rapidjson::kArrayType);
      for(auto vv: value)
      {
        valueJson.PushBack(rapidjson::Value().SetInt(vv), allocator);
      }
      entryJson.PushBack(valueJson, allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto arrayFloatValue = dynamic_cast<MetaDataArrayFloatType *>(entry.GetPointer());
    if (arrayFloatValue)
    {
      const Array<float> value = arrayFloatValue->GetMetaDataObjectValue();
      rapidjson::Value valueJson(rapidjson::kArrayType);
      for(auto vv: value)
      {
        valueJson.PushBack(rapidjson::Value().SetFloat(vv), allocator);
      }
      entryJson.PushBack(valueJson, allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto arrayDoubleValue = dynamic_cast<MetaDataArrayDoubleType *>(entry.GetPointer());
    if (arrayDoubleValue)
    {
      const Array<double> value = arrayDoubleValue->GetMetaDataObjectValue();
      rapidjson::Value valueJson(rapidjson::kArrayType);
      for(auto vv: value)
      {
        valueJson.PushBack(rapidjson::Value().SetDouble(vv), allocator);
      }
      entryJson.PushBack(valueJson, allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto matrixFloat44Value = dynamic_cast<MetaDataMatrixFloat44Type *>(entry.GetPointer());
    if (matrixFloat44Value)
    {
      const Matrix<float, 4, 4> value = matrixFloat44Value->GetMetaDataObjectValue();
      rapidjson::Value valueJson(rapidjson::kArrayType);
      for(unsigned int ii = 0; ii < 4; ii++)
      {
        rapidjson::Value vvJson(rapidjson::kArrayType);
        for(unsigned int jj = 0; jj < 4; jj++)
        {
          vvJson.PushBack(rapidjson::Value().SetFloat(value(ii, jj)), allocator);
        }
        valueJson.PushBack(vvJson, allocator);
      }
      entryJson.PushBack(valueJson, allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }
    const auto matrixDoubleValue = dynamic_cast<MetaDataMatrixDoubleType *>(entry.GetPointer());
    if (matrixDoubleValue)
    {
      const Matrix<double, 3, 3> value = matrixDoubleValue->GetMetaDataObjectValue();
      rapidjson::Value valueJson(rapidjson::kArrayType);
      for(unsigned int ii = 0; ii < 3; ii++)
      {
        rapidjson::Value vvJson(rapidjson::kArrayType);
        for(unsigned int jj = 0; jj < 3; jj++)
        {
          vvJson.PushBack(rapidjson::Value().SetDouble(value(ii, jj)), allocator);
        }
        valueJson.PushBack(vvJson, allocator);
      }
      entryJson.PushBack(valueJson, allocator);
      metadataJson.PushBack(entryJson, allocator);
      ++itr;
      continue;
    }

    ++itr;
  }

}

void ConvertJSONToMetaDataDictionary(const rapidjson::Value & metadataJson, itk::MetaDataDictionary & dictionary)
{
  if (metadataJson.IsArray())
  {
    for(rapidjson::SizeType ii = 0; ii < metadataJson.Size(); ++ii)
      {
      const rapidjson::Value & entry = metadataJson[ii];
      const auto key = entry[0].GetString();
      std::cout << "Read key: " << key << std::endl;
      const rapidjson::Value & value = entry[1];
      if (value.IsBool())
        {
        EncapsulateMetaData<bool>(dictionary, key, value.GetBool());
        }
      else if (value.IsInt())
        {
        EncapsulateMetaData<int>(dictionary, key, value.GetInt());
        }
      else if (value.IsUint())
        {
        EncapsulateMetaData<unsigned int>(dictionary, key, value.GetUint());
        }
      else if (value.IsInt64())
        {
        EncapsulateMetaData<int64_t>(dictionary, key, value.GetInt64());
        }
      else if (value.IsUint64())
        {
        EncapsulateMetaData<uint64_t>(dictionary, key, value.GetUint64());
        }
      else if (value.IsDouble())
        {
        EncapsulateMetaData<double>(dictionary, key, value.GetDouble());
        }
      else if (value.IsFloat())
        {
        EncapsulateMetaData<float>(dictionary, key, value.GetFloat());
        }
      else if (value.IsString())
        {
          std::cout << "encapsulating: " << key << " , "  << value.GetString() << std::endl;
        EncapsulateMetaData<std::string>(dictionary, key, value.GetString());
        }
      else if (value.IsArray())
        {
        if (value.Size() == 0)
        {
          using ValueType = std::vector<std::string>;
          ValueType val;
          EncapsulateMetaData<ValueType>(dictionary, key, val);
          continue;
        }
        if (value[0].IsString())
          {
          using ValueType = std::vector<std::string>;
          ValueType val;
          for(rapidjson::SizeType jj = 0; jj < value.Size(); ++jj)
            {
            val.push_back(value[jj].GetString());
            }
          EncapsulateMetaData<ValueType>(dictionary, key, val);
          }
        else if (value[0].IsNumber())
          {
          if (value[0].IsArray())
            {
            if (value[0].Size() == 0 || value[0][0].IsString())
              {
              using ValueType = std::vector<std::vector<std::string>>;
              ValueType val;
              for(rapidjson::SizeType jj = 0; jj < value[jj].Size(); ++jj)
                {
                std::vector<std::string> ve;
                for(rapidjson::SizeType kk = 0; kk < value[jj][kk].Size(); ++kk)
                  {
                  ve.push_back(value[jj][kk].GetString());
                  }
                val.push_back(ve);
                }
              EncapsulateMetaData<ValueType>(dictionary, key, val);
              }
            else if (value[0][0].IsNumber())
              {
              if (value.IsInt())
                {
                using ValueType = std::vector<std::vector<int>>;
                ValueType val;
                for(rapidjson::SizeType jj = 0; jj < value[jj].Size(); ++jj)
                  {
                  std::vector<int> ve;
                  for(rapidjson::SizeType kk = 0; kk < value[jj][kk].Size(); ++kk)
                    {
                    ve.push_back(value[jj][kk].GetInt());
                    }
                  val.push_back(ve);
                  }
                EncapsulateMetaData<ValueType>(dictionary, key, val);
                }
              else if (value.IsUint())
                {
                using ValueType = std::vector<std::vector<unsigned int>>;
                ValueType val;
                for(rapidjson::SizeType jj = 0; jj < value[jj].Size(); ++jj)
                  {
                  std::vector<unsigned int> ve;
                  for(rapidjson::SizeType kk = 0; kk < value[jj][kk].Size(); ++kk)
                    {
                    ve.push_back(value[jj][kk].GetUint());
                    }
                  val.push_back(ve);
                  }
                EncapsulateMetaData<ValueType>(dictionary, key, val);
                }
              else if (value.IsInt64())
                {
                using ValueType = std::vector<std::vector<int64_t>>;
                ValueType val;
                for(rapidjson::SizeType jj = 0; jj < value[jj].Size(); ++jj)
                  {
                  std::vector<int64_t> ve;
                  for(rapidjson::SizeType kk = 0; kk < value[jj][kk].Size(); ++kk)
                    {
                    ve.push_back(value[jj][kk].GetInt64());
                    }
                  val.push_back(ve);
                  }
                EncapsulateMetaData<ValueType>(dictionary, key, val);
                }
              else if (value.IsUint64())
                {
                using ValueType = std::vector<std::vector<uint64_t>>;
                ValueType val;
                for(rapidjson::SizeType jj = 0; jj < value[jj].Size(); ++jj)
                  {
                  std::vector<uint64_t> ve;
                  for(rapidjson::SizeType kk = 0; kk < value[jj][kk].Size(); ++kk)
                    {
                    ve.push_back(value[jj][kk].GetUint64());
                    }
                  val.push_back(ve);
                  }
                EncapsulateMetaData<ValueType>(dictionary, key, val);
                }
              else if (value.IsDouble())
                {
                using ValueType = std::vector<std::vector<double>>;
                ValueType val;
                for(rapidjson::SizeType jj = 0; jj < value[jj].Size(); ++jj)
                  {
                  std::vector<double> ve;
                  for(rapidjson::SizeType kk = 0; kk < value[jj][kk].Size(); ++kk)
                    {
                    ve.push_back(value[jj][kk].GetDouble());
                    }
                  val.push_back(ve);
                  }
                EncapsulateMetaData<ValueType>(dictionary, key, val);
                }
              else if (value.IsFloat())
                {
                using ValueType = std::vector<std::vector<float>>;
                ValueType val;
                for(rapidjson::SizeType jj = 0; jj < value[jj].Size(); ++jj)
                  {
                  std::vector<float> ve;
                  for(rapidjson::SizeType kk = 0; kk < value[jj][kk].Size(); ++kk)
                    {
                    ve.push_back(value[jj][kk].GetFloat());
                    }
                  val.push_back(ve);
                  }
                EncapsulateMetaData<ValueType>(dictionary, key, val);
                }
              }
            }
          else
            {
            if (value.IsInt())
              {
              using ValueType = std::vector<int>;
              ValueType val;
              for(rapidjson::SizeType jj = 0; jj < value.Size(); ++jj)
                {
                val.push_back(value[jj].GetInt());
                }
              EncapsulateMetaData<ValueType>(dictionary, key, val);
              }
            else if (value.IsUint())
              {
              using ValueType = std::vector<unsigned int>;
              ValueType val;
              for(rapidjson::SizeType jj = 0; jj < value.Size(); ++jj)
                {
                val.push_back(value[jj].GetUint());
                }
              EncapsulateMetaData<ValueType>(dictionary, key, val);
              }
            else if (value.IsInt64())
              {
              using ValueType = std::vector<int64_t>;
              ValueType val;
              for(rapidjson::SizeType jj = 0; jj < value.Size(); ++jj)
                {
                val.push_back(value[jj].GetInt64());
                }
              EncapsulateMetaData<ValueType>(dictionary, key, val);
              }
            else if (value.IsUint64())
              {
              using ValueType = std::vector<uint64_t>;
              ValueType val;
              for(rapidjson::SizeType jj = 0; jj < value.Size(); ++jj)
                {
                val.push_back(value[jj].GetUint64());
                }
              EncapsulateMetaData<ValueType>(dictionary, key, val);
              }
            else if (value.IsDouble())
              {
              using ValueType = std::vector<double>;
              ValueType val;
              for(rapidjson::SizeType jj = 0; jj < value.Size(); ++jj)
                {
                val.push_back(value[jj].GetDouble());
                }
              EncapsulateMetaData<ValueType>(dictionary, key, val);
              }
            else if (value.IsFloat())
              {
              using ValueType = std::vector<float>;
              ValueType val;
              for(rapidjson::SizeType jj = 0; jj < value.Size(); ++jj)
                {
                val.push_back(value[jj].GetFloat());
                }
              EncapsulateMetaData<ValueType>(dictionary, key, val);
              }
            else if (value.IsString())
              {
              using ValueType = std::vector<std::string>;
              ValueType val;
              for(rapidjson::SizeType jj = 0; jj < value.Size(); ++jj)
                {
                val.push_back(value[jj].GetString());
                }
              EncapsulateMetaData<ValueType>(dictionary, key, val);
              }
            }
          }
        }
      }
  }
}

} // end namespace wasm
} // end namespace itk

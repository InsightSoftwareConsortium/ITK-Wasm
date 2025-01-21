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
#include "itkMetaDataDictionaryCBOR.h"

namespace itk
{

void
metaDataDictionaryToCBOR(const itk::MetaDataDictionary & dictionary, cbor_item_t * metaDataCBOR)
{
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
      cbor_item_t* keyItem = cbor_build_string(key.c_str());
      cbor_item_t* valueItem = cbor_build_bool(value);
      cbor_map_add(metaDataCBOR, cbor_pair{cbor_move(keyItem), cbor_move(valueItem)});
      ++itr;
      continue;
    }

    const auto doubleValue = dynamic_cast<MetaDataDoubleType *>(entry.GetPointer());
    if (doubleValue)
    {
      const double value = doubleValue->GetMetaDataObjectValue();
      cbor_item_t* keyItem = cbor_build_string(key.c_str());
      cbor_item_t* valueItem = cbor_build_float8(value);
      cbor_map_add(metaDataCBOR, cbor_pair{cbor_move(keyItem), cbor_move(valueItem)});
      ++itr;
      continue;
    }

    const auto stringValue = dynamic_cast<MetaDataStringType *>(entry.GetPointer());
    if (stringValue)
    {
      const std::string value = stringValue->GetMetaDataObjectValue();
      cbor_item_t* keyItem = cbor_build_string(key.c_str());
      cbor_item_t* valueItem = cbor_build_string(value.c_str());
      cbor_map_add(metaDataCBOR, cbor_pair{cbor_move(keyItem), cbor_move(valueItem)});
      ++itr;
      continue;
    }

    const auto doubleVectorValue = dynamic_cast<MetaDataVectorDoubleType *>(entry.GetPointer());
    if (doubleVectorValue)
    {
      const std::vector<double>& value = doubleVectorValue->GetMetaDataObjectValue();
      cbor_item_t* keyItem = cbor_build_string(key.c_str());
      cbor_item_t* arrayItem = cbor_new_definite_array(value.size());

      for (const auto& v : value)
      {
        cbor_array_push(arrayItem, cbor_build_float8(v));
      }

      cbor_map_add(metaDataCBOR, cbor_pair{cbor_move(keyItem), cbor_move(arrayItem)});
      ++itr;
      continue;
    }

    const auto stringVectorValue = dynamic_cast<MetaDataVectorStringType *>(entry.GetPointer());
    if (stringVectorValue)
    {
      const std::vector<std::string>& value = stringVectorValue->GetMetaDataObjectValue();
      cbor_item_t* keyItem = cbor_build_string(key.c_str());
      cbor_item_t* arrayItem = cbor_new_definite_array(value.size());

      for (const auto& s : value)
      {
        cbor_array_push(arrayItem, cbor_build_string(s.c_str()));
      }

      cbor_map_add(metaDataCBOR, cbor_pair{cbor_move(keyItem), cbor_move(arrayItem)});
      ++itr;
      continue;
    }

    const auto doubleVectorVectorValue = dynamic_cast<MetaDataVectorVectorDoubleType *>(entry.GetPointer());
    if (doubleVectorVectorValue)
    {
      const std::vector<std::vector<double>> value = doubleVectorVectorValue->GetMetaDataObjectValue();
      cbor_item_t* keyItem = cbor_build_string(key.c_str());
      cbor_item_t* arrayItem = cbor_new_definite_array(value.size());

      for (const auto& v : value)
      {
        cbor_item_t* innerArrayItem = cbor_new_definite_array(v.size());
        for (const auto& vv : v)
        {
          cbor_array_push(innerArrayItem, cbor_build_float8(vv));
        }
        cbor_array_push(arrayItem, innerArrayItem);
      }

      cbor_map_add(metaDataCBOR, cbor_pair{cbor_move(keyItem), cbor_move(arrayItem)});
      ++itr;
      continue;
    }

    const auto ucharValue = dynamic_cast<MetaDataUcharType *>(entry.GetPointer());
    if (ucharValue)
    {
      const unsigned char value = ucharValue->GetMetaDataObjectValue();
      cbor_item_t* keyItem = cbor_build_string(key.c_str());
      cbor_item_t* valueItem = cbor_build_uint8(value);
      cbor_map_add(metaDataCBOR, cbor_pair{cbor_move(keyItem), cbor_move(valueItem)});
      ++itr;
      continue;
    }
    const auto charValue = dynamic_cast<MetaDataCharType *>(entry.GetPointer());
    if (charValue)
    {
      const char value = charValue->GetMetaDataObjectValue();
      cbor_item_t* keyItem = cbor_build_string(key.c_str());
      cbor_item_t* valueItem = cbor_build_uint8(value);
      cbor_map_add(metaDataCBOR, cbor_pair{cbor_move(keyItem), cbor_move(valueItem)});
      ++itr;
      continue;
    }
    const auto signedCharValue = dynamic_cast<MetaDataSignedCharType *>(entry.GetPointer());
    if (signedCharValue)
    {
      const signed char value = signedCharValue->GetMetaDataObjectValue();
      cbor_item_t* keyItem = cbor_build_string(key.c_str());
      cbor_item_t* valueItem = cbor_build_uint8(value);
      cbor_map_add(metaDataCBOR, cbor_pair{cbor_move(keyItem), cbor_move(valueItem)});
      ++itr;
      continue;
    }
    const auto ushortValue = dynamic_cast<MetaDataUshortType *>(entry.GetPointer());
    if (ushortValue)
    {
      const unsigned short value = ushortValue->GetMetaDataObjectValue();
      cbor_item_t* keyItem = cbor_build_string(key.c_str());
      cbor_item_t* valueItem = cbor_build_uint16(value);
      cbor_map_add(metaDataCBOR, cbor_pair{cbor_move(keyItem), cbor_move(valueItem)});
      ++itr;
      continue;
    }
    const auto shortValue = dynamic_cast<MetaDataShortType *>(entry.GetPointer());
    if (shortValue)
    {
      const short value = shortValue->GetMetaDataObjectValue();
      cbor_item_t* keyItem = cbor_build_string(key.c_str());
      cbor_item_t* valueItem = cbor_build_uint16(value);
      cbor_map_add(metaDataCBOR, cbor_pair{cbor_move(keyItem), cbor_move(valueItem)});
      ++itr;
      continue;
    }
    const auto ulongValue = dynamic_cast<MetaDataUlongType *>(entry.GetPointer());
    if (ulongValue)
    {
      const unsigned long value = ulongValue->GetMetaDataObjectValue();
      cbor_item_t* keyItem = cbor_build_string(key.c_str());
      cbor_item_t* valueItem = cbor_build_uint32(value);
      cbor_map_add(metaDataCBOR, cbor_pair{cbor_move(keyItem), cbor_move(valueItem)});
      ++itr;
      continue;
    }
    const auto longValue = dynamic_cast<MetaDataLongType *>(entry.GetPointer());
    if (longValue)
    {
      const long value = longValue->GetMetaDataObjectValue();
      cbor_item_t* keyItem = cbor_build_string(key.c_str());
      cbor_item_t* valueItem = cbor_build_uint32(value);
      cbor_map_add(metaDataCBOR, cbor_pair{cbor_move(keyItem), cbor_move(valueItem)});
      ++itr;
      continue;
    }
    const auto ulongLongValue = dynamic_cast<MetaDataUlongLongType *>(entry.GetPointer());
    if (ulongLongValue)
    {
      const unsigned long long value = ulongLongValue->GetMetaDataObjectValue();
      cbor_item_t* keyItem = cbor_build_string(key.c_str());
      cbor_item_t* valueItem = cbor_build_uint64(value);
      cbor_map_add(metaDataCBOR, cbor_pair{cbor_move(keyItem), cbor_move(valueItem)});
      ++itr;
      continue;
    }
    const auto longLongValue = dynamic_cast<MetaDataLongLongType *>(entry.GetPointer());
    if (longLongValue)
    {
      const long long value = longLongValue->GetMetaDataObjectValue();
      cbor_item_t* keyItem = cbor_build_string(key.c_str());
      cbor_item_t* valueItem = cbor_build_uint64(value);
      cbor_map_add(metaDataCBOR, cbor_pair{cbor_move(keyItem), cbor_move(valueItem)});
      ++itr;
      continue;
    }
    const auto arrayCharValue = dynamic_cast<MetaDataArrayCharType *>(entry.GetPointer());
    if (arrayCharValue)
    {
      const Array<char> valueArray = arrayCharValue->GetMetaDataObjectValue();
      cbor_item_t* keyItem = cbor_build_string(key.c_str());
      cbor_item_t* arrayItem = cbor_new_definite_array(valueArray.Size());

      for (const auto& v : valueArray)
      {
        cbor_array_push(arrayItem, cbor_build_uint8(v));
      }

      cbor_map_add(metaDataCBOR, cbor_pair{cbor_move(keyItem), cbor_move(arrayItem)});
      ++itr;
      continue;
    }
    const auto arrayFloatValue = dynamic_cast<MetaDataArrayFloatType *>(entry.GetPointer());
    if (arrayFloatValue)
    {
      const Array<float> valueArray = arrayFloatValue->GetMetaDataObjectValue();
      cbor_item_t* keyItem = cbor_build_string(key.c_str());
      cbor_item_t* arrayItem = cbor_new_definite_array(valueArray.Size());

      for (const auto& v : valueArray)
      {
        cbor_array_push(arrayItem, cbor_build_float8(v));
      }

      cbor_map_add(metaDataCBOR, cbor_pair{cbor_move(keyItem), cbor_move(arrayItem)});
      ++itr;
      continue;
    }
    const auto arrayDoubleValue = dynamic_cast<MetaDataArrayDoubleType *>(entry.GetPointer());
    if (arrayDoubleValue)
    {
      const Array<double> valueArray = arrayDoubleValue->GetMetaDataObjectValue();
      cbor_item_t* keyItem = cbor_build_string(key.c_str());
      cbor_item_t* arrayItem = cbor_new_definite_array(valueArray.Size());

      for (const auto& v : valueArray)
      {
        cbor_array_push(arrayItem, cbor_build_float8(v));
      }

      cbor_map_add(metaDataCBOR, cbor_pair{cbor_move(keyItem), cbor_move(arrayItem)});
      ++itr;
      continue;
    }
    const auto matrixFloat44Value = dynamic_cast<MetaDataMatrixFloat44Type *>(entry.GetPointer());
    if (matrixFloat44Value)
    {
      const Matrix<float, 4, 4> valueArray = matrixFloat44Value->GetMetaDataObjectValue();
      cbor_item_t* keyItem = cbor_build_string(key.c_str());
      cbor_item_t* arrayItem = cbor_new_definite_array(4);

      for (unsigned int i = 0; i < 4; ++i)
      {
        cbor_item_t* innerArrayItem = cbor_new_definite_array(4);
        for (unsigned int j = 0; j < 4; ++j)
        {
          cbor_array_push(innerArrayItem, cbor_build_float8(valueArray[i][j]));
        }
        cbor_array_push(arrayItem, innerArrayItem);
      }

      cbor_map_add(metaDataCBOR, cbor_pair{cbor_move(keyItem), cbor_move(arrayItem)});
      ++itr;
      continue;
    }
    const auto matrixDoubleValue = dynamic_cast<MetaDataMatrixDoubleType *>(entry.GetPointer());
    if (matrixDoubleValue)
    {
      const Matrix<double, 3, 3> valueArray = matrixDoubleValue->GetMetaDataObjectValue();
      cbor_item_t* keyItem = cbor_build_string(key.c_str());
      cbor_item_t* arrayItem = cbor_new_definite_array(3);

      for (unsigned int i = 0; i < 3; ++i)
      {
        cbor_item_t* innerArrayItem = cbor_new_definite_array(3);
        for (unsigned int j = 0; j < 3; ++j)
        {
          cbor_array_push(innerArrayItem, cbor_build_float8(valueArray[i][j]));
        }
        cbor_array_push(arrayItem, innerArrayItem);
      }

      cbor_map_add(metaDataCBOR, cbor_pair{cbor_move(keyItem), cbor_move(arrayItem)});
      ++itr;
      continue;
    }
    ++itr;
  }
}

void
cborToMetaDataDictionary(const cbor_item_t * metaDataCBOR, itk::MetaDataDictionary & dictionary)
{
  dictionary.Clear();

  size_t mapLength = cbor_map_size(metaDataCBOR);
  struct cbor_pair *pairs = cbor_map_handle(metaDataCBOR);

  for (size_t i = 0; i < mapLength; i++)
  {
    cbor_item_t *key = pairs[i].key;
    cbor_item_t *value = pairs[i].value;

    // Extract key string
    std::string keyStr(reinterpret_cast<const char*>(cbor_string_handle(key)),
                      cbor_string_length(key));

    if (cbor_is_bool(value))
    {
      bool boolValue = cbor_get_bool(value);
      EncapsulateMetaData<bool>(dictionary, keyStr, boolValue);
    }
    else if (cbor_is_float(value))
    {
      double doubleValue = cbor_float_get_float(value);
      EncapsulateMetaData<double>(dictionary, keyStr, doubleValue);
    }
    else if (cbor_isa_string(value))
    {
      std::string stringValue(reinterpret_cast<const char*>(cbor_string_handle(value)),
                            cbor_string_length(value));
      EncapsulateMetaData<std::string>(dictionary, keyStr, stringValue);
    }
    else if (cbor_isa_array(value))
    {
      size_t arrayLength = cbor_array_size(value);
      if (arrayLength > 0)
      {
        cbor_item_t *firstItem = cbor_array_get(value, 0);

        if (cbor_is_float(firstItem))
        {
          std::vector<double> doubleVector;
          for (size_t j = 0; j < arrayLength; j++)
          {
            cbor_item_t *item = cbor_array_get(value, j);
            doubleVector.push_back(cbor_float_get_float(item));
          }
          EncapsulateMetaData<std::vector<double>>(dictionary, keyStr, doubleVector);
        }
        else if (cbor_isa_string(firstItem))
        {
          std::vector<std::string> stringVector;
          for (size_t j = 0; j < arrayLength; j++)
          {
            cbor_item_t *item = cbor_array_get(value, j);
            stringVector.emplace_back(reinterpret_cast<const char*>(cbor_string_handle(item)),
                                    cbor_string_length(item));
          }
          EncapsulateMetaData<std::vector<std::string>>(dictionary, keyStr, stringVector);
        }
        else if (cbor_isa_array(firstItem))
        {
          std::vector<std::vector<double>> doubleVectorVector;
          for (size_t j = 0; j < arrayLength; j++)
          {
            cbor_item_t *innerArray = cbor_array_get(value, j);
            size_t innerLength = cbor_array_size(innerArray);

            std::vector<double> innerVector;
            for (size_t k = 0; k < innerLength; k++)
            {
              cbor_item_t *item = cbor_array_get(innerArray, k);
              innerVector.push_back(cbor_float_get_float(item));
            }
            doubleVectorVector.push_back(std::move(innerVector));
          }
          EncapsulateMetaData<std::vector<std::vector<double>>>(dictionary, keyStr, doubleVectorVector);
        }
      }
    }
  }
}

} // end namespace itk

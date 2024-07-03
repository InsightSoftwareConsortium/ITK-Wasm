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

#define ITK_TEMPLATE_EXPLICIT_WasmTransformIO
#include "itkWasmTransformIO.h"

#include "itkCompositeTransform.h"
#include "itkCompositeTransformIOHelper.h"
#include "itkVersion.h"
#include "itkMakeUniqueForOverwrite.h"
#include <sstream>

#include "itkWasmIOCommon.h"
#include "itktransformParameterizationString.h"

#include "itkMetaDataObject.h"
#include "itkIOCommon.h"
#include "itksys/SystemTools.hxx"

#include "itksys/SystemTools.hxx"

#include "cbor.h"

namespace itk
{

template <typename TParametersValueType>
WasmTransformIOTemplate<TParametersValueType>::WasmTransformIOTemplate() = default;

template <typename TParametersValueType>
WasmTransformIOTemplate<TParametersValueType>::~WasmTransformIOTemplate() = default;

template <typename TParametersValueType>
void
WasmTransformIOTemplate<TParametersValueType>::PrintSelf(std::ostream & os, Indent indent) const
{
  Superclass::PrintSelf(os, indent);
}

template <typename TParametersValueType>
bool
WasmTransformIOTemplate<TParametersValueType>::CanReadFile(const char * filename)
{
  // Check the extension first to avoid opening files that do not
  // look like JSON.  The file must have an appropriate extension to be
  // recognized.
  std::string fname = filename;
  //
  bool                   extensionFound = false;
  std::string::size_type extensionPos = fname.rfind(".iwt");
  if (extensionPos != std::string::npos)
  {
    extensionFound = true;
  }

  if (!extensionFound)
  {
    itkDebugMacro(<< "The filename extension is not recognized");
    return false;
  }

  return true;
}

template <typename TParametersValueType>
void
WasmTransformIOTemplate<TParametersValueType>::ReadCBOR()
{
  FILE * file = fopen(this->GetFileName(), "rb");
  if (file == NULL)
  {
    itkExceptionMacro("Could not read file: " << this->GetFileName());
  }
  fseek(file, 0, SEEK_END);
  size_t length = (size_t)ftell(file);
  fseek(file, 0, SEEK_SET);
  unsigned char * cborBuffer = static_cast<unsigned char *>(malloc(length));
  if (!fread(cborBuffer, length, 1, file))
  {
    itkExceptionMacro("Could not successfully read " << this->GetFileName());
  }
  fclose(file);

  if (this->m_CBORRoot != nullptr)
  {
    cbor_decref(&(this->m_CBORRoot));
  }
  struct cbor_load_result result;
  this->m_CBORRoot = cbor_load(cborBuffer, length, &result);
  free(cborBuffer);
  if (result.error.code != CBOR_ERR_NONE)
  {
    std::string errorDescription;
    switch (result.error.code)
    {
      case CBOR_ERR_MALFORMATED:
      {
        errorDescription = "Malformed data\n";
        break;
      }
      case CBOR_ERR_MEMERROR:
      {
        errorDescription = "Memory error -- perhaps the input is too large?\n";
        break;
      }
      case CBOR_ERR_NODATA:
      {
        errorDescription = "The input is empty\n";
        break;
      }
      case CBOR_ERR_NOTENOUGHDATA:
      {
        errorDescription = "Data seem to be missing -- is the input complete?\n";
        break;
      }
      case CBOR_ERR_SYNTAXERROR:
      {
        errorDescription = "Syntactically malformed data -- see https://tools.ietf.org/html/rfc7049\n";
        break;
      }
      case CBOR_ERR_NONE:
      {
        break;
      }
    }
    itkExceptionMacro("" << errorDescription << "There was an error while reading the input near byte "
                         << result.error.position << " (read " << result.read << " bytes in total): ");
  }

  TransformListJSON transformListJSON;
  cbor_item_t *     index = this->m_CBORRoot;
  const size_t      transformCount = cbor_array_size(index);
  for (size_t ii = 0; ii < transformCount; ++ii)
  {
    const cbor_item_t *      transformItem = cbor_array_get(index, ii);
    const size_t             transformPropertyCount = cbor_map_size(transformItem);
    const struct cbor_pair * transformHandle = cbor_map_handle(transformItem);
    TransformJSON            transformJSON;
    for (size_t jj = 0; jj < transformPropertyCount; ++jj)
    {
      const std::string_view key(reinterpret_cast<char *>(cbor_string_handle(transformHandle[jj].key)),
                                 cbor_string_length(transformHandle[jj].key));
      if (key == "transformType")
      {
        const cbor_item_t *      transformTypeItem = transformHandle[jj].value;
        const size_t             transformTypePropertyCount = cbor_map_size(transformTypeItem);
        const struct cbor_pair * transformTypeHandle = cbor_map_handle(transformTypeItem);
        for (size_t kk = 0; kk < transformTypePropertyCount; ++kk)
        {
          const std::string_view transformTypeKey(
            reinterpret_cast<char *>(cbor_string_handle(transformTypeHandle[kk].key)),
            cbor_string_length(transformTypeHandle[kk].key));
          if (transformTypeKey == "transformParameterization")
          {
            const std::string transformParameterization(
              reinterpret_cast<char *>(cbor_string_handle(transformTypeHandle[kk].value)),
              cbor_string_length(transformTypeHandle[kk].value));
            if (transformParameterization == "Composite")
            {
              transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Composite;
            }
            else if (transformParameterization == "Identity")
            {
              transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Identity;
            }
            else if (transformParameterization == "Translation")
            {
              transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Translation;
            }
            else if (transformParameterization == "Euler2D")
            {
              transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Euler2D;
            }
            else if (transformParameterization == "Euler3D")
            {
              transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Euler3D;
            }
            else if (transformParameterization == "Rigid2D")
            {
              transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Rigid2D;
            }
            else if (transformParameterization == "Rigid3DPerspective")
            {
              transformJSON.transformType.transformParameterization =
                JSONTransformParameterizationEnum::Rigid3DPerspective;
            }
            else if (transformParameterization == "VersorRigid3D")
            {
              transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::VersorRigid3D;
            }
            else if (transformParameterization == "Versor")
            {
              transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Versor;
            }
            else if (transformParameterization == "ScaleLogarithmic")
            {
              transformJSON.transformType.transformParameterization =
                JSONTransformParameterizationEnum::ScaleLogarithmic;
            }
            else if (transformParameterization == "ScaleSkewVersor3D")
            {
              transformJSON.transformType.transformParameterization =
                JSONTransformParameterizationEnum::ScaleSkewVersor3D;
            }
            else if (transformParameterization == "Scale")
            {
              transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Scale;
            }
            else if (transformParameterization == "Similarity2D")
            {
              transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Similarity2D;
            }
            else if (transformParameterization == "Similarity3D")
            {
              transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Similarity3D;
            }
            else if (transformParameterization == "QuaternionRigid")
            {
              transformJSON.transformType.transformParameterization =
                JSONTransformParameterizationEnum::QuaternionRigid;
            }
            else if (transformParameterization == "Affine")
            {
              transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Affine;
            }
            else if (transformParameterization == "ScalableAffine")
            {
              transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::ScalableAffine;
            }
            else if (transformParameterization == "AzimuthElevationToCartesian")
            {
              transformJSON.transformType.transformParameterization =
                JSONTransformParameterizationEnum::AzimuthElevationToCartesian;
            }
            else if (transformParameterization == "BSpline")
            {
              transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::BSpline;
            }
            else if (transformParameterization == "BSplineSmoothingOnUpdateDisplacementField")
            {
              transformJSON.transformType.transformParameterization =
                JSONTransformParameterizationEnum::BSplineSmoothingOnUpdateDisplacementField;
            }
            else if (transformParameterization == "ConstantVelocityField")
            {
              transformJSON.transformType.transformParameterization =
                JSONTransformParameterizationEnum::ConstantVelocityField;
            }
            else if (transformParameterization == "DisplacementField")
            {
              transformJSON.transformType.transformParameterization =
                JSONTransformParameterizationEnum::DisplacementField;
            }
            else if (transformParameterization == "GaussianExponentialDiffeomorphic")
            {
              transformJSON.transformType.transformParameterization =
                JSONTransformParameterizationEnum::GaussianExponentialDiffeomorphic;
            }
            else if (transformParameterization == "GaussianSmoothingOnUpdateDisplacementField")
            {
              transformJSON.transformType.transformParameterization =
                JSONTransformParameterizationEnum::GaussianSmoothingOnUpdateDisplacementField;
            }
            else if (transformParameterization == "GaussianSmoothingOnUpdateTimeVaryingVelocityField")
            {
              transformJSON.transformType.transformParameterization =
                JSONTransformParameterizationEnum::GaussianSmoothingOnUpdateTimeVaryingVelocityField;
            }
            else if (transformParameterization == "TimeVaryingVelocityField")
            {
              transformJSON.transformType.transformParameterization =
                JSONTransformParameterizationEnum::TimeVaryingVelocityField;
            }
            else if (transformParameterization == "VelocityField")
            {
              transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::VelocityField;
            }
            else
            {
              itkExceptionMacro("Unexpected transformParameterization: " << transformParameterization);
            }
          }
          else if (transformTypeKey == "parametersValueType")
          {
            const std::string parametersValueType(
              reinterpret_cast<char *>(cbor_string_handle(transformTypeHandle[kk].value)),
              cbor_string_length(transformTypeHandle[kk].value));
            if (parametersValueType == "float32")
            {
              transformJSON.transformType.parametersValueType = JSONFloatTypesEnum::float32;
            }
            else if (parametersValueType == "float64")
            {
              transformJSON.transformType.parametersValueType = JSONFloatTypesEnum::float64;
            }
            else
            {
              itkExceptionMacro("Unexpected parametersValueType: " << parametersValueType);
            }
          }
          else if (transformTypeKey == "inputDimension")
          {
            const auto inputDimension = cbor_get_uint32(transformTypeHandle[kk].value);
            transformJSON.transformType.inputDimension = inputDimension;
          }
          else if (transformTypeKey == "outputDimension")
          {
            const auto outputDimension = cbor_get_uint32(transformTypeHandle[kk].value);
            transformJSON.transformType.outputDimension = outputDimension;
          }
          else
          {
            itkExceptionMacro("Unexpected transformType cbor map key: " << transformTypeKey);
          }
        }
      }
      else if (key == "numberOfFixedParameters")
      {
        const auto numberOfFixedParameters = cbor_get_uint64(transformHandle[jj].value);
        transformJSON.numberOfFixedParameters = numberOfFixedParameters;
      }
      else if (key == "numberOfParameters")
      {
        const auto numberOfParameters = cbor_get_uint64(transformHandle[jj].value);
        transformJSON.numberOfParameters = numberOfParameters;
      }
      else if (key == "name")
      {
        const std::string name(reinterpret_cast<char *>(cbor_string_handle(transformHandle[jj].value)),
                               cbor_string_length(transformHandle[jj].value));
        transformJSON.name = name;
      }
      else if (key == "inputSpaceName")
      {
        const std::string inputSpaceName(reinterpret_cast<char *>(cbor_string_handle(transformHandle[jj].value)),
                                         cbor_string_length(transformHandle[jj].value));
        transformJSON.inputSpaceName = inputSpaceName;
      }
      else if (key == "outputSpaceName")
      {
        const std::string outputSpaceName(reinterpret_cast<char *>(cbor_string_handle(transformHandle[jj].value)),
                                          cbor_string_length(transformHandle[jj].value));
        transformJSON.outputSpaceName = outputSpaceName;
      }
    }
    transformListJSON.push_back(transformJSON);
  }

  this->SetJSON(transformListJSON);

  auto         readTransformList = this->GetReadTransformList();
  unsigned int count = 0;
  for (auto [transformIt, jsonIt] = std::tuple{ readTransformList.begin(), transformListJSON.begin() };
       transformIt != readTransformList.end();
       ++transformIt, ++jsonIt)
  {
    const auto          transformJSON = *jsonIt;
    if (transformJSON.transformType.transformParameterization == JSONTransformParameterizationEnum::Composite)
    {
      ++count;
      continue;
    }
    FixedParametersType fixedParams(transformJSON.numberOfFixedParameters);
    const SizeValueType numberOfFixedBytes = transformJSON.numberOfFixedParameters * sizeof(FixedParametersValueType);
    ParametersType      params(transformJSON.numberOfParameters);
    const SizeValueType numberOfBytes = transformJSON.numberOfParameters * sizeof(ParametersValueType);
    const auto          valueBytes = sizeof(ParametersValueType);

    const cbor_item_t *      transformItem = cbor_array_get(index, count);
    const size_t             transformPropertyCount = cbor_map_size(transformItem);
    const struct cbor_pair * transformHandle = cbor_map_handle(transformItem);
    for (size_t jj = 0; jj < transformPropertyCount; ++jj)
    {
      const std::string_view key(reinterpret_cast<char *>(cbor_string_handle(transformHandle[jj].key)),
                                 cbor_string_length(transformHandle[jj].key));
      if (key == "fixedParameters")
      {
        readCBORBuffer(transformItem, "fixedParameters", fixedParams.data_block(), numberOfFixedBytes);
        (*transformIt)->SetFixedParameters(fixedParams);
      }
      else if (key == "parameters")
      {
        if (transformJSON.transformType.parametersValueType == JSONFloatTypesEnum::float32)
        {
          if (valueBytes != sizeof(float))
          {
            std::vector<float> floatParams(transformJSON.numberOfParameters);
            readCBORBuffer(transformItem, "parameters", floatParams.data(), numberOfBytes);
            for (SizeValueType i = 0; i < transformJSON.numberOfParameters; ++i)
            {
              params[i] = static_cast<ParametersValueType>(floatParams[i]);
            }
          }
          else
          {
            readCBORBuffer(transformItem, "parameters", params.data_block(), numberOfBytes);
          }
        }
        else if (transformJSON.transformType.parametersValueType == JSONFloatTypesEnum::float64)
        {
          if (valueBytes != sizeof(double))
          {
            std::vector<double> doubleParams(transformJSON.numberOfParameters);
            readCBORBuffer(transformItem, "parameters", doubleParams.data(), numberOfBytes);
            for (SizeValueType i = 0; i < transformJSON.numberOfParameters; ++i)
            {
              params[i] = static_cast<ParametersValueType>(doubleParams[i]);
            }
          }
          else
          {
            readCBORBuffer(transformItem, "parameters", params.data_block(), numberOfBytes);
          }
        }
        (*transformIt)->SetParameters(params);
      }
    }
    ++count;
  }
}

template <typename TParametersValueType>
auto
WasmTransformIOTemplate<TParametersValueType>::GetJSON() -> TransformListJSON
{
  ConstTransformListType & transformList = this->GetWriteTransformList();

  constexpr bool inMemory = false;
  TransformListJSON transformListJSON = transformListToTransformListJSON<TransformType>(transformList, inMemory);
  return transformListJSON;
}

template <typename TParametersValueType>
void
WasmTransformIOTemplate<TParametersValueType>::SetJSON(const TransformListJSON & json)
{
  // iterate over the JSON and set the transform list
  TransformListType transformList;
  for (const auto & transformJSON : json)
  {
    std::string transformPrecision;
    switch (transformJSON.transformType.parametersValueType)
    {
      case JSONFloatTypesEnum::float32:
      {
        transformPrecision = "float";
        break;
      }
      case JSONFloatTypesEnum::float64:
      {
        transformPrecision = "double";
        break;
      }
      default:
      {
        itkExceptionMacro("Unknown parameters value type");
      }
    }
    const std::string transformParameterization = transformParameterizationString(transformJSON.transformType);
    // itk::Transform<TParametersValueType, VInputDimension, VOutputDimension>::GetTransformTypeAsString() returns the
    // transform type string Note: non-cubic B-Splines not supported
    std::string transformType = transformParameterization + "Transform_" + transformPrecision + "_" +
                                std::to_string(transformJSON.transformType.inputDimension) + "_" +
                                std::to_string(transformJSON.transformType.outputDimension);
    // Transform name should be modified to have the output precision type.
    Superclass::CorrectTransformPrecisionType(transformType);

    TransformPointer transform;
    this->CreateTransform(transform, transformType);
    transform->SetObjectName(transformJSON.name);
    // todo: ITK 5.4.1
    // transform->SetInputSpaceName(transformJSON.inputSpaceName);
    // transform->SetOutputSpaceName(transformJSON.outputSpaceName);
    this->GetReadTransformList().push_back(transform);
  }
}

template <typename TParametersValueType>
void
WasmTransformIOTemplate<TParametersValueType>::WriteCBOR()
{
  auto transformListJSON = this->GetJSON();

  if (this->m_CBORRoot != nullptr)
  {
    cbor_decref(&(this->m_CBORRoot));
  }
  // create a container for a javascript array
  this->m_CBORRoot = cbor_new_definite_array(transformListJSON.size());

  unsigned int  count = 0;
  cbor_item_t * index = this->m_CBORRoot;
  // write the transformListJSON into the cbor array
  ConstTransformListType & writeTransformList = this->GetWriteTransformList();
  const std::string    compositeTransformType = writeTransformList.front()->GetTransformTypeAsString();
  CompositeTransformIOHelperTemplate<TParametersValueType> helper;

  //
  // if the first transform in the list is a
  // composite transform, use its internal list
  // instead of the IO
  if (compositeTransformType.find("CompositeTransform") != std::string::npos)
  {
    writeTransformList = helper.GetTransformList(writeTransformList.front().GetPointer());
  }

  for (auto [transformIt, jsonIt] = std::tuple{ writeTransformList.begin(), transformListJSON.begin() };
       transformIt != writeTransformList.end();
       ++transformIt, ++jsonIt)
  {
    const auto &  transformJSON = *jsonIt;
    cbor_item_t * transformItem = cbor_new_definite_map(8);
    cbor_item_t * transformTypeItem = cbor_new_definite_map(4);

    const std::string transformParameterization = transformParameterizationString(transformJSON.transformType);
    cbor_map_add(transformTypeItem,
                 cbor_pair{ cbor_move(cbor_build_string("transformParameterization")),
                            cbor_move(cbor_build_string(transformParameterization.c_str())) });
    switch (transformJSON.transformType.parametersValueType)
    {
      case JSONFloatTypesEnum::float32:
      {
        cbor_map_add(
          transformTypeItem,
          cbor_pair{ cbor_move(cbor_build_string("parametersValueType")), cbor_move(cbor_build_string("float32")) });
        break;
      }
      case JSONFloatTypesEnum::float64:
      {
        cbor_map_add(
          transformTypeItem,
          cbor_pair{ cbor_move(cbor_build_string("parametersValueType")), cbor_move(cbor_build_string("float64")) });
        break;
      }
      default:
      {
        itkExceptionMacro("Unknown parameters value type");
      }
    }
    cbor_map_add(transformTypeItem,
                 cbor_pair{ cbor_move(cbor_build_string("inputDimension")),
                            cbor_move(cbor_build_uint32(transformJSON.transformType.inputDimension)) });
    cbor_map_add(transformTypeItem,
                 cbor_pair{ cbor_move(cbor_build_string("outputDimension")),
                            cbor_move(cbor_build_uint32(transformJSON.transformType.outputDimension)) });
    cbor_map_add(transformItem,
                 cbor_pair{ cbor_move(cbor_build_string("transformType")), cbor_move(transformTypeItem) });

    cbor_map_add(transformItem,
                 cbor_pair{ cbor_move(cbor_build_string("numberOfFixedParameters")),
                            cbor_move(cbor_build_uint64(transformJSON.numberOfFixedParameters)) });
    cbor_map_add(transformItem,
                 cbor_pair{ cbor_move(cbor_build_string("numberOfParameters")),
                            cbor_move(cbor_build_uint64(transformJSON.numberOfParameters)) });
    cbor_map_add(
      transformItem,
      cbor_pair{ cbor_move(cbor_build_string("name")), cbor_move(cbor_build_string(transformJSON.name.c_str())) });
    cbor_map_add(transformItem,
                 cbor_pair{ cbor_move(cbor_build_string("inputSpaceName")),
                            cbor_move(cbor_build_string(transformJSON.inputSpaceName.c_str())) });
    cbor_map_add(transformItem,
                 cbor_pair{ cbor_move(cbor_build_string("outputSpaceName")),
                            cbor_move(cbor_build_string(transformJSON.outputSpaceName.c_str())) });

    if (transformJSON.transformType.transformParameterization == JSONTransformParameterizationEnum::Composite)
    {
      cbor_array_push(index, cbor_move(transformItem));
      ++count;
      continue;
    }
    const auto fixedNumberOfBytes = transformJSON.numberOfFixedParameters * sizeof(FixedParametersValueType);
    const auto fixedParams = (*transformIt)->GetFixedParameters();
    writeCBORBuffer(transformItem,
                    "fixedParameters",
                    reinterpret_cast<const void *>(fixedParams.data_block()),
                    fixedNumberOfBytes,
                    IOComponentEnum::DOUBLE);
    const auto numberOfBytes = transformJSON.numberOfParameters * sizeof(ParametersValueType);
    const auto params = (*transformIt)->GetParameters();
    if (transformJSON.transformType.parametersValueType == JSONFloatTypesEnum::float32)
    {
      writeCBORBuffer(transformItem,
                      "parameters",
                      reinterpret_cast<const void *>(params.data_block()),
                      numberOfBytes,
                      IOComponentEnum::FLOAT);
    }
    else if (transformJSON.transformType.parametersValueType == JSONFloatTypesEnum::float64)
    {
      writeCBORBuffer(transformItem,
                      "parameters",
                      reinterpret_cast<const void *>(params.data_block()),
                      numberOfBytes,
                      IOComponentEnum::DOUBLE);
    }

    cbor_array_push(index, cbor_move(transformItem));

    ++count;
  }

  unsigned char * cborBuffer;
  size_t          cborBufferSize;
  size_t          length = cbor_serialize_alloc(this->m_CBORRoot, &cborBuffer, &cborBufferSize);

  FILE * file = fopen(this->GetFileName(), "wb");
  fwrite(cborBuffer, 1, length, file);
  free(cborBuffer);
  fclose(file);

  cbor_decref(&(this->m_CBORRoot));
}

template <typename TParametersValueType>
auto
WasmTransformIOTemplate<TParametersValueType>::ReadTransformInformation() -> const TransformListJSON
{
  const std::string path = this->GetFileName();
  const auto        indexPath = path + "/index.json";
  const auto        dataPath = path + "/data";

  std::ifstream inputStream;
  openFileForReading(inputStream, indexPath.c_str(), true);
  std::string str((std::istreambuf_iterator<char>(inputStream)), std::istreambuf_iterator<char>());
  auto        deserializedAttempt = glz::read_json<itk::TransformListJSON>(str);
  if (!deserializedAttempt)
  {
    itkExceptionMacro("Failed to deserialize TransformListJSON");
  }
  auto transformListJSON = deserializedAttempt.value();

  this->SetJSON(transformListJSON);

  return transformListJSON;
}

template <typename TParametersValueType>
void
WasmTransformIOTemplate<TParametersValueType>::ReadFixedParameters(const TransformListJSON & json)
{
  auto         readTransformList = this->GetReadTransformList();
  unsigned int count = 0;
  for (auto [transformIt, jsonIt] = std::tuple{ readTransformList.begin(), json.begin() };
       transformIt != readTransformList.end();
       ++transformIt, ++jsonIt)
  {
    const auto          transformJSON = *jsonIt;
    if ((*jsonIt).transformType.transformParameterization == itk::JSONTransformParameterizationEnum::Composite)
    {
      ++count;
      continue;
    }
    FixedParametersType fixedParams(transformJSON.numberOfFixedParameters);
    const SizeValueType numberOfBytes = transformJSON.numberOfFixedParameters * sizeof(FixedParametersValueType);

    std::string path(this->GetFileName());
    path = path + "/data/" + std::to_string(count);
    const std::string filePath = path + "/fixed-parameters.raw";
    std::ifstream     dataStream;
    openFileForReading(dataStream, filePath.c_str());
    dataStream.read(reinterpret_cast<char *>(fixedParams.data_block()), numberOfBytes);
    const auto readBytes = dataStream.gcount();
    if (readBytes != numberOfBytes)
    {
      itkExceptionMacro(<< "Read failed: Wanted " << numberOfBytes << " bytes, but read " << readBytes << " bytes.");
    }
    (*transformIt)->SetFixedParameters(fixedParams);
    ++count;
  }
}

template <typename TParametersValueType>
void
WasmTransformIOTemplate<TParametersValueType>::ReadParameters(const TransformListJSON & json)
{
  auto         readTransformList = this->GetReadTransformList();
  unsigned int count = 0;
  for (auto [transformIt, jsonIt] = std::tuple{ readTransformList.begin(), json.begin() };
       transformIt != readTransformList.end();
       ++transformIt, ++jsonIt)
  {
    if ((*jsonIt).transformType.transformParameterization == itk::JSONTransformParameterizationEnum::Composite)
    {
      ++count;
      continue;
    }
    const auto          transformJSON = *jsonIt;
    ParametersType      params(transformJSON.numberOfParameters);
    const auto          valueBytes = sizeof(ParametersValueType);
    const SizeValueType numberOfBytes = transformJSON.numberOfParameters * valueBytes;

    std::string path(this->GetFileName());
    path = path + "/data/" + std::to_string(count);
    const std::string filePath = path + "/parameters.raw";
    std::ifstream     dataStream;
    openFileForReading(dataStream, filePath.c_str());
    if (transformJSON.transformType.parametersValueType == JSONFloatTypesEnum::float32)
    {
      if (valueBytes != sizeof(float))
      {
        std::vector<float> floatParams(transformJSON.numberOfParameters);
        dataStream.read(reinterpret_cast<char *>(floatParams.data()), numberOfBytes);
        for (SizeValueType i = 0; i < transformJSON.numberOfParameters; ++i)
        {
          params[i] = static_cast<ParametersValueType>(floatParams[i]);
        }
      }
      else
      {
        dataStream.read(reinterpret_cast<char *>(params.data_block()), numberOfBytes);
      }
    }
    else if (transformJSON.transformType.parametersValueType == JSONFloatTypesEnum::float64)
    {
      if (valueBytes != sizeof(double))
      {
        std::vector<double> doubleParams(transformJSON.numberOfParameters);
        dataStream.read(reinterpret_cast<char *>(doubleParams.data()), numberOfBytes);
        for (SizeValueType i = 0; i < transformJSON.numberOfParameters; ++i)
        {
          params[i] = static_cast<ParametersValueType>(doubleParams[i]);
        }
      }
      else
      {
        dataStream.read(reinterpret_cast<char *>(params.data_block()), numberOfBytes);
      }
    }
    else
    {
      itkExceptionMacro("Unknown parameters value type");
    }
    (*transformIt)->SetParameters(params);
    ++count;
  }
}

template <typename TParametersValueType>
void
WasmTransformIOTemplate<TParametersValueType>::Read()
{
  if (fileNameIsCBOR(this->GetFileName()))
  {
    this->ReadCBOR();
    return;
  }

  const auto json = this->ReadTransformInformation();
  this->ReadFixedParameters(json);
  this->ReadParameters(json);
}

template <typename TParametersValueType>
bool
WasmTransformIOTemplate<TParametersValueType>::CanWriteFile(const char * name)
{
  std::string filename = name;

  if (filename == "")
  {
    return false;
  }

  bool                   extensionFound = false;
  std::string::size_type extensionPos = filename.rfind(".iwt");
  if (extensionPos != std::string::npos)
  {
    extensionFound = true;
  }

  if (!extensionFound)
  {
    itkDebugMacro(<< "The filename extension is not recognized");
    return false;
  }

  return true;
}

template <typename TParametersValueType>
void
WasmTransformIOTemplate<TParametersValueType>::WriteTransformInformation()
{
  const std::string path = this->GetFileName();
  const auto        indexPath = path + "/index.json";
  const auto        dataPath = path + "/data";
  if (!itksys::SystemTools::FileExists(path, false))
  {
    itksys::SystemTools::MakeDirectory(path);
  }
  if (!itksys::SystemTools::FileExists(dataPath, false))
  {
    itksys::SystemTools::MakeDirectory(dataPath);
  }

  auto transformListJSON = this->GetJSON();

  std::string serialized{};
  auto ec = glz::write<glz::opts{ .prettify = true }>(transformListJSON, serialized);
  if (ec)
  {
    itkExceptionMacro("Failed to serialize TransformListJSON");
  }
  std::ofstream outputStream;
  openFileForWriting(outputStream, indexPath.c_str(), true, true);
  outputStream << serialized;
  outputStream.close();
}

template <typename TParametersValueType>
void
WasmTransformIOTemplate<TParametersValueType>::WriteFixedParameters()
{
  ConstTransformListType & transformList = this->GetWriteTransformList();
  std::string              compositeTransformType = transformList.front()->GetTransformTypeAsString();
  CompositeTransformIOHelperTemplate<TParametersValueType> helper;

  //
  // if the first transform in the list is a
  // composite transform, use its internal list
  // instead of the IO
  if (compositeTransformType.find("CompositeTransform") != std::string::npos)
  {
    transformList = helper.GetTransformList(transformList.front().GetPointer());
  }

  unsigned int                                    count = 0;
  typename ConstTransformListType::const_iterator end = transformList.end();
  for (typename ConstTransformListType::const_iterator it = transformList.begin(); it != end; ++it, ++count)
  {
    const TransformType * currentTransform = it->GetPointer();
    if (currentTransform->GetTransformTypeAsString().find("CompositeTransform") != std::string::npos)
    {
      continue;
    }
    auto                  fixedParams = currentTransform->GetFixedParameters();
    // Fixed parameters are always double per itk::TransformBaseTemplate
    const SizeValueType numberOfBytes = fixedParams.Size() * sizeof(FixedParametersValueType);

    std::string path(this->GetFileName());
    path = path + "/data/" + std::to_string(count);
    const std::string filePath = path + "/fixed-parameters.raw";
    if (!itksys::SystemTools::FileExists(path, false))
    {
      itksys::SystemTools::MakeDirectory(path);
    }

    std::ofstream outputStream;
    openFileForWriting(outputStream, filePath, true, false);
    outputStream.write(reinterpret_cast<const char *>(fixedParams.data_block()), numberOfBytes);
    if (outputStream.tellp() != numberOfBytes)
    {
      itkExceptionMacro(<< "Write failed: Wanted to write " << numberOfBytes << " bytes, but wrote "
                        << outputStream.tellp() << " bytes.");
    }
  }
}

template <typename TParametersValueType>
void
WasmTransformIOTemplate<TParametersValueType>::WriteParameters()
{
  ConstTransformListType & transformList = this->GetWriteTransformList();
  std::string              compositeTransformType = transformList.front()->GetTransformTypeAsString();
  CompositeTransformIOHelperTemplate<TParametersValueType> helper;

  //
  // if the first transform in the list is a
  // composite transform, use its internal list
  // instead of the IO
  if (compositeTransformType.find("CompositeTransform") != std::string::npos)
  {
    transformList = helper.GetTransformList(transformList.front().GetPointer());
  }

  unsigned int                                    count = 0;
  typename ConstTransformListType::const_iterator end = transformList.end();
  for (typename ConstTransformListType::const_iterator it = transformList.begin(); it != end; ++it, ++count)
  {
    const TransformType * currentTransform = it->GetPointer();
    if (currentTransform->GetTransformTypeAsString().find("CompositeTransform") != std::string::npos)
    {
      continue;
    }
    auto                  params = currentTransform->GetParameters();
    const SizeValueType   numberOfBytes = params.Size() * sizeof(ParametersValueType);

    std::string path(this->GetFileName());
    path = path + "/data/" + std::to_string(count);
    const std::string filePath = path + "/parameters.raw";
    if (!itksys::SystemTools::FileExists(path, false))
    {
      itksys::SystemTools::MakeDirectory(path);
    }

    std::ofstream outputStream;
    openFileForWriting(outputStream, filePath, true, false);
    outputStream.write(reinterpret_cast<const char *>(params.data_block()), numberOfBytes);
    if (outputStream.tellp() != numberOfBytes)
    {
      itkExceptionMacro(<< "Write failed: Wanted to write " << numberOfBytes << " bytes, but wrote "
                        << outputStream.tellp() << " bytes.");
    }
  }
}

template <typename TParametersValueType>
void
WasmTransformIOTemplate<TParametersValueType>::Write()
{
  if (fileNameIsCBOR(this->GetFileName()))
  {
    this->WriteCBOR();
    return;
  }

  this->WriteTransformInformation();
  this->WriteFixedParameters();
  this->WriteParameters();
}

ITK_GCC_PRAGMA_DIAG_PUSH()
ITK_GCC_PRAGMA_DIAG(ignored "-Wattributes")

template class WebAssemblyInterface_EXPORT WasmTransformIOTemplate<double>;
template class WebAssemblyInterface_EXPORT WasmTransformIOTemplate<float>;

ITK_GCC_PRAGMA_DIAG_POP()

} // end namespace itk

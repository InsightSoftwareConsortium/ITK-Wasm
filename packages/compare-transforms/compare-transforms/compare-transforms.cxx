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

#include "itkPipeline.h"
#include "itkInputTransform.h"
#include "itkOutputTextStream.h"
#include "itkSupportInputTransformTypes.h"

#include "rapidjson/document.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"

#include <cmath>
#include <algorithm>

template <typename TTransform>
std::tuple<bool, bool, bool, double, double>
compareTransforms(const TTransform * transform0,
                  const TTransform * transform1,
                  const double       parametersTolerance,
                  const double       fixedParametersTolerance)
{
  bool almostEqual = false;
  bool parametersAlmostEqual = false;
  bool fixedParametersAlmostEqual = false;
  double parametersMaximumDifference = 0.0;
  double fixedParametersMaximumDifference = 0.0;

  if (transform0 != nullptr && transform1 != nullptr)
  {
    // Check transform types
    if (transform0->GetTransformTypeAsString() != transform1->GetTransformTypeAsString())
    {
      return std::make_tuple(false, false, false, 
                            itk::NumericTraits<double>::max(), 
                            itk::NumericTraits<double>::max());
    }

    // Compare parameters
    const auto parameters0 = transform0->GetParameters();
    const auto parameters1 = transform1->GetParameters();
    
    if (parameters0.GetSize() == parameters1.GetSize())
    {
      parametersAlmostEqual = true;
      for (unsigned int i = 0; i < parameters0.GetSize(); ++i)
      {
        const double difference = std::abs(parameters0[i] - parameters1[i]);
        parametersMaximumDifference = std::max(parametersMaximumDifference, difference);
        if (difference > parametersTolerance)
        {
          parametersAlmostEqual = false;
        }
      }
    }

    // Compare fixed parameters
    const auto fixedParameters0 = transform0->GetFixedParameters();
    const auto fixedParameters1 = transform1->GetFixedParameters();
    
    if (fixedParameters0.GetSize() == fixedParameters1.GetSize())
    {
      fixedParametersAlmostEqual = true;
      for (unsigned int i = 0; i < fixedParameters0.GetSize(); ++i)
      {
        const double difference = std::abs(fixedParameters0[i] - fixedParameters1[i]);
        fixedParametersMaximumDifference = std::max(fixedParametersMaximumDifference, difference);
        if (difference > fixedParametersTolerance)
        {
          fixedParametersAlmostEqual = false;
        }
      }
    }

    almostEqual = parametersAlmostEqual && fixedParametersAlmostEqual;
  }

  return std::make_tuple(almostEqual, parametersAlmostEqual, fixedParametersAlmostEqual,
                        parametersMaximumDifference, fixedParametersMaximumDifference);
}

template <typename TTransform>
int
compareTransformsFunction(itk::wasm::Pipeline & pipeline)
{
  using TransformType = TTransform;

  using ParametersValueType = typename TransformType::ParametersValueType;

  itk::wasm::InputTransform<TransformType> testTransformInput;
  pipeline.get_option("test-transform")->required()->type_name("INPUT_TRANSFORM");

  std::vector<itk::wasm::InputTransform<TransformType>> baselineTransformsInput;
  pipeline.get_option("baseline-transforms")->required()->type_name("INPUT_TRANSFORM");

  ParametersValueType parametersTolerance = 1e-7;
  pipeline.get_option("parameters-tolerance")->type_name("FLOAT");

  ParametersValueType fixedParametersTolerance = 1e-7;
  pipeline.get_option("fixed-parameters-tolerance")->type_name("FLOAT");

  itk::wasm::OutputTextStream metricsStream;
  pipeline.get_option("metrics")->type_name("OUTPUT_JSON");

  ITK_WASM_PARSE(pipeline);

  const TransformType * testTransform = testTransformInput.Get();

  rapidjson::Document document;
  document.SetObject();
  rapidjson::Document::AllocatorType& allocator = document.GetAllocator();

  bool almostEqual = false;
  bool parametersAlmostEqual = false;
  bool fixedParametersAlmostEqual = false;
  double parametersMaximumDifference = itk::NumericTraits<double>::max();
  double fixedParametersMaximumDifference = itk::NumericTraits<double>::max();

  // Compare with baseline transforms
  for (const auto & baselineTransformInput : baselineTransformsInput)
  {
    const TransformType * baselineTransform = baselineTransformInput.Get();
    
    auto [currentAlmostEqual, currentParametersAlmostEqual, currentFixedParametersAlmostEqual,
          currentParametersMaxDiff, currentFixedParametersMaxDiff] = 
          compareTransforms(testTransform, baselineTransform, parametersTolerance, fixedParametersTolerance);

    if (currentAlmostEqual)
    {
      almostEqual = true;
      parametersAlmostEqual = currentParametersAlmostEqual;
      fixedParametersAlmostEqual = currentFixedParametersAlmostEqual;
      parametersMaximumDifference = currentParametersMaxDiff;
      fixedParametersMaximumDifference = currentFixedParametersMaxDiff;
      break; // Found a match
    }
    else
    {
      // Keep track of closest match
      if (currentParametersMaxDiff < parametersMaximumDifference)
      {
        parametersMaximumDifference = currentParametersMaxDiff;
        parametersAlmostEqual = currentParametersAlmostEqual;
      }
      if (currentFixedParametersMaxDiff < fixedParametersMaximumDifference)
      {
        fixedParametersMaximumDifference = currentFixedParametersMaxDiff;
        fixedParametersAlmostEqual = currentFixedParametersAlmostEqual;
      }
    }
  }

  // Create metrics JSON
  document.AddMember("almostEqual", almostEqual, allocator);
  
  rapidjson::Value parametersObject(rapidjson::kObjectType);
  parametersObject.AddMember("almostEqual", parametersAlmostEqual, allocator);
  parametersObject.AddMember("maximumDifference", parametersMaximumDifference, allocator);
  document.AddMember("parameters", parametersObject, allocator);

  rapidjson::Value fixedParametersObject(rapidjson::kObjectType);
  fixedParametersObject.AddMember("almostEqual", fixedParametersAlmostEqual, allocator);
  fixedParametersObject.AddMember("maximumDifference", fixedParametersMaximumDifference, allocator);
  document.AddMember("fixedParameters", fixedParametersObject, allocator);

  rapidjson::StringBuffer stringBuffer;
  rapidjson::Writer<rapidjson::StringBuffer> writer(stringBuffer);
  document.Accept(writer);

  metricsStream.Get() << stringBuffer.GetString();

  return EXIT_SUCCESS;
}

template <typename TTransformList>
int
compareTransformListsFunction(itk::wasm::Pipeline & pipeline)
{
  using TransformListType = TTransformList;
  using TransformType = typename TransformListType::value_type;
  using ParametersValueType = typename TransformType::ParametersValueType;

  itk::wasm::InputTransform<TransformListType> testTransformListInput;
  pipeline.get_option("test-transform-list")->required()->type_name("INPUT_TRANSFORM");

  std::vector<itk::wasm::InputTransform<TransformListType>> baselineTransformListsInput;
  pipeline.get_option("baseline-transform-lists")->required()->type_name("INPUT_TRANSFORM");

  ParametersValueType parametersTolerance = 1e-7;
  pipeline.get_option("parameters-tolerance")->type_name("FLOAT");

  ParametersValueType fixedParametersTolerance = 1e-7;
  pipeline.get_option("fixed-parameters-tolerance")->type_name("FLOAT");

  itk::wasm::OutputTextStream metricsStream;
  pipeline.get_option("metrics")->type_name("OUTPUT_JSON");

  ITK_WASM_PARSE(pipeline);

  const TransformListType * testTransformList = testTransformListInput.Get();

  rapidjson::Document document;
  document.SetObject();
  rapidjson::Document::AllocatorType& allocator = document.GetAllocator();

  bool almostEqual = false;
  bool allTransformsAlmostEqual = false;

  // Compare with baseline transform lists
  for (const auto & baselineTransformListInput : baselineTransformListsInput)
  {
    const TransformListType * baselineTransformList = baselineTransformListInput.Get();
    
    if (testTransformList->size() != baselineTransformList->size())
    {
      continue; // Different number of transforms
    }

    bool currentListAlmostEqual = true;
    for (size_t i = 0; i < testTransformList->size(); ++i)
    {
      auto [transformAlmostEqual, parametersAlmostEqual, fixedParametersAlmostEqual,
            parametersMaxDiff, fixedParametersMaxDiff] = 
            compareTransforms((*testTransformList)[i].GetPointer(), 
                            (*baselineTransformList)[i].GetPointer(), 
                            parametersTolerance, fixedParametersTolerance);
      
      if (!transformAlmostEqual)
      {
        currentListAlmostEqual = false;
        break;
      }
    }

    if (currentListAlmostEqual)
    {
      almostEqual = true;
      allTransformsAlmostEqual = true;
      break;
    }
  }

  // Create metrics JSON
  document.AddMember("almostEqual", almostEqual, allocator);
  document.AddMember("allTransformsAlmostEqual", allTransformsAlmostEqual, allocator);

  rapidjson::StringBuffer stringBuffer;
  rapidjson::Writer<rapidjson::StringBuffer> writer(stringBuffer);
  document.Accept(writer);

  metricsStream.Get() << stringBuffer.GetString();

  return EXIT_SUCCESS;
}

int
main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("compare-transforms", "Compare transforms with a tolerance for regression testing.", argc, argv);

  return itk::wasm::SupportInputTransformTypes<compareTransformsFunction, 3>("test-transform", pipeline);
}

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
#include "itkTransformJSON.h"
#include "itkTestingMacros.h"

#include <iostream>

int
itkTransformJSONTest(int argc, char * argv[])
{

  itk::JSONTransformParameterizationEnum parameterization = itk::JSONTransformParameterizationEnum::Affine;
  itk::JSONFloatTypesEnum floatType = itk::JSONFloatTypesEnum::float64;

  itk::TransformTypeJSON transformType{parameterization, floatType, 3, 3};

  itk::TransformJSON transform{transformType, 3, 12};

  itk::TransformListJSON transformList{ transform };

  std::string serialized{};
  auto ec = glz::write<glz::opts{.prettify = true}>(transformList, serialized);
  if (ec)
  {
    std::cerr << "Failed to serialize TransformListJSON" << std::endl;
    return EXIT_FAILURE;
  }
  std::cout << serialized << std::endl;

  auto deserializedAttempt = glz::read_json<itk::TransformListJSON>(serialized);
  if (!deserializedAttempt)
  {
    std::cerr << "Failed to deserialize TransformListJSON" << std::endl;
    return EXIT_FAILURE;
  }

  auto deserialized = deserializedAttempt.value();

  ITK_TEST_EXPECT_EQUAL(deserialized.size(), 1);
  const auto & deserializedTransform = deserialized.front();
  ITK_TEST_EXPECT_TRUE(deserializedTransform.transformType.transformParameterization == itk::JSONTransformParameterizationEnum::Affine);
  ITK_TEST_EXPECT_TRUE(deserializedTransform.transformType.parametersValueType == itk::JSONFloatTypesEnum::float64);
  ITK_TEST_EXPECT_EQUAL(deserializedTransform.transformType.inputDimension, 3);
  ITK_TEST_EXPECT_EQUAL(deserializedTransform.transformType.outputDimension, 3);
  ITK_TEST_EXPECT_EQUAL(deserializedTransform.numberOfFixedParameters, 3);
  ITK_TEST_EXPECT_EQUAL(deserializedTransform.numberOfParameters, 12);

  return EXIT_SUCCESS;
}

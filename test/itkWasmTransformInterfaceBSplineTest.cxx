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
#include "itkTransformToWasmTransformFilter.h"
#include "itkWasmTransformToTransformFilter.h"

#include "itkAffineTransform.h"
#include "itkBSplineTransform.h"
#include "itkCompositeTransform.h"
#include "itkTestingMacros.h"

// A B-spline round trip through the Wasm transform interface. Unlike the other
// parameterizations, itk::BSplineTransform does not size the base
// m_Parameters, so filling it with CopyInParameters overruns a zero-length
// buffer. The composite mirrors what a rigid -> affine -> bspline registration
// produces.
int
itkWasmTransformInterfaceBSplineTest(int, char *[])
{
  constexpr unsigned int Dimension = 2;
  constexpr unsigned int SplineOrder = 3;
  using ParametersValueType = double;
  using BSplineTransformType = itk::BSplineTransform<ParametersValueType, Dimension, SplineOrder>;
  using AffineTransformType = itk::AffineTransform<ParametersValueType, Dimension>;
  using TransformType = itk::CompositeTransform<ParametersValueType, Dimension>;

  auto bsplineTransform = BSplineTransformType::New();
  BSplineTransformType::OriginType meshOrigin;
  meshOrigin.Fill(0.0);
  BSplineTransformType::PhysicalDimensionsType meshPhysicalDimensions;
  meshPhysicalDimensions.Fill(64.0);
  BSplineTransformType::DirectionType meshDirection;
  meshDirection.SetIdentity();
  BSplineTransformType::MeshSizeType meshSize;
  meshSize.Fill(4);
  bsplineTransform->SetTransformDomainOrigin(meshOrigin);
  bsplineTransform->SetTransformDomainPhysicalDimensions(meshPhysicalDimensions);
  bsplineTransform->SetTransformDomainDirection(meshDirection);
  bsplineTransform->SetTransformDomainMeshSize(meshSize);

  // Vary the coefficients so a parameter ordering error would change the mapping.
  BSplineTransformType::ParametersType coefficients(bsplineTransform->GetNumberOfParameters());
  for (unsigned int i = 0; i < coefficients.Size(); ++i)
  {
    coefficients[i] = 0.25 * static_cast<ParametersValueType>(i % 17) - 2.0;
  }
  bsplineTransform->SetParametersByValue(coefficients);

  auto affineTransform = AffineTransformType::New();
  AffineTransformType::OutputVectorType translation;
  translation[0] = 3.0;
  translation[1] = -1.5;
  affineTransform->Translate(translation);

  auto inputTransform = TransformType::New();
  inputTransform->AddTransform(affineTransform);
  inputTransform->AddTransform(bsplineTransform);

  using TransformToWasmTransformFilterType = itk::TransformToWasmTransformFilter<TransformType>;
  auto transformToJSONFilter = TransformToWasmTransformFilterType::New();
  transformToJSONFilter->SetTransform(inputTransform);
  ITK_TRY_EXPECT_NO_EXCEPTION(transformToJSONFilter->Update());

  using WasmTransformToTransformFilterType = itk::WasmTransformToTransformFilter<TransformType>;
  auto jsonToTransformFilter = WasmTransformToTransformFilterType::New();
  jsonToTransformFilter->SetInput(transformToJSONFilter->GetOutput());
  ITK_TRY_EXPECT_NO_EXCEPTION(jsonToTransformFilter->Update());
  TransformType::Pointer convertedTransform = jsonToTransformFilter->GetOutput();

  ITK_TEST_EXPECT_EQUAL(convertedTransform->GetNumberOfTransforms(), inputTransform->GetNumberOfTransforms());
  ITK_TEST_EXPECT_EQUAL(convertedTransform->GetParameters().Size(), inputTransform->GetParameters().Size());

  // The mapping itself must survive, not just the parameter count.
  TransformType::InputPointType point;
  for (const auto & coordinates : { std::array<double, 2>{ 0.0, 0.0 },
                                    std::array<double, 2>{ 16.0, 48.0 },
                                    std::array<double, 2>{ 63.0, 63.0 } })
  {
    point[0] = coordinates[0];
    point[1] = coordinates[1];
    const auto expected = inputTransform->TransformPoint(point);
    const auto actual = convertedTransform->TransformPoint(point);
    for (unsigned int d = 0; d < Dimension; ++d)
    {
      ITK_TEST_EXPECT_TRUE(itk::Math::FloatAlmostEqual(expected[d], actual[d]));
    }
  }

  return EXIT_SUCCESS;
}

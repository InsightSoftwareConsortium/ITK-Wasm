/*=========================================================================

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
#include "itkOutputTransform.h"
#include "itkTransformJSON.h"
#include "itkWasmTransform.h"
#include "itkInputTextStream.h"

#include "itkCompositeTransform.h"
#include "itkIdentityTransform.h"
#include "itkTranslationTransform.h"
#include "itkEuler2DTransform.h"
#include "itkEuler3DTransform.h"
#include "itkRigid2DTransform.h"
#include "itkRigid3DTransform.h"
#include "itkRigid3DPerspectiveTransform.h"
#include "itkVersorRigid3DTransform.h"
#include "itkScaleTransform.h"
#include "itkScaleLogarithmicTransform.h"
#include "itkScaleSkewVersor3DTransform.h"
#include "itkSimilarity2DTransform.h"
#include "itkSimilarity3DTransform.h"
#include "itkQuaternionRigidTransform.h"
#include "itkAffineTransform.h"
#include "itkScalableAffineTransform.h"
#include "itkAzimuthElevationToCartesianTransform.h"
#include "itkBSplineTransform.h"
#include "itkBSplineSmoothingOnUpdateDisplacementFieldTransform.h"
#include "itkConstantVelocityFieldTransform.h"
#include "itkDisplacementFieldTransform.h"
#include "itkGaussianExponentialDiffeomorphicTransform.h"
#include "itkGaussianSmoothingOnUpdateDisplacementFieldTransform.h"
#include "itkGaussianSmoothingOnUpdateTimeVaryingVelocityFieldTransform.h"
#include "itkTimeVaryingVelocityFieldTransform.h"
#include "itkVelocityFieldTransform.h"

template <typename TTransform>
int CreateTransformParameterization(
  itk::wasm::Pipeline & pipeline)
{
  using TransformType = TTransform;
  using ParametersValueType = typename TransformType::ParametersValueType;

  using OutputTransformType = itk::wasm::OutputTransform<TransformType>;
  OutputTransformType outputTransform;
  pipeline.add_option("transform", outputTransform, "Output transform")
    ->type_name("OUTPUT_TRANSFORM")
    ->required();

  ITK_WASM_PARSE(pipeline);

  auto transform = TransformType::New();
  // call SetIdentity() to initialize the transform if the method exists
  if constexpr (std::is_same_v<TransformType, itk::IdentityTransform<ParametersValueType>>)
  {
    transform->SetIdentity();
  }
  else if constexpr (std::is_same_v<TransformType, itk::TranslationTransform<ParametersValueType, 3>>)
  {
    transform->SetIdentity();
  }
  else if constexpr (std::is_same_v<TransformType, itk::Euler2DTransform<ParametersValueType>>)
  {
    transform->SetIdentity();
  }
  else if constexpr (std::is_same_v<TransformType, itk::Euler3DTransform<ParametersValueType>>)
  {
    transform->SetIdentity();
  }
  else if constexpr (std::is_same_v<TransformType, itk::Rigid2DTransform<ParametersValueType>>)
  {
    transform->SetIdentity();
  }
  else if constexpr (std::is_same_v<TransformType, itk::Rigid3DTransform<ParametersValueType>>)
  {
    transform->SetIdentity();
  }
  else if constexpr (std::is_same_v<TransformType, itk::Rigid3DPerspectiveTransform<ParametersValueType>>)
  {
  }
  else if constexpr (std::is_same_v<TransformType, itk::VersorRigid3DTransform<ParametersValueType>>)
  {
    transform->SetIdentity();
  }
  else if constexpr (std::is_same_v<TransformType, itk::ScaleTransform<ParametersValueType, 3>>)
  {
    transform->SetIdentity();
  }
  else if constexpr (std::is_same_v<TransformType, itk::ScaleLogarithmicTransform<ParametersValueType, 3>>)
  {
    transform->SetIdentity();
  }
  else if constexpr (std::is_same_v<TransformType, itk::ScaleSkewVersor3DTransform<ParametersValueType>>)
  {
    transform->SetIdentity();
  }
  else if constexpr (std::is_same_v<TransformType, itk::Similarity2DTransform<ParametersValueType>>)
  {
    transform->SetIdentity();
  }
  else if constexpr (std::is_same_v<TransformType, itk::Similarity3DTransform<ParametersValueType>>)
  {
    transform->SetIdentity();
  }
  else if constexpr (std::is_same_v<TransformType, itk::QuaternionRigidTransform<ParametersValueType>>)
  {
    transform->SetIdentity();
  }
  else if constexpr (std::is_same_v<TransformType, itk::AffineTransform<ParametersValueType, 3>>)
  {
    transform->SetIdentity();
  }
  else if constexpr (std::is_same_v<TransformType, itk::ScalableAffineTransform<ParametersValueType, 3>>)
  {
    transform->SetIdentity();
  }
  else if constexpr (std::is_same_v<TransformType, itk::CompositeTransform<ParametersValueType, 3>>)
  {
  }
  else if constexpr (std::is_same_v<TransformType, itk::BSplineTransform<ParametersValueType, 3>>)
  {
    transform->SetIdentity();
  }
  else if constexpr (std::is_same_v<TransformType, itk::BSplineSmoothingOnUpdateDisplacementFieldTransform<ParametersValueType, 3>>)
  {
    transform->SetIdentity();
  }
  else if constexpr (std::is_same_v<TransformType, itk::ConstantVelocityFieldTransform<ParametersValueType, 3>>)
  {
    transform->SetIdentity();
  }
  else if constexpr (std::is_same_v<TransformType, itk::DisplacementFieldTransform<ParametersValueType, 3>>)
  {
    transform->SetIdentity();
  }
  else if constexpr (std::is_same_v<TransformType, itk::GaussianSmoothingOnUpdateDisplacementFieldTransform<ParametersValueType, 3>>)
  {
    transform->SetIdentity();
  }
  else if constexpr (std::is_same_v<TransformType, itk::GaussianExponentialDiffeomorphicTransform<ParametersValueType, 3>>)
  {
    transform->SetIdentity();
  }
  else if constexpr (std::is_same_v<TransformType, itk::VelocityFieldTransform<ParametersValueType, 3>>)
  {
    transform->SetIdentity();
  }

  outputTransform.Set(transform);

  return EXIT_SUCCESS;
}

template <typename TParameterValues, unsigned int VDimension>
int CreateTransformDimension(
  itk::wasm::Pipeline & pipeline,
  const itk::TransformTypeJSON & transformType)
{
  using ParametersValueType = TParameterValues;

  switch (transformType.transformParameterization)
  {
    case itk::JSONTransformParameterizationEnum::Composite:
      return CreateTransformParameterization<itk::CompositeTransform<ParametersValueType, VDimension>>(pipeline);
    case itk::JSONTransformParameterizationEnum::Identity:
      return CreateTransformParameterization<itk::IdentityTransform<ParametersValueType, VDimension>>(pipeline);
    case itk::JSONTransformParameterizationEnum::Translation:
      return CreateTransformParameterization<itk::TranslationTransform<ParametersValueType, VDimension>>(pipeline);
    case itk::JSONTransformParameterizationEnum::Euler2D:
      return CreateTransformParameterization<itk::Euler2DTransform<ParametersValueType>>(pipeline);
    case itk::JSONTransformParameterizationEnum::Euler3D:
      return CreateTransformParameterization<itk::Euler3DTransform<ParametersValueType>>(pipeline);
    case itk::JSONTransformParameterizationEnum::Rigid2D:
      return CreateTransformParameterization<itk::Rigid2DTransform<ParametersValueType>>(pipeline);
    case itk::JSONTransformParameterizationEnum::Rigid3D:
      return CreateTransformParameterization<itk::Rigid3DTransform<ParametersValueType>>(pipeline);
    case itk::JSONTransformParameterizationEnum::Rigid3DPerspective:
      return CreateTransformParameterization<itk::Rigid3DPerspectiveTransform<ParametersValueType>>(pipeline);
    case itk::JSONTransformParameterizationEnum::VersorRigid3D:
      return CreateTransformParameterization<itk::VersorRigid3DTransform<ParametersValueType>>(pipeline);
    case itk::JSONTransformParameterizationEnum::Versor:
      return CreateTransformParameterization<itk::VersorTransform<ParametersValueType>>(pipeline);
    case itk::JSONTransformParameterizationEnum::Scale:
      return CreateTransformParameterization<itk::ScaleTransform<ParametersValueType, VDimension>>(pipeline);
    case itk::JSONTransformParameterizationEnum::ScaleLogarithmic:
      return CreateTransformParameterization<itk::ScaleLogarithmicTransform<ParametersValueType, VDimension>>(pipeline);
    case itk::JSONTransformParameterizationEnum::ScaleSkewVersor3D:
      return CreateTransformParameterization<itk::ScaleSkewVersor3DTransform<ParametersValueType>>(pipeline);
    case itk::JSONTransformParameterizationEnum::Similarity2D:
      return CreateTransformParameterization<itk::Similarity2DTransform<ParametersValueType>>(pipeline);
    case itk::JSONTransformParameterizationEnum::Similarity3D:
      return CreateTransformParameterization<itk::Similarity3DTransform<ParametersValueType>>(pipeline);
    case itk::JSONTransformParameterizationEnum::QuaternionRigid:
      return CreateTransformParameterization<itk::QuaternionRigidTransform<ParametersValueType>>(pipeline);
    case itk::JSONTransformParameterizationEnum::Affine:
      return CreateTransformParameterization<itk::AffineTransform<ParametersValueType, VDimension>>(pipeline);
    case itk::JSONTransformParameterizationEnum::ScalableAffine:
      return CreateTransformParameterization<itk::ScalableAffineTransform<ParametersValueType, VDimension>>(pipeline);
    case itk::JSONTransformParameterizationEnum::AzimuthElevationToCartesian:
      return CreateTransformParameterization<itk::AzimuthElevationToCartesianTransform<ParametersValueType>>(pipeline);
    case itk::JSONTransformParameterizationEnum::BSpline:
      return CreateTransformParameterization<itk::BSplineTransform<ParametersValueType, VDimension>>(pipeline);
    case itk::JSONTransformParameterizationEnum::BSplineSmoothingOnUpdateDisplacementField:
      return CreateTransformParameterization<
        itk::BSplineSmoothingOnUpdateDisplacementFieldTransform<ParametersValueType, VDimension>>(pipeline);
    case itk::JSONTransformParameterizationEnum::ConstantVelocityField:
      return CreateTransformParameterization<itk::ConstantVelocityFieldTransform<ParametersValueType, VDimension>>(
        pipeline);
    case itk::JSONTransformParameterizationEnum::DisplacementField:
      return CreateTransformParameterization<itk::DisplacementFieldTransform<ParametersValueType, VDimension>>(
        pipeline);
    case itk::JSONTransformParameterizationEnum::GaussianSmoothingOnUpdateDisplacementField:
      return CreateTransformParameterization<
        itk::GaussianSmoothingOnUpdateDisplacementFieldTransform<ParametersValueType, VDimension>>(pipeline);
    case itk::JSONTransformParameterizationEnum::GaussianExponentialDiffeomorphic:
      return CreateTransformParameterization<
        itk::GaussianExponentialDiffeomorphicTransform<ParametersValueType, VDimension>>(pipeline);
    case itk::JSONTransformParameterizationEnum::VelocityField:
      return CreateTransformParameterization<itk::VelocityFieldTransform<ParametersValueType, VDimension>>(pipeline);
    case itk::JSONTransformParameterizationEnum::TimeVaryingVelocityField:
      return CreateTransformParameterization<
        itk::TimeVaryingVelocityFieldTransform<ParametersValueType, VDimension>>(pipeline);
    case itk::JSONTransformParameterizationEnum::GaussianSmoothingOnUpdateTimeVaryingVelocityField:
      return CreateTransformParameterization<
        itk::GaussianSmoothingOnUpdateTimeVaryingVelocityFieldTransform<ParametersValueType, VDimension>>(pipeline);
    default:
      std::cerr << "Unsupported transform parameterization: "
                << static_cast<int>(transformType.transformParameterization) << std::endl;
      throw std::logic_error("Unsupported transform parameterization");
  }

  return EXIT_SUCCESS;
}

template <typename TParameterValues>
int CreateTransformParameterValues(
  itk::wasm::Pipeline & pipeline,
  const itk::TransformTypeJSON & transformType)
{
  using ParametersValueType = TParameterValues;

  if (transformType.outputDimension != transformType.inputDimension)
  {
    std::cerr << "Output dimension (" << transformType.outputDimension
              << ") must match input dimension (" << transformType.inputDimension << ")." << std::endl;
    throw std::logic_error("Output dimension must match input dimension");
  }

  const unsigned int inputDimension = transformType.inputDimension;
  switch (inputDimension)
  {
    case 2:
      return CreateTransformDimension<ParametersValueType, 2>(pipeline, transformType);
    case 3:
      return CreateTransformDimension<ParametersValueType, 3>(pipeline, transformType);
    default:
      std::cerr << "Unsupported input dimension: " << inputDimension << std::endl;
      throw std::logic_error("Unsupported input dimension");
  }

  return EXIT_FAILURE;
}

int
main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("create-transform", "Create a spatial transformation.", argc, argv);

  itk::wasm::InputTextStream transformTypeText;
  pipeline.add_option("transform-type", transformTypeText, "Desired TransformType")->type_name("INPUT_JSON");

  ITK_WASM_PRE_PARSE(pipeline);

  auto transformType = itk::TransformTypeJSON
  {
    itk::JSONTransformParameterizationEnum::Identity,
    itk::JSONFloatTypesEnum::float32, // parametersValueType
    3, // inputDimension
    3  // outputDimension
  };
  if (transformTypeText.GetPointer() != nullptr)
  {
    const std::string transformTypeString(std::istreambuf_iterator<char>(transformTypeText.Get()), {});
    auto deserializedAttempt = glz::read_json<itk::TransformTypeJSON>(transformTypeString);
    if (!deserializedAttempt)
    {
      const std::string descriptiveError = glz::format_error(deserializedAttempt, transformTypeString);
      std::cerr << "Failed to deserialize transform type: " << descriptiveError << std::endl;
      return EXIT_FAILURE;
    }
    transformType = deserializedAttempt.value();
  }

  if (transformType.parametersValueType == itk::JSONFloatTypesEnum::float32)
  {
    return CreateTransformParameterValues<float>(pipeline, transformType);
  }
  else if (transformType.parametersValueType == itk::JSONFloatTypesEnum::float64)
  {
    return CreateTransformParameterValues<double>(pipeline, transformType);
  }
  else
  {
    std::cerr << "Unsupported parameters value type: " << static_cast<int>(transformType.parametersValueType)
              << std::endl;
    throw std::logic_error("Unknown parameters value type");
  }

  return EXIT_FAILURE;
}

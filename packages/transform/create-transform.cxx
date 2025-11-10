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

#ifndef TRANSFORM_NAME
#  error "TRANSFORM_NAME must be defined"
#endif

#define VALUE(string) #string
#define TO_LITERAL(string) VALUE(string)

#include "itkPipeline.h"
#include "itkOutputTransform.h"
#include "itkTransformJSON.h"
#include "itkWasmTransform.h"

#include "itkCompositeTransform.h"
#include "itkIdentityTransform.h"
#include "itkTranslationTransform.h"
#include "itkEuler2DTransform.h"
#include "itkEuler3DTransform.h"
#include "itkRigid2DTransform.h"
#include "itkRigid3DTransform.h"
#include "itkRigid3DPerspectiveTransform.h"
#include "itkVersorRigid3DTransform.h"
#include "itkVersorTransform.h"
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
int
CreateTransformParameterization(itk::wasm::Pipeline & pipeline)
{
  using TransformType = TTransform;
  using ParametersValueType = typename TransformType::ParametersValueType;

  using OutputTransformType = itk::wasm::OutputTransform<TransformType>;
  OutputTransformType outputTransform;
  pipeline.add_option("transform", outputTransform, "Output transform")->type_name("OUTPUT_TRANSFORM")->required();

  ITK_WASM_PARSE(pipeline);

  auto transform = TransformType::New();
#ifdef TRANSFORM_COMPOSITE
#elif defined(TRANSFORM_IDENTITY)
#elif defined(TRANSFORM_TRANSLATION)
  transform->SetIdentity();
#elif defined(TRANSFORM_EULER2D)
  transform->SetIdentity();
#elif defined(TRANSFORM_EULER3D)
  transform->SetIdentity();
#elif defined(TRANSFORM_RIGID2D)
  transform->SetIdentity();
#elif defined(TRANSFORM_RIGID3D)
  transform->SetIdentity();
#elif defined(TRANSFORM_RIGID3D_PERSPECTIVE)
#elif defined(TRANSFORM_VERSOR_RIGID3D)
  transform->SetIdentity();
#elif defined(TRANSFORM_VERSOR)
  transform->SetIdentity();
#elif defined(TRANSFORM_SCALE)
  transform->SetIdentity();
#elif defined(TRANSFORM_SCALE_LOGARITHMIC)
  transform->SetIdentity();
#elif defined(TRANSFORM_SCALE_SKEW_VERSOR3D)
  transform->SetIdentity();
#elif defined(TRANSFORM_SIMILARITY2D)
  transform->SetIdentity();
#elif defined(TRANSFORM_SIMILARITY3D)
  transform->SetIdentity();
#elif defined(TRANSFORM_QUATERNION_RIGID)
  transform->SetIdentity();
#elif defined(TRANSFORM_AFFINE)
  transform->SetIdentity();
#elif defined(TRANSFORM_SCALABLE_AFFINE)
  transform->SetIdentity();
#elif defined(TRANSFORM_AZIMUTH_ELEVATION_TO_CARTESIAN)
  transform->SetIdentity();
#elif defined(TRANSFORM_BSPLINE)
  transform->SetIdentity();
#elif defined(TRANSFORM_BSPLINE_SMOOTHING_ON_UPDATE_DISPLACEMENT_FIELD)
  transform->SetIdentity();
#elif defined(TRANSFORM_CONSTANT_VELOCITY_FIELD)
  transform->SetIdentity();
#elif defined(TRANSFORM_DISPLACEMENT_FIELD)
  transform->SetIdentity();
#elif defined(TRANSFORM_GAUSSIAN_SMOOTHING_ON_UPDATE_DISPLACEMENT_FIELD)
  transform->SetIdentity();
#elif defined(TRANSFORM_GAUSSIAN_EXPONENTIAL_DIFFEOMORPHIC)
  transform->SetIdentity();
#elif defined(TRANSFORM_VELOCITY_FIELD)
  transform->SetIdentity();
#elif defined(TRANSFORM_TIME_VARYING_VELOCITY_FIELD)
  transform->SetIdentity();
#elif defined(TRANSFORM_GAUSSIAN_SMOOTHING_ON_UPDATE_TIME_VARYING_VELOCITY_FIELD)
  transform->SetIdentity();
#else
  std::cerr << "Unsupported transform parameterization: " << TO_LITERAL(TRANSFORM_NAME) << std::endl;
  throw std::logic_error("Unsupported transform parameterization");
#endif

  outputTransform.Set(transform);

  return EXIT_SUCCESS;
}

template <typename TParameterValues, unsigned int VDimension>
int
CreateTransformDimension(itk::wasm::Pipeline & pipeline)
{
  using ParametersValueType = TParameterValues;

#ifdef TRANSFORM_COMPOSITE
  return CreateTransformParameterization<itk::CompositeTransform<ParametersValueType, VDimension>>(pipeline);
#elif defined(TRANSFORM_IDENTITY)
  return CreateTransformParameterization<itk::IdentityTransform<ParametersValueType, VDimension>>(pipeline);
#elif defined(TRANSFORM_TRANSLATION)
  return CreateTransformParameterization<itk::TranslationTransform<ParametersValueType, VDimension>>(pipeline);
#elif defined(TRANSFORM_EULER2D)
  return CreateTransformParameterization<itk::Euler2DTransform<ParametersValueType>>(pipeline);
#elif defined(TRANSFORM_EULER3D)
  return CreateTransformParameterization<itk::Euler3DTransform<ParametersValueType>>(pipeline);
#elif defined(TRANSFORM_RIGID2D)
  return CreateTransformParameterization<itk::Rigid2DTransform<ParametersValueType>>(pipeline);
#elif defined(TRANSFORM_RIGID3D)
  return CreateTransformParameterization<itk::Rigid3DTransform<ParametersValueType>>(pipeline);
#elif defined(TRANSFORM_RIGID3D_PERSPECTIVE)
  return CreateTransformParameterization<itk::Rigid3DPerspectiveTransform<ParametersValueType>>(pipeline);
#elif defined(TRANSFORM_VERSOR_RIGID3D)
  return CreateTransformParameterization<itk::VersorRigid3DTransform<ParametersValueType>>(pipeline);
#elif defined(TRANSFORM_VERSOR)
  return CreateTransformParameterization<itk::VersorTransform<ParametersValueType>>(pipeline);
#elif defined(TRANSFORM_SCALE)
  return CreateTransformParameterization<itk::ScaleTransform<ParametersValueType, VDimension>>(pipeline);
#elif defined(TRANSFORM_SCALE_LOGARITHMIC)
  return CreateTransformParameterization<itk::ScaleLogarithmicTransform<ParametersValueType, VDimension>>(pipeline);
#elif defined(TRANSFORM_SCALE_SKEW_VERSOR3D)
  return CreateTransformParameterization<itk::ScaleSkewVersor3DTransform<ParametersValueType>>(pipeline);
#elif defined(TRANSFORM_SIMILARITY2D)
  return CreateTransformParameterization<itk::Similarity2DTransform<ParametersValueType>>(pipeline);
#elif defined(TRANSFORM_SIMILARITY3D)
  return CreateTransformParameterization<itk::Similarity3DTransform<ParametersValueType>>(pipeline);
#elif defined(TRANSFORM_QUATERNION_RIGID)
  return CreateTransformParameterization<itk::QuaternionRigidTransform<ParametersValueType>>(pipeline);
#elif defined(TRANSFORM_AFFINE)
  return CreateTransformParameterization<itk::AffineTransform<ParametersValueType, VDimension>>(pipeline);
#elif defined(TRANSFORM_SCALABLE_AFFINE)
  return CreateTransformParameterization<itk::ScalableAffineTransform<ParametersValueType, VDimension>>(pipeline);
#elif defined(TRANSFORM_AZIMUTH_ELEVATION_TO_CARTESIAN)
  return CreateTransformParameterization<itk::AzimuthElevationToCartesianTransform<ParametersValueType>>(pipeline);
#elif defined(TRANSFORM_BSPLINE)
  return CreateTransformParameterization<itk::BSplineTransform<ParametersValueType, VDimension>>(pipeline);
#elif defined(TRANSFORM_BSPLINE_SMOOTHING_ON_UPDATE_DISPLACEMENT_FIELD)
  return CreateTransformParameterization<
    itk::BSplineSmoothingOnUpdateDisplacementFieldTransform<ParametersValueType, VDimension>>(pipeline);
#elif defined(TRANSFORM_CONSTANT_VELOCITY_FIELD)
  return CreateTransformParameterization<itk::ConstantVelocityFieldTransform<ParametersValueType, VDimension>>(
    pipeline);
#elif defined(TRANSFORM_DISPLACEMENT_FIELD)
  return CreateTransformParameterization<itk::DisplacementFieldTransform<ParametersValueType, VDimension>>(pipeline);
#elif defined(TRANSFORM_GAUSSIAN_SMOOTHING_ON_UPDATE_DISPLACEMENT_FIELD)
  return CreateTransformParameterization<
    itk::GaussianSmoothingOnUpdateDisplacementFieldTransform<ParametersValueType, VDimension>>(pipeline);
#elif defined(TRANSFORM_GAUSSIAN_EXPONENTIAL_DIFFEOMORPHIC)
  return CreateTransformParameterization<
    itk::GaussianExponentialDiffeomorphicTransform<ParametersValueType, VDimension>>(pipeline);
#elif defined(TRANSFORM_VELOCITY_FIELD)
  return CreateTransformParameterization<itk::VelocityFieldTransform<ParametersValueType, VDimension>>(pipeline);
#elif defined(TRANSFORM_TIME_VARYING_VELOCITY_FIELD)
  return CreateTransformParameterization<itk::TimeVaryingVelocityFieldTransform<ParametersValueType, VDimension>>(
    pipeline);
#elif defined(TRANSFORM_GAUSSIAN_SMOOTHING_ON_UPDATE_TIME_VARYING_VELOCITY_FIELD)
  return CreateTransformParameterization<
    itk::GaussianSmoothingOnUpdateTimeVaryingVelocityFieldTransform<ParametersValueType, VDimension>>(pipeline);
#else
  std::cerr << "Unsupported transform parameterization: " << TO_LITERAL(TRANSFORM_NAME) << std::endl;
  throw std::logic_error("Unsupported transform parameterization");
#endif
}

template <typename TParameterValues>
int
CreateTransformParameterValues(itk::wasm::Pipeline & pipeline, unsigned int dimension)
{
  using ParametersValueType = TParameterValues;

  switch (dimension)
  {
#if defined(TRANSFORM_EULER2D) || defined(TRANSFORM_RIGID2D) || defined(TRANSFORM_SIMILARITY2D)
    case 2:
      return CreateTransformDimension<ParametersValueType, 2>(pipeline);
    default:
      std::cerr << "Transform " << TO_LITERAL(TRANSFORM_NAME)
                << " only supports 2D. Unsupported dimension: " << dimension << std::endl;
      throw std::logic_error("Unsupported dimension");
#elif defined(TRANSFORM_EULER3D) || defined(TRANSFORM_RIGID3D) || defined(TRANSFORM_VERSOR_RIGID3D) ||      \
  defined(TRANSFORM_VERSOR) || defined(TRANSFORM_SCALE_SKEW_VERSOR3D) || defined(TRANSFORM_SIMILARITY3D) || \
  defined(TRANSFORM_QUATERNION_RIGID) || defined(TRANSFORM_RIGID3D_PERSPECTIVE) ||                          \
  defined(TRANSFORM_AZIMUTH_ELEVATION_TO_CARTESIAN)
    case 3:
      return CreateTransformDimension<ParametersValueType, 3>(pipeline);
    default:
      std::cerr << "Transform " << TO_LITERAL(TRANSFORM_NAME)
                << " only supports 3D. Unsupported dimension: " << dimension << std::endl;
      throw std::logic_error("Unsupported dimension");
#else
    // Multi-dimensional transforms (2D, 3D, 4D)
    case 2:
      return CreateTransformDimension<ParametersValueType, 2>(pipeline);
    case 3:
      return CreateTransformDimension<ParametersValueType, 3>(pipeline);
    case 4:
      return CreateTransformDimension<ParametersValueType, 4>(pipeline);
    default:
      std::cerr << "Unsupported dimension: " << dimension << std::endl;
      throw std::logic_error("Unsupported dimension");
#endif
  }

  return EXIT_FAILURE;
}

int
main(int argc, char * argv[])
{
  const char *        pipelineName = "create-" TO_LITERAL(TRANSFORM_NAME) "-transform";
  const char *        pipelineDescription = "Create a " TO_LITERAL(TRANSFORM_NAME) " spatial transformation.";
  itk::wasm::Pipeline pipeline(pipelineName, pipelineDescription, argc, argv);

#if defined(TRANSFORM_EULER2D) || defined(TRANSFORM_RIGID2D) || defined(TRANSFORM_SIMILARITY2D)
  constexpr unsigned int dimension = 2;
#elif defined(TRANSFORM_EULER) || defined(TRANSFORM_RIGID) || defined(TRANSFORM_VERSOR_RIGID) ||        \
  defined(TRANSFORM_VERSOR) || defined(TRANSFORM_SCALE_SKEW_VERSOR) || defined(TRANSFORM_SIMILARITY) || \
  defined(TRANSFORM_QUATERNION_RIGID) || defined(TRANSFORM_RIGID_PERSPECTIVE) ||                        \
  defined(TRANSFORM_AZIMUTH_ELEVATION_TO_CARTESIAN)
  constexpr unsigned int dimension = 3;
#else
  unsigned int dimension = 3;
  pipeline.add_option("-d,--dimension", dimension, "Dimension of the transform (2, 3, or 4)");
#endif

  std::string parametersType = "float32";
  pipeline.add_option("-p,--parameters-type", parametersType, "Type of the transform parameters (float32 or float64)");

  ITK_WASM_PRE_PARSE(pipeline);

  if (parametersType == "float32")
  {
    return CreateTransformParameterValues<float>(pipeline, dimension);
  }
  else if (parametersType == "float64")
  {
    return CreateTransformParameterValues<double>(pipeline, dimension);
  }
  else
  {
    std::cerr << "Unsupported parameters type: " << parametersType << std::endl;
    throw std::logic_error("Unknown parameters type");
  }

  return EXIT_FAILURE;
}

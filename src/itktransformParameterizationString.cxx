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
#include "itktransformParameterizationString.h"

namespace itk
{

const std::string
transformParameterizationString(const TransformTypeJSON & json)
{
  std::string transformParameterization;
  switch (json.transformParameterization)
  {
    case JSONTransformParameterizationEnum::Identity:
    {
      transformParameterization = "Identity";
      break;
    }
    case JSONTransformParameterizationEnum::Composite:
    {
      transformParameterization = "Composite";
      break;
    }
    case JSONTransformParameterizationEnum::Translation:
    {
      transformParameterization = "Translation";
      break;
    }
    case JSONTransformParameterizationEnum::Euler2D:
    {
      transformParameterization = "Euler2D";
      break;
    }
    case JSONTransformParameterizationEnum::Euler3D:
    {
      transformParameterization = "Euler3D";
      break;
    }
    case JSONTransformParameterizationEnum::Rigid2D:
    {
      transformParameterization = "Rigid2D";
      break;
    }
    case JSONTransformParameterizationEnum::Rigid3DPerspective:
    {
      transformParameterization = "Rigid3DPerspective";
      break;
    }
    case JSONTransformParameterizationEnum::VersorRigid3D:
    {
      transformParameterization = "VersorRigid3D";
      break;
    }
    case JSONTransformParameterizationEnum::Versor:
    {
      transformParameterization = "Versor";
      break;
    }
    case JSONTransformParameterizationEnum::ScaleLogarithmic:
    {
      transformParameterization = "ScaleLogarithmic";
      break;
    }
    case JSONTransformParameterizationEnum::ScaleSkewVersor3D:
    {
      transformParameterization = "ScaleSkewVersor3D";
      break;
    }
    case JSONTransformParameterizationEnum::Scale:
    {
      transformParameterization = "Scale";
      break;
    }
    case JSONTransformParameterizationEnum::Similarity2D:
    {
      transformParameterization = "Similarity2D";
      break;
    }
    case JSONTransformParameterizationEnum::Similarity3D:
    {
      transformParameterization = "Similarity3D";
      break;
    }
    case JSONTransformParameterizationEnum::QuaternionRigid:
    {
      transformParameterization = "QuaternionRigid";
      break;
    }
    case JSONTransformParameterizationEnum::Affine:
    {
      transformParameterization = "Affine";
      break;
    }
    case JSONTransformParameterizationEnum::ScalableAffine:
    {
      transformParameterization = "ScalableAffine";
      break;
    }
    case JSONTransformParameterizationEnum::AzimuthElevationToCartesian:
    {
      transformParameterization = "AzimuthElevationToCartesian";
      break;
    }
    case JSONTransformParameterizationEnum::BSpline:
    {
      transformParameterization = "BSpline";
      break;
    }
    case JSONTransformParameterizationEnum::BSplineSmoothingOnUpdateDisplacementField:
    {
      transformParameterization = "BSplineSmoothingOnUpdateDisplacementField";
      break;
    }
    case JSONTransformParameterizationEnum::ConstantVelocityField:
    {
      transformParameterization = "ConstantVelocityField";
      break;
    }
    case JSONTransformParameterizationEnum::DisplacementField:
    {
      transformParameterization = "DisplacementField";
      break;
    }
    case JSONTransformParameterizationEnum::GaussianExponentialDiffeomorphic:
    {
      transformParameterization = "GaussianExponentialDiffeomorphic";
      break;
    }
    case JSONTransformParameterizationEnum::GaussianSmoothingOnUpdateDisplacementField:
    {
      transformParameterization = "GaussianSmoothingOnUpdateDisplacementField";
      break;
    }
    case JSONTransformParameterizationEnum::GaussianSmoothingOnUpdateTimeVaryingVelocityField:
    {
      transformParameterization = "GaussianSmoothingOnUpdateTimeVaryingVelocityField";
      break;
    }
    case JSONTransformParameterizationEnum::TimeVaryingVelocityField:
    {
      transformParameterization = "TimeVaryingVelocityField";
      break;
    }
    case JSONTransformParameterizationEnum::VelocityField:
    {
      transformParameterization = "VelocityField";
      break;
    }
    default:
    {
      throw std::invalid_argument("Unknown transform parameterization");
    }
  }

  return transformParameterization;
}

} // namespace itk

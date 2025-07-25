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

std::string
transformParameterizationString(const TransformTypeJSON & json)
{
  switch (json.transformParameterization)
  {
    case JSONTransformParameterizationEnum::Composite:
    {
      return "Composite";
    }
    case JSONTransformParameterizationEnum::Identity:
    {
      return "Identity";
    }
    case JSONTransformParameterizationEnum::Translation:
    {
      return "Translation";
    }
    case JSONTransformParameterizationEnum::Euler2D:
    {
      return "Euler2D";
    }
    case JSONTransformParameterizationEnum::Euler3D:
    {
      return "Euler3D";
    }
    case JSONTransformParameterizationEnum::Rigid2D:
    {
      return "Rigid2D";
    }
    case JSONTransformParameterizationEnum::Rigid3D:
    {
      return "Rigid3D";
    }
    case JSONTransformParameterizationEnum::Rigid3DPerspective:
    {
      return "Rigid3DPerspective";
    }
    case JSONTransformParameterizationEnum::Versor:
    {
      return "Versor";
    }
    case JSONTransformParameterizationEnum::VersorRigid3D:
    {
      return "VersorRigid3D";
    }
    case JSONTransformParameterizationEnum::Scale:
    {
      return "Scale";
    }
    case JSONTransformParameterizationEnum::ScaleLogarithmic:
    {
      return "ScaleLogarithmic";
    }
    case JSONTransformParameterizationEnum::ScaleSkewVersor3D:
    {
      return "ScaleSkewVersor3D";
    }
    case JSONTransformParameterizationEnum::Similarity2D:
    {
      return "Similarity2D";
    }
    case JSONTransformParameterizationEnum::Similarity3D:
    {
      return "Similarity3D";
    }
    case JSONTransformParameterizationEnum::QuaternionRigid:
    {
      return "QuaternionRigid";
    }
    case JSONTransformParameterizationEnum::Affine:
    {
      return "Affine";
    }
    case JSONTransformParameterizationEnum::ScalableAffine:
    {
      return "ScalableAffine";
    }
    case JSONTransformParameterizationEnum::AzimuthElevationToCartesian:
    {
      return "AzimuthElevationToCartesian";
    }
    case JSONTransformParameterizationEnum::BSpline:
    {
      return "BSpline";
    }
    case JSONTransformParameterizationEnum::BSplineSmoothingOnUpdateDisplacementField:
    {
      return "BSplineSmoothingOnUpdateDisplacementField";
    }
    case JSONTransformParameterizationEnum::ConstantVelocityField:
    {
      return "ConstantVelocityField";
    }
    case JSONTransformParameterizationEnum::DisplacementField:
    {
      return "DisplacementField";
    }
    case JSONTransformParameterizationEnum::GaussianExponentialDiffeomorphic:
    {
      return "GaussianExponentialDiffeomorphic";
    }
    case JSONTransformParameterizationEnum::GaussianSmoothingOnUpdateDisplacementField:
    {
      return "GaussianSmoothingOnUpdateDisplacementField";
    }
    case JSONTransformParameterizationEnum::GaussianSmoothingOnUpdateTimeVaryingVelocityField:
    {
      return "GaussianSmoothingOnUpdateTimeVaryingVelocityField";
    }
    case JSONTransformParameterizationEnum::TimeVaryingVelocityField:
    {
      return "TimeVaryingVelocityField";
    }
    case JSONTransformParameterizationEnum::VelocityField:
    {
      return "VelocityField";
    }
  }

  throw std::invalid_argument("Unknown transform parameterization");
}

} // namespace itk

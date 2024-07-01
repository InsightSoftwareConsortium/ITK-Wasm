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
#ifndef itkTransformJSON_h
#define itkTransformJSON_h

#include "itkFloatTypesJSON.h"

#include <vector>

#include "glaze/glaze.hpp"

namespace itk
{
  enum class JSONTransformParameterizationEnum
  {
    Identity,
    Composite,
    Translation,
    Euler2D,
    Euler3D,
    Rigid2D,
    Rigid3DPerspective,
    VersorRigid3D,
    Versor,
    ScaleLogarithmic,
    ScaleSkewVersor3D,
    Scale,
    Similarity2D,
    Similarity3D,
    QuaternionRigid,
    Affine,
    ScalableAffine,
    AzimuthElevationToCartesian,
    BSpline,
    BSplineSmoothingOnUpdateDisplacementField,
    ConstantVelocityField,
    DisplacementField,
    GaussianExponentialDiffeomorphic,
    GaussianSmoothingOnUpdateDisplacementField,
    GaussianSmoothingOnUpdateTimeVaryingVelocityField,
    TimeVaryingVelocityField,
    VelocityField,
  };

  /** \class TransformTypeJSON
   *
   * \brief Transform type JSON representation data structure.
   *
   * \ingroup WebAssemblyInterface
   */
  struct TransformTypeJSON
  {
    JSONTransformParameterizationEnum transformParameterization{ JSONTransformParameterizationEnum::Identity };
    JSONFloatTypesEnum parametersValueType { JSONFloatTypesEnum::float64 };
    unsigned int inputDimension { 3 };
    unsigned int outputDimension { 3 };
  };

  /** \class TransformJSON
   *
   * \brief Transform JSON representation data structure.
   *
   * \ingroup WebAssemblyInterface
   */
  struct TransformJSON
  {
    TransformTypeJSON transformType;
    uint64_t numberOfFixedParameters{ 0 };
    uint64_t numberOfParameters{ 0 };
    std::string name;
    std::string inputSpaceName;
    std::string outputSpaceName;
    std::string fixedParameters{ "data:application/vnd.itk.path,data/fixed-parameters.raw" };
    std::string parameters{ "data:application/vnd.itk.path,data/parameters.raw" };
  };

  /** \class TransformListJSON
   *
   * \brief Transform list JSON representation data structure.
   *
   * \ingroup WebAssemblyInterface
   */
  using TransformListJSON = std::list<TransformJSON>;
} // end namespace itk

template <>
struct glz::meta<itk::JSONTransformParameterizationEnum> {
  using enum itk::JSONTransformParameterizationEnum;
  static constexpr auto value = glz::enumerate(Identity,
  Composite,
  Translation,
  Euler2D,
  Euler3D,
  Rigid2D,
  Rigid3DPerspective,
  VersorRigid3D,
  Versor,
  ScaleLogarithmic,
  ScaleSkewVersor3D,
  Scale,
  Similarity2D,
  Similarity3D,
  QuaternionRigid,
  Affine,
  ScalableAffine,
  AzimuthElevationToCartesian,
  BSpline,
  BSplineSmoothingOnUpdateDisplacementField,
  ConstantVelocityField,
  DisplacementField,
  GaussianExponentialDiffeomorphic,
  GaussianSmoothingOnUpdateDisplacementField,
  GaussianSmoothingOnUpdateTimeVaryingVelocityField,
  TimeVaryingVelocityField,
  VelocityField
  );
};

#endif // itkWasmTransformIO_h

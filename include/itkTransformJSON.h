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

#include "itkCompositeTransformIOHelper.h"
#include "itkMetaDataDictionaryJSON.h"

#include "glaze/glaze.hpp"

namespace itk
{
  enum class JSONTransformParameterizationEnum
  {
    Composite,
    Identity,
    Translation,
    Euler2D,
    Euler3D,
    Rigid2D,
    Rigid3D,
    Rigid3DPerspective,
    Versor,
    VersorRigid3D,
    Scale,
    ScaleLogarithmic,
    ScaleSkewVersor3D,
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
    GaussianSmoothingOnUpdateDisplacementField,
    GaussianExponentialDiffeomorphic,
    VelocityField,
    TimeVaryingVelocityField,
    GaussianSmoothingOnUpdateTimeVaryingVelocityField,
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

    std::string name { "Transform" };

    std::string inputSpaceName;
    std::string outputSpaceName;

    std::string fixedParameters;
    std::string parameters;

    MetadataJSON metadata;
  };

  /** \class TransformListJSON
   *
   * \brief Transform list JSON representation data structure.
   *
   * \ingroup WebAssemblyInterface
   */
  using TransformListJSON = std::list<TransformJSON>;

template<typename TTransformBase>
auto transformListToTransformListJSON(std::list<typename TTransformBase::ConstPointer> & transformList, bool inMemory) -> TransformListJSON
{
  TransformListJSON transformListJSON;

  std::string              compositeTransformType = transformList.front()->GetTransformTypeAsString();
  using TransformBaseType = TTransformBase;
  using ParametersValueType = typename TransformBaseType::ParametersValueType;
  CompositeTransformIOHelperTemplate<ParametersValueType> helper;

  using ConstTransformListType = std::list<typename TransformBaseType::ConstPointer>;
  ConstTransformListType usedTransformList = transformList;

  //
  // if the first transform in the list is a
  // composite transform, use its internal list
  // instead of the IO
  if (compositeTransformType.find("CompositeTransform") != std::string::npos)
  {
    usedTransformList = helper.GetTransformList(transformList.front().GetPointer());
  }

  unsigned int count = 0;
  typename ConstTransformListType::const_iterator end = usedTransformList.end();
  for (typename ConstTransformListType::const_iterator it = usedTransformList.begin(); it != end; ++it)
  {
    TransformJSON            transformJSON;
    const TransformBaseType *    currentTransform = it->GetPointer();
    const std::string        transformType = currentTransform->GetTransformTypeAsString();
    const std::string        delim = "_";
    std::vector<std::string> tokens;
    size_t                   start = 0;
    size_t                   end = 0;
    while ((end = transformType.find(delim, start)) != std::string::npos)
    {
      tokens.push_back(transformType.substr(start, end - start));
      start = end + delim.length();
    }
    tokens.push_back(transformType.substr(start));
    const std::string pString = tokens[0];
    if (pString == "CompositeTransform")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Composite;
    }
    else if (pString == "IdentityTransform")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Identity;
    }
    else if (pString == "TranslationTransform")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Translation;
    }
    else if (pString == "Euler2DTransform")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Euler2D;
    }
    else if (pString == "Euler3DTransform")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Euler3D;
    }
    else if (pString == "Rigid2DTransform")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Rigid2D;
    }
    else if (pString == "Rigid3DTransform")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Rigid3D;
    }
    else if (pString == "Rigid3DPerspectiveTransform")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Rigid3DPerspective;
    }
    else if (pString == "VersorRigid3DTransform")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::VersorRigid3D;
    }
    else if (pString == "Versor")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Versor;
    }
    else if (pString == "ScaleTransform")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Scale;
    }
    else if (pString == "ScaleLogarithmicTransform")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::ScaleLogarithmic;
    }
    else if (pString == "ScaleSkewVersor3DTransform")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::ScaleSkewVersor3D;
    }
    else if (pString == "Similarity2DTransform")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Similarity2D;
    }
    else if (pString == "Similarity3DTransform")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Similarity3D;
    }
    else if (pString == "QuaternionRigidTransform")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::QuaternionRigid;
    }
    else if (pString == "AffineTransform")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::Affine;
    }
    else if (pString == "ScalableAffineTransform")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::ScalableAffine;
    }
    else if (pString == "AzimuthElevationToCartesianTransform")
    {
      transformJSON.transformType.transformParameterization =
        JSONTransformParameterizationEnum::AzimuthElevationToCartesian;
    }
    else if (pString == "BSplineTransform")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::BSpline;
    }
    else if (pString == "BSplineSmoothingOnUpdateDisplacementFieldTransform")
    {
      transformJSON.transformType.transformParameterization =
        JSONTransformParameterizationEnum::BSplineSmoothingOnUpdateDisplacementField;
    }
    else if (pString == "ConstantVelocityFieldTransform")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::ConstantVelocityField;
    }
    else if (pString == "DisplacementFieldTransform")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::DisplacementField;
    }
    else if (pString == "GaussianExponentialDiffeomorphicTransform")
    {
      transformJSON.transformType.transformParameterization =
        JSONTransformParameterizationEnum::GaussianExponentialDiffeomorphic;
    }
    else if (pString == "GaussianSmoothingOnUpdateDisplacementFieldTransform")
    {
      transformJSON.transformType.transformParameterization =
        JSONTransformParameterizationEnum::GaussianSmoothingOnUpdateDisplacementField;
    }
    else if (pString == "GaussianSmoothingOnUpdateTimeVaryingVelocityFieldTransform")
    {
      transformJSON.transformType.transformParameterization =
        JSONTransformParameterizationEnum::GaussianSmoothingOnUpdateTimeVaryingVelocityField;
    }
    else if (pString == "TimeVaryingVelocityFieldTransform")
    {
      transformJSON.transformType.transformParameterization =
        JSONTransformParameterizationEnum::TimeVaryingVelocityField;
    }
    else if (pString == "VelocityFieldTransform")
    {
      transformJSON.transformType.transformParameterization = JSONTransformParameterizationEnum::VelocityField;
    }
    else
    {
      throw std::logic_error("Unknown transform type: " + pString);
    }

    constexpr size_t parametersSize = sizeof(ParametersValueType);
    if (parametersSize == 4)
    {
      transformJSON.transformType.parametersValueType = JSONFloatTypesEnum::float32;
    }
    else if (parametersSize == 8)
    {
      transformJSON.transformType.parametersValueType = JSONFloatTypesEnum::float64;
    }
    else
    {
      throw std::logic_error("Unknown parameters value type");
    }

    transformJSON.transformType.inputDimension = currentTransform->GetInputSpaceDimension();
    transformJSON.transformType.outputDimension = currentTransform->GetOutputSpaceDimension();

    transformJSON.numberOfFixedParameters = currentTransform->GetFixedParameters().Size();
    transformJSON.numberOfParameters = currentTransform->GetParameters().Size();
    transformJSON.name = currentTransform->GetObjectName();
    // Todo: needs to be pushed from itk::Transform to itk::TransformBase
    // Available in ITK 5.4.1 and later
    // https://github.com/InsightSoftwareConsortium/ITK/pull/4734
    // transformJSON.inputSpaceName = currentTransform->GetInputSpaceName();
    // transformJSON.inputSpaceName = currentTransform->GetOutputSpaceName();
    if (inMemory)
    {
      if (pString == "CompositeTransform")
      {
        // For composite transforms, we don't store the parameters in memory directly
        transformJSON.fixedParameters = "data:application/vnd.itk.address,0:0";
        transformJSON.parameters = "data:application/vnd.itk.address,0:0";
      }
      else
      {
        std::ostringstream fixedParametersStream;
        fixedParametersStream << "data:application/vnd.itk.address,0:";
        const auto fixedParametersAddr = reinterpret_cast< size_t >( currentTransform->GetFixedParameters().data_block() );
        fixedParametersStream << fixedParametersAddr;
        transformJSON.fixedParameters = fixedParametersStream.str();

        std::ostringstream parametersStream;
        parametersStream << "data:application/vnd.itk.address,0:";
        const auto parametersAddr = reinterpret_cast< size_t >( currentTransform->GetParameters().data_block() );
        parametersStream << parametersAddr;
        transformJSON.parameters = parametersStream.str();
      }
    }
    else
    {
      transformJSON.fixedParameters = "data:application/vnd.itk.path,data/" + std::to_string(count) + "/fixed-parameters.raw";
      transformJSON.parameters = "data:application/vnd.itk.path,data/" + std::to_string(count) + "/parameters.raw";
    }

    auto dictionary = currentTransform->GetMetaDataDictionary();
    metaDataDictionaryToJSON(dictionary, transformJSON.metadata);

    transformListJSON.push_back(transformJSON);
    ++count;
  }

  return transformListJSON;
}

} // end namespace itk

template <>
struct glz::meta<itk::JSONTransformParameterizationEnum> {
  using enum itk::JSONTransformParameterizationEnum;
  static constexpr auto value = glz::enumerate(
    Composite,
    Identity,
    Translation,
    Euler2D,
    Euler3D,
    Rigid2D,
    Rigid3D,
    Rigid3DPerspective,
    Versor,
    VersorRigid3D,
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
    GaussianSmoothingOnUpdateDisplacementField,
    GaussianExponentialDiffeomorphic,
    VelocityField,
    TimeVaryingVelocityField,
    GaussianSmoothingOnUpdateTimeVaryingVelocityField
  );
};

#endif // itkTransformJSON_h

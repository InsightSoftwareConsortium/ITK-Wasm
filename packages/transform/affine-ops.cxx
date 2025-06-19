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
#include "itkOutputTransform.h"
#include "itkInputTextStream.h"
#include "itkAffineTransform.h"
#include "itkSupportInputTransformTypes.h"

#include "glaze/glaze.hpp"
#include <iostream>
#include <sstream>
#include <vector>
#include <variant>
#include <map>

// Define operation structures for JSON parsing
struct TranslateOperation
{
  std::string method = "Translate";
  std::vector<double> translation;
  bool pre = false;
};

struct ScaleOperation
{
  std::string method = "Scale";
  std::variant<double, std::vector<double>> factor;
  bool pre = false;
};

struct RotateOperation
{
  std::string method = "Rotate";
  int axis1;
  int axis2;
  double angle;
  bool pre = false;
};

struct Rotate2DOperation
{
  std::string method = "Rotate2D";
  double angle;
  bool pre = false;
};

struct Rotate3DOperation
{
  std::string method = "Rotate3D";
  std::vector<double> axis;
  double angle;
  bool pre = false;
};

struct ShearOperation
{
  std::string method = "Shear";
  int axis1;
  int axis2;
  double coef;
  bool pre = false;
};

struct SetIdentityOperation
{
  std::string method = "SetIdentity";
};

// Glaze metadata for JSON operations
template<>
struct glz::meta<TranslateOperation>
{
  using T = TranslateOperation;
  static constexpr auto value = object(
    "method", &T::method,
    "translation", &T::translation,
    "pre", &T::pre
  );
};

template<>
struct glz::meta<ScaleOperation>
{
  using T = ScaleOperation;
  static constexpr auto value = object(
    "method", &T::method,
    "factor", &T::factor,
    "pre", &T::pre
  );
};

template<>
struct glz::meta<RotateOperation>
{
  using T = RotateOperation;
  static constexpr auto value = object(
    "method", &T::method,
    "axis1", &T::axis1,
    "axis2", &T::axis2,
    "angle", &T::angle,
    "pre", &T::pre
  );
};

template<>
struct glz::meta<Rotate2DOperation>
{
  using T = Rotate2DOperation;
  static constexpr auto value = object(
    "method", &T::method,
    "angle", &T::angle,
    "pre", &T::pre
  );
};

template<>
struct glz::meta<Rotate3DOperation>
{
  using T = Rotate3DOperation;
  static constexpr auto value = object(
    "method", &T::method,
    "axis", &T::axis,
    "angle", &T::angle,
    "pre", &T::pre
  );
};

template<>
struct glz::meta<ShearOperation>
{
  using T = ShearOperation;
  static constexpr auto value = object(
    "method", &T::method,
    "axis1", &T::axis1,
    "axis2", &T::axis2,
    "coef", &T::coef,
    "pre", &T::pre
  );
};

template<>
struct glz::meta<SetIdentityOperation>
{
  using T = SetIdentityOperation;
  static constexpr auto value = object(
    "method", &T::method
  );
};

template<typename TTransform>
class AffineOpsPipelineFunctor
{
public:
  int operator()(itk::wasm::Pipeline & pipeline)
  {
    using TransformType = TTransform;
    using AffineTransformType = itk::AffineTransform<typename TransformType::ScalarType, TransformType::InputSpaceDimension>;

    using InputTransformType = itk::wasm::InputTransform<AffineTransformType>;
    InputTransformType inputTransform;
    pipeline.add_option("input-transform", inputTransform, "The input affine transform")
      ->required()
      ->type_name("INPUT_TRANSFORM");

    itk::wasm::InputTextStream operationsStream;
    pipeline.add_option("operations", operationsStream, "JSON array of operations to apply")
      ->required()
      ->type_name("INPUT_TEXT_STREAM");

    using OutputTransformType = itk::wasm::OutputTransform<AffineTransformType>;
    OutputTransformType outputTransform;
    pipeline.add_option("output-transform", outputTransform, "The output affine transform")
      ->required()
      ->type_name("OUTPUT_TRANSFORM");

    ITK_WASM_PARSE(pipeline);

    // Read the operations JSON
    std::string operationsJson{std::istreambuf_iterator<char>(operationsStream.Get()),
                               std::istreambuf_iterator<char>()};

    // Parse as a vector of generic JSON objects first
    std::vector<glz::json_t> operations;
    auto parseResult = glz::read_json(operations, operationsJson);
    if (parseResult)
    {
      std::cerr << "Error parsing operations JSON: " << glz::format_error(parseResult, operationsJson) << std::endl;
      return EXIT_FAILURE;
    }

    // Create a new affine transform and copy parameters from input
    auto affineTransform = AffineTransformType::New();

    // Try to cast input transform to affine transform first, otherwise copy parameters
    auto inputAffineTransform = dynamic_cast<const AffineTransformType*>(inputTransform.Get());
    if (inputAffineTransform)
    {
      affineTransform->SetParameters(inputAffineTransform->GetParameters());
      affineTransform->SetFixedParameters(inputAffineTransform->GetFixedParameters());
    }
    else
    {
      // If not an affine transform, initialize as identity and warn user
      std::cerr << "Warning: Input transform is not an AffineTransform. Initializing as identity." << std::endl;
      affineTransform->SetIdentity();
    }

    // Process each operation
    for (const auto& opJson : operations)
    {
      try
      {
        // Convert the JSON object to string for re-parsing
        std::string opJsonStr = glz::write_json(opJson).value_or("{}");

        // Parse the operation as a generic object to extract the method
        std::map<std::string, glz::json_t> opMap;
        auto parseResult = glz::read_json(opMap, opJsonStr);
        if (parseResult)
        {
          std::cerr << "Error parsing operation object: " << glz::format_error(parseResult, opJsonStr) << std::endl;
          return EXIT_FAILURE;
        }

        auto methodIter = opMap.find("method");
        if (methodIter == opMap.end())
        {
          std::cerr << "Each operation must have a 'method' field" << std::endl;
          return EXIT_FAILURE;
        }

        std::string method;
        auto methodResult = glz::read_json(method, glz::write_json(methodIter->second).value_or(""));
        if (methodResult)
        {
          std::cerr << "Error parsing method field" << std::endl;
          return EXIT_FAILURE;
        }

        if (method == "Translate")
        {
          TranslateOperation op;
          auto result = glz::read_json(op, opJsonStr);
          if (result)
          {
            std::cerr << "Error parsing Translate operation: " << glz::format_error(result, opJsonStr) << std::endl;
            return EXIT_FAILURE;
          }

          if (op.translation.size() != AffineTransformType::InputSpaceDimension)
          {
            std::cerr << "Translation vector must have " << AffineTransformType::InputSpaceDimension << " elements" << std::endl;
            return EXIT_FAILURE;
          }

          typename AffineTransformType::OutputVectorType translation;
          for (unsigned int i = 0; i < AffineTransformType::InputSpaceDimension; ++i)
          {
            translation[i] = op.translation[i];
          }

          affineTransform->Translate(translation, op.pre);
        }
        else if (method == "Scale")
        {
          ScaleOperation op;
          auto result = glz::read_json(op, opJsonStr);
          if (result)
          {
            std::cerr << "Error parsing Scale operation: " << glz::format_error(result, opJsonStr) << std::endl;
            return EXIT_FAILURE;
          }

          if (std::holds_alternative<double>(op.factor))
          {
            auto factor = std::get<double>(op.factor);
            affineTransform->Scale(static_cast<typename AffineTransformType::ScalarType>(factor), op.pre);
          }
          else
          {
            auto factorVec = std::get<std::vector<double>>(op.factor);
            if (factorVec.size() != AffineTransformType::InputSpaceDimension)
            {
              std::cerr << "Scale factor vector must have " << AffineTransformType::InputSpaceDimension << " elements" << std::endl;
              return EXIT_FAILURE;
            }

            typename AffineTransformType::OutputVectorType factor;
            for (unsigned int i = 0; i < AffineTransformType::InputSpaceDimension; ++i)
            {
              factor[i] = factorVec[i];
            }
            affineTransform->Scale(factor, op.pre);
          }
        }
        else if (method == "Rotate")
        {
          RotateOperation op;
          auto result = glz::read_json(op, opJsonStr);
          if (result)
          {
            std::cerr << "Error parsing Rotate operation: " << glz::format_error(result, opJsonStr) << std::endl;
            return EXIT_FAILURE;
          }

          affineTransform->Rotate(op.axis1, op.axis2, static_cast<typename AffineTransformType::ScalarType>(op.angle), op.pre);
        }
        else if (method == "Rotate2D")
        {
          if constexpr (AffineTransformType::InputSpaceDimension == 2)
          {
            Rotate2DOperation op;
            auto result = glz::read_json(op, opJsonStr);
            if (result)
            {
              std::cerr << "Error parsing Rotate2D operation: " << glz::format_error(result, opJsonStr) << std::endl;
              return EXIT_FAILURE;
            }

            affineTransform->Rotate2D(static_cast<typename AffineTransformType::ScalarType>(op.angle), op.pre);
          }
          else
          {
            std::cerr << "Rotate2D is only available for 2D transforms" << std::endl;
            return EXIT_FAILURE;
          }
        }
        else if (method == "Rotate3D")
        {
          if constexpr (AffineTransformType::InputSpaceDimension == 3)
          {
            Rotate3DOperation op;
            auto result = glz::read_json(op, opJsonStr);
            if (result)
            {
              std::cerr << "Error parsing Rotate3D operation: " << glz::format_error(result, opJsonStr) << std::endl;
              return EXIT_FAILURE;
            }

            if (op.axis.size() != 3)
            {
              std::cerr << "Rotation axis must have 3 elements" << std::endl;
              return EXIT_FAILURE;
            }

            typename AffineTransformType::OutputVectorType axis;
            for (unsigned int i = 0; i < 3; ++i)
            {
              axis[i] = op.axis[i];
            }

            affineTransform->Rotate3D(axis, static_cast<typename AffineTransformType::ScalarType>(op.angle), op.pre);
          }
          else
          {
            std::cerr << "Rotate3D is only available for 3D transforms" << std::endl;
            return EXIT_FAILURE;
          }
        }
        else if (method == "Shear")
        {
          ShearOperation op;
          auto result = glz::read_json(op, opJsonStr);
          if (result)
          {
            std::cerr << "Error parsing Shear operation: " << glz::format_error(result, opJsonStr) << std::endl;
            return EXIT_FAILURE;
          }

          affineTransform->Shear(op.axis1, op.axis2, static_cast<typename AffineTransformType::ScalarType>(op.coef), op.pre);
        }
        else if (method == "SetIdentity")
        {
          affineTransform->SetIdentity();
        }
        else
        {
          std::cerr << "Unknown operation method: " << method << std::endl;
          return EXIT_FAILURE;
        }
      }
      catch (const std::exception& e)
      {
        std::cerr << "Error processing operation: " << e.what() << std::endl;
        return EXIT_FAILURE;
      }
    }

    outputTransform.Set(affineTransform);

    return EXIT_SUCCESS;
  }
};

int
main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("affine-ops", "Apply operations to an affine transform", argc, argv);

  // Support float and double parameter types, and dimensions 2, 3, and 4
  return itk::wasm::SupportInputTransformTypes<AffineOpsPipelineFunctor, float, double>
    ::Dimensions<2U, 3U, 4U>("input-transform", pipeline);
}

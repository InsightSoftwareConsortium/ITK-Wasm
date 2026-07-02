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

// Design constraint: only image metadata (size, origin, spacing, direction) is read. The fixed and
// moving pixel buffers are NEVER dereferenced, so both images may arrive with empty data buffers.
//
// Dispatch and transform reading: the pipeline supports any transform parameterization at dimensions 2, 3, and
// 4. We dispatch on the transform DIMENSION ourselves (main() below) rather than with
// itk::wasm::SupportInputTransformTypes because that helper's memory-IO type detection deserializes the
// transform input -- which is a TransformList (a JSON array) -- as a single transform object, and so throws for
// every in-memory transform. Instead, readInputTransformDimension() peeks the dimension, and readInputTransform()
// reconstructs the transform generically into the abstract itk::Transform base (both in
// resampleReadInputTransform.h): from the wasm memory store under --memory-io (the path the TypeScript and Python
// bindings use), or from the filesystem otherwise (the path the C++ CTest exercises). The math is always done at
// double precision -- lossless for float32 and float64 inputs, and robust to itk-wasm's .iwt scalar-type
// detection, which can misreport a float64 transform as float32.

#include "itkPipeline.h"
#include "itkInputImage.h"
#include "itkOutputTextStream.h"

#include "itkImage.h"
#include "itkTransform.h"

#include "rapidjson/document.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"

#include "resampleReadInputTransform.h"
#include "resampleBoundingBox.h"

template <unsigned int VDimension>
class PipelineFunctor
{
public:
  int
  operator()(itk::wasm::Pipeline & pipeline)
  {
    constexpr unsigned int Dimension = VDimension;
    using ScalarType = double;
    using TransformType = itk::Transform<ScalarType, Dimension, Dimension>;
    using ImageType = itk::Image<uint8_t, Dimension>;

    // Declaration order defines the positional CLI argument order: transform, fixed, moving, bounding-box.
    std::string transformFileName;
    pipeline
      .add_option(
        "transform", transformFileName, "Spatial transform mapping fixed image points into moving image space")
      ->required()
      ->type_name("INPUT_TRANSFORM");

    itk::wasm::InputImage<ImageType> fixed;
    pipeline.add_option("fixed", fixed, "Fixed image whose grid is resampled (metadata only)")
      ->required()
      ->type_name("INPUT_IMAGE");

    itk::wasm::InputImage<ImageType> moving;
    pipeline.add_option("moving", moving, "Moving image to be sampled (metadata only)")
      ->required()
      ->type_name("INPUT_IMAGE");

    itk::wasm::OutputTextStream boundingBox;
    pipeline.add_option("bounding-box", boundingBox, "The padded moving-image region needed to resample the fixed image grid, as a bounding box (JSON)")
      ->required()
      ->type_name("OUTPUT_JSON");

    int padding = 1;
    pipeline.add_option("-p,--padding", padding, "Pixels of padding added per side (default 1 for linear interpolation)");

    ITK_WASM_PARSE(pipeline);

    // Read the transform generically into the abstract itk::Transform base, from the wasm memory store under
    // --memory-io or from the filesystem otherwise. The returned smart pointer keeps the transform alive.
    typename TransformType::ConstPointer transform;
    ITK_WASM_CATCH_EXCEPTION(pipeline, transform = readInputTransform<Dimension>(transformFileName));

    ResampleBoundingBoxComputer<TransformType> computer;
    ResampleBoundingBoxResult                  result;
    ITK_WASM_CATCH_EXCEPTION(pipeline, computer.Compute(fixed.Get(), moving.Get(), transform, padding, result));

    // Serialize the result to JSON:
    // { "paddedStartIndex": [...], "paddedSize": [...],
    //   "paddedCorners": { "min": [...], "max": [...] }, "corners": { "min": [...], "max": [...] } }
    rapidjson::Document document;
    document.SetObject();
    rapidjson::Document::AllocatorType & allocator = document.GetAllocator();

    auto intArray = [&allocator](const std::vector<int> & values) {
      rapidjson::Value array(rapidjson::kArrayType);
      for (const auto value : values)
      {
        array.PushBack(rapidjson::Value().SetInt(value), allocator);
      }
      return array;
    };
    auto uintArray = [&allocator](const std::vector<unsigned int> & values) {
      rapidjson::Value array(rapidjson::kArrayType);
      for (const auto value : values)
      {
        array.PushBack(rapidjson::Value().SetUint(value), allocator);
      }
      return array;
    };
    auto doubleArray = [&allocator](const std::vector<double> & values) {
      rapidjson::Value array(rapidjson::kArrayType);
      for (const auto value : values)
      {
        array.PushBack(rapidjson::Value().SetDouble(value), allocator);
      }
      return array;
    };

    rapidjson::Value paddedStartIndex = intArray(result.paddedStartIndex);
    document.AddMember("paddedStartIndex", paddedStartIndex, allocator);
    rapidjson::Value paddedSize = uintArray(result.paddedSize);
    document.AddMember("paddedSize", paddedSize, allocator);

    rapidjson::Value paddedCorners(rapidjson::kObjectType);
    rapidjson::Value paddedCornersMin = doubleArray(result.paddedCornersMin);
    paddedCorners.AddMember("min", paddedCornersMin, allocator);
    rapidjson::Value paddedCornersMax = doubleArray(result.paddedCornersMax);
    paddedCorners.AddMember("max", paddedCornersMax, allocator);
    document.AddMember("paddedCorners", paddedCorners, allocator);

    rapidjson::Value corners(rapidjson::kObjectType);
    rapidjson::Value cornersMin = doubleArray(result.cornersMin);
    corners.AddMember("min", cornersMin, allocator);
    rapidjson::Value cornersMax = doubleArray(result.cornersMax);
    corners.AddMember("max", cornersMax, allocator);
    document.AddMember("corners", corners, allocator);

    rapidjson::StringBuffer                    stringBuffer;
    rapidjson::Writer<rapidjson::StringBuffer> writer(stringBuffer);
    document.Accept(writer);

    boundingBox.Get() << stringBuffer.GetString();

    return EXIT_SUCCESS;
  }
};

int
main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline(
    "resample-bounding-box",
    "Compute the padded moving-image region needed to resample the fixed image grid through a transform",
    argc,
    argv);

  // --help / --interface-json / --version do not read any input: dispatch to a default dimension so the functor
  // can emit help / the interface JSON (this is the path itk-wasm bindgen exercises) and exit.
  const auto argCount = pipeline.get_argc();
  const auto argValues = pipeline.get_argv();
  for (int ii = 0; ii < argCount; ++ii)
  {
    const std::string arg(argValues[ii]);
    if (arg == "-h" || arg == "--help" || arg == "--interface-json" || arg == "--version")
    {
      return PipelineFunctor<2U>()(pipeline);
    }
  }

  // Pre-parse just the (positional) transform argument to determine its dimension, then dispatch to the
  // dimension-specialized functor. This mirrors itk::wasm::SupportInputTransformTypes but reads the transform
  // list correctly under --memory-io.
  std::string transformArg;
  auto        transformOption = pipeline.add_option("transform", transformArg, "Input transform");
  ITK_WASM_PRE_PARSE(pipeline);
  pipeline.remove_option(transformOption);

  unsigned int dimension = 0;
  ITK_WASM_CATCH_EXCEPTION(pipeline, dimension = readInputTransformDimension(transformArg));

  switch (dimension)
  {
    case 2U:
      return PipelineFunctor<2U>()(pipeline);
    case 3U:
      return PipelineFunctor<3U>()(pipeline);
    case 4U:
      return PipelineFunctor<4U>()(pipeline);
    default:
    {
      CLI::Error err(
        "Runtime error", "Unsupported transform dimension: only dimensions 2, 3, and 4 are supported.", 1);
      return pipeline.exit(err);
    }
  }
}

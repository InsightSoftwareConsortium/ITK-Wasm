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
// Transform reading: SupportInputTransformTypes dispatches with TTransform = itk::Transform<ScalarType,
// Dim, Dim>, the ABSTRACT base. That base is exactly what the bounding box math needs (TransformPoint is
// virtual), but itk-wasm's InputTransform<T> cannot be used with it: the memory-IO reconstruction calls
// T::New() / CopyInParameters, which require a concrete, instantiable T. So the transform is read
// generically -- for any parameterization -- with the ITK transform file reader into the abstract base.
// (This reads from the filesystem, which is the path exercised by the C++ CTest; wiring the in-memory
// interface for arbitrary transforms is left to a later phase.)

#include "itkPipeline.h"
#include "itkInputImage.h"
#include "itkOutputTextStream.h"
#include "itkSupportInputTransformTypes.h"

#include "itkImage.h"
#include "itkTransformFileReader.h"

#include "rapidjson/document.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"

#include "resampleBoundingBox.h"

template <typename TTransform>
class PipelineFunctor
{
public:
  int
  operator()(itk::wasm::Pipeline & pipeline)
  {
    // SupportInputTransformTypes reliably dispatches the transform DIMENSION, but the itk-wasm .iwt
    // filesystem transform-type detection can misreport a float64 transform's scalar type as float32
    // (it inspects the type string of a transform read with a float-templated IO). Reading a float64
    // transform at single precision drops parameters, so always read at double precision, which is
    // lossless for both float32 and float64 inputs.
    constexpr unsigned int Dimension = TTransform::InputSpaceDimension;
    using ScalarType = double;
    using TransformType = itk::Transform<ScalarType, Dimension, Dimension>;
    using ImageType = itk::Image<uint8_t, Dimension>;

    // Declaration order defines the positional CLI argument order: transform, fixed, moving, output.
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

    itk::wasm::OutputTextStream output;
    pipeline.add_option("output", output, "Output bounding box JSON")->required()->type_name("OUTPUT_JSON");

    int padding = 1;
    pipeline.add_option("-p,--padding", padding, "Pixels of padding added per side (default 1 for linear interpolation)");

    ITK_WASM_PARSE(pipeline);

    // Read the transform generically into the abstract itk::Transform base.
    using TransformReaderType = itk::TransformFileReaderTemplate<ScalarType>;
    auto transformReader = TransformReaderType::New();
    transformReader->SetFileName(transformFileName);
    ITK_WASM_CATCH_EXCEPTION(pipeline, transformReader->Update());

    const auto transformList = transformReader->GetTransformList();
    if (transformList == nullptr || transformList->empty())
    {
      CLI::Error err("Runtime error", "No transform found in the input transform file.", 1);
      return pipeline.exit(err);
    }
    const TransformType * transform = dynamic_cast<const TransformType *>(transformList->front().GetPointer());
    if (transform == nullptr)
    {
      CLI::Error err("Runtime error", "The input transform dimension or scalar type is not supported.", 1);
      return pipeline.exit(err);
    }

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

    output.Get() << stringBuffer.GetString();

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

  return itk::wasm::SupportInputTransformTypes<PipelineFunctor, float, double>::Dimensions<2U, 3U, 4U>("transform",
                                                                                                       pipeline);
}

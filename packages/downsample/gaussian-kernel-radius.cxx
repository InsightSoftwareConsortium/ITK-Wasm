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
#include "itkInputTextStream.h"
#include "itkOutputTextStream.h"

#include "itkGaussianOperator.h"

#include "rapidjson/document.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"


int main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("gaussian-kernel-radius", "Radius in pixels required for effective discrete gaussian filtering.", argc, argv);

  std::vector<uint64_t> size { 1, 1 };
  pipeline.add_option("--size", size, "Size in pixels")->required();

  std::vector<double> sigma { 1.0, 1.0 };
  pipeline.add_option("--sigma", sigma, "Sigma in pixel units")->required();

  uint64_t maxKernelWidth = 32;
  pipeline.add_option("--max-kernel-width", maxKernelWidth, "Maximum kernel width in pixels.");

  double maxKernelError = 0.01;
  pipeline.add_option("--max-kernel-error", maxKernelError, "Maximum kernel error.");

  itk::wasm::OutputTextStream radiusStream;
  pipeline.add_option("radius", radiusStream, "Output kernel radius.")->required()->type_name("OUTPUT_JSON");

  ITK_WASM_PARSE(pipeline);

  if (size.size() != sigma.size())
  {
    std::ostringstream ostrm;
    ostrm << "Size and sigma must have the same length. Size: " << size.size() << " Sigma: " << sigma.size() << ".\n";
    CLI::Error err("Runtime error", ostrm.str(), 1);
    return pipeline.exit(err);
  }

  rapidjson::Document radiusArray;
  radiusArray.SetArray();
  rapidjson::Document::AllocatorType& allocator = radiusArray.GetAllocator();
  for (size_t i = 0; i < size.size(); ++i)
  {
    auto gaussianOperator = itk::GaussianOperator<double, 1>();
    gaussianOperator.SetDirection(0);
    // at most the size in the same direction of a chunk
    const auto constrainedMaxKernelWidth = std::min(maxKernelWidth, size[i]);
    gaussianOperator.SetMaximumKernelWidth(constrainedMaxKernelWidth);
    gaussianOperator.SetMaximumError(maxKernelError);
    const double variance = sigma[i] * sigma[i];
    gaussianOperator.SetVariance(variance);
    gaussianOperator.CreateDirectional();
    radiusArray.PushBack(rapidjson::Value().SetInt(gaussianOperator.GetRadius(0)), allocator);
  }

  rapidjson::StringBuffer stringBuffer;
  rapidjson::Writer<rapidjson::StringBuffer> writer(stringBuffer);
  radiusArray.Accept(writer);

  radiusStream.Get() << stringBuffer.GetString();

  return EXIT_SUCCESS;
}


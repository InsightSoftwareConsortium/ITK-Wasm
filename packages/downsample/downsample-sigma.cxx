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
#include "itkOutputTextStream.h"

#include "rapidjson/document.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"

#include "downsampleSigma.h"

int main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("downsample-sigma", "Compute gaussian kernel sigma values in pixel units for downsampling.", argc, argv);

  std::vector<unsigned int> shrinkFactors { 2, 2 };
  pipeline.add_option("-s,--shrink-factors", shrinkFactors, "Shrink factors")->required()->expected(1,-1);

  itk::wasm::OutputTextStream sigmaStream;
  pipeline.add_option("sigma", sigmaStream, "Output sigmas in pixel units.")->required()->type_name("OUTPUT_JSON");

  ITK_WASM_PARSE(pipeline);

  const auto sigmaValues = downsampleSigma(shrinkFactors);

  rapidjson::Document sigmaArray;
  sigmaArray.SetArray();
  rapidjson::Document::AllocatorType& allocator = sigmaArray.GetAllocator();
  for (const auto & sigmaValue : sigmaValues)
  {
    sigmaArray.PushBack(sigmaValue, allocator);
  }

  rapidjson::StringBuffer stringBuffer;
  rapidjson::Writer<rapidjson::StringBuffer> writer(stringBuffer);
  sigmaArray.Accept(writer);

  sigmaStream.Get() << stringBuffer.GetString();

  return EXIT_SUCCESS;
}

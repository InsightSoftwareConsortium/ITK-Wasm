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
#include "itkOutputTextStream.h"

#include <sstream>
#include <iostream>
#include <atomic>
#include <thread>
#include <vector>

static std::atomic<int> createdThreads(0);

int main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("cxx-threads-test", "A pipeline to test C++11 threads support", argc, argv);

  int numberOfThreads = 4;
  pipeline.add_option("-n,--number-of-threads", numberOfThreads, "The number of threads to use");

  itk::wasm::OutputTextStream outputJson;
  pipeline.add_option("output-json", outputJson, "The output json with test results")->type_name("OUTPUT_JSON");

  ITK_WASM_PARSE(pipeline);

  std::vector<std::thread> threads;
  threads.reserve(numberOfThreads);
  createdThreads = 0;

  for (int i = 0; i < numberOfThreads; ++i)
  {
    threads.emplace_back([i]()
    {
      std::cout << " in thread " << i << std::endl;
      createdThreads++;
    });
  }

  for (auto &t : threads)
  {
    t.join();
  }

  outputJson.Get() << "{ \"createdThreads\": " << createdThreads << " }" << std::endl;
  return EXIT_SUCCESS;
}

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

#include "pthread.h"

static std::atomic<int> createdThreads(0);

void *
thread_entry_point(void * ctx)
{
  size_t id = *((size_t *)ctx);
  printf(" in thread %zu\n", id);
  createdThreads++;
  return 0;
}

int
main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("pthreads-test", "A pipeline to test pthreads support", argc, argv);

  itk::wasm::OutputTextStream outputJson;
  pipeline.add_option("output-json", outputJson, "The output json with test results")->type_name("OUTPUT_JSON");

  ITK_WASM_PARSE(pipeline);

  const int numberOfThreads = pipeline.get_threads();

  // Based on: https://bytecodealliance.org/articles/wasi-threads
  pthread_t threads[512];
  size_t    thread_ids[512];
  createdThreads = 0;
  for (int i = 0; i < numberOfThreads; i++)
  {
    thread_ids[i] = i;
    int ret = pthread_create(&threads[i], NULL, &thread_entry_point, &thread_ids[i]);
    if (ret)
    {
      printf("failed to spawn thread: %s", strerror(ret));
    }
  }

  // Wait for all threads to finish
  for (int i = 0; i < numberOfThreads; i++)
  {
    pthread_join(threads[i], NULL);
  }

  // Write the output JSON
  outputJson.Get() << "{ \"createdThreads\": " << createdThreads << " }" << std::endl;

  return EXIT_SUCCESS;
}

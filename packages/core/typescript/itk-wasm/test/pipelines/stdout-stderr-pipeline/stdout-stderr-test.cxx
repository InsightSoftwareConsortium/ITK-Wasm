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
#include <iostream>

#include "itkPipeline.h"

int main( int argc, char * argv[] )
{
  itk::wasm::Pipeline pipeline("stdout-stderr-test", "Test writing to stdout and stderr", argc, argv);

  ITK_WASM_PARSE(pipeline);

  // Source:
  //  https://www.ncwit.org/blog/you-can-code-can-you-haiku
  //
  std::cout << "I’m writing my code," << std::endl;
  std::cout << "But I do not realize," << std::endl;
  std::cout << "Hours have gone by." << std::endl;

  std::cerr << "The modem humming" << std::endl;
  std::cerr << "Code rapidly compiling." << std::endl;
  std::cerr << "Click. Perfect success." << std::endl;

  return 0;
}

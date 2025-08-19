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
#include <iostream>

int main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("hello", "A simple hello world pipeline", argc, argv);

  // Add an optional message parameter
  std::string message = "Hello Wasm world!";
  pipeline.add_option("--message", message, "Message to display");

  // Add text output for the message
  itk::wasm::OutputTextStream textOutput;
  pipeline.add_option("text-output", textOutput, "Text output")->required()->type_name("OUTPUT_TEXT");

  ITK_WASM_PARSE(pipeline);

  // Output the message to both stdout and the text output stream
  std::cout << message << std::endl;
  
  textOutput.Get() << message << std::endl;

  return EXIT_SUCCESS;
}

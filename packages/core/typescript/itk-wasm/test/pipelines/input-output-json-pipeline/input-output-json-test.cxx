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
#include "itkInputTextStream.h"
#include "itkOutputTextStream.h"

#include <sstream>

int main( int argc, char * argv[] )
{
  itk::wasm::Pipeline pipeline("input-output-json-test", "A pipeline to test JSON IO", argc, argv);

  itk::wasm::InputTextStream inputJson;
  pipeline.add_option("input-json", inputJson, "The input json")->type_name("INPUT_JSON");

  std::string stringChoice = "valuea";
  pipeline.add_option("--string-choice", stringChoice, "A string choice, one of: valuea, valueb, or valuec")->check(CLI::IsMember({"valuea", "valueb", "valuec"}));

  itk::wasm::OutputTextStream outputJson;
  pipeline.add_option("output-json", outputJson, "The output json")->type_name("OUTPUT_JSON");

  ITK_WASM_PARSE(pipeline);

  const size_t bufferLength = 2048;
  char * buffer = new char[bufferLength];
  size_t readLength = 0;

  std::istream & inputTxt = inputJson.Get();
  inputTxt.read( buffer, bufferLength );
  readLength = inputTxt.gcount();
  buffer[readLength] = '\0';

  outputJson.Get().write( buffer, readLength );

  delete[] buffer;

  return EXIT_SUCCESS;
}

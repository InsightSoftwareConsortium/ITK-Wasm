/*=========================================================================
 *
 *  Copyright NumFOCUS
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *=========================================================================*/
#include "itkInputTextStream.h"

#include <string>
#ifndef ITK_WASM_NO_MEMORY_IO
#include "itkWASMExports.h"
#include <sstream>
#include "rapidjson/document.h"
#endif

namespace itk
{
namespace wasm
{

bool lexical_cast(const std::string &input, InputTextStream &inputStream)
{
  if (wasm::Pipeline::GetUseMemoryIO())
  {
#ifndef ITK_WASM_NO_MEMORY_IO
    const unsigned int index = std::stoi(input);
    auto json = getMemoryStoreInputJSON(0, index);
    rapidjson::Document document;
    if (document.Parse(json.c_str()).HasParseError())
      {
      throw std::runtime_error("Could not parse JSON");
      }
    const rapidjson::Value & dataJson = document["data"];
    const std::string dataString( dataJson.GetString() );
    const char * dataPtr = reinterpret_cast< char * >( std::atol(dataString.substr(35).c_str()) );
    const size_t size = document["size"].GetInt();
    const std::string string(dataPtr, size - 1);
    inputStream.SetString(string);
#else
    return false;
#endif
  }
  else
  {
#ifndef ITK_WASM_NO_FILESYSTEM_IO
    inputStream.SetFileName(input);
#else
    return false;
#endif
  }
  return true;
}

} // end namespace wasm
} // end namespace itk

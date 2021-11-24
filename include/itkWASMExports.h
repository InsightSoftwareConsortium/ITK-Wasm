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
#ifndef itkWASMExports_h
#define itkWASMExports_h

#ifndef ITK_WASM_NO_MEMORY_IO
// WebAssembly exports

#include <map>
#include <utility>
#include <vector>

// dataset index, array index
using ArrayStoreSubKeyType = std::pair<unsigned int, unsigned int>;
// isInput, index pair
using ArrayStoreKeyType = std::pair<unsigned int, ArrayStoreSubKeyType>;
using ArrayStoreType = std::map<ArrayStoreKeyType, std::vector<char>>;
static ArrayStoreType ArrayStore;

// isInput, index
using JSONStoreKeyType = std::pair<unsigned int, unsigned int>;
using JSONStoreType = std::map<JSONStoreKeyType, std::string>;
static JSONStoreType JSONStore;

extern "C"
{

size_t itk_wasm_array_alloc(unsigned int isInput, unsigned int index, unsigned int subIndex, size_t size)
{
  const auto subKey = std::make_pair(index, subIndex);
  const auto key = std::make_pair(isInput, subKey);
  if (ArrayStore.count(key))
  {
    ArrayStore[key] = std::vector<char>(size);
  }
  else
  {
    ArrayStore[key].resize(size);
  }
  return reinterpret_cast< size_t >(ArrayStore[key].data());
}

void itk_wasm_array_free_all()
{
  ArrayStore.clear();
}

size_t itk_wasm_json_alloc(unsigned int isInput, unsigned int index, size_t size)
{
  const auto key = std::make_pair(isInput, index);
  if (JSONStore.count(key))
  {
    JSONStore[key] = std::string(size, ' ');
  }
  else
  {
    JSONStore[key].resize(size);
  }
  return reinterpret_cast< size_t >(JSONStore[key].data());
}

void itk_wasm_json_free_all()
{
  JSONStore.clear();
}

} // end extern "C"

#endif // ITK_WASM_NO_MEMORY_IO

#endif

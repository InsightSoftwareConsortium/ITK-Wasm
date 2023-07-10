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
// Workaround for current lack of this function in the wasi toolchain
// Ref: https://github.com/llvm/llvm-project/blob/80e2c26dfdd2e5ab1bbbf747ebff8c316399653c/libcxxabi/src/cxa_thread_atexit.cpp#L4

#ifdef __cplusplus

namespace __cxxabiv1 {

  using Dtor = void(*)(void*);

}

extern "C" {

int __cxa_thread_atexit(__cxxabiv1::Dtor dtor, void* obj, void* dso_symbol) throw()
{
  // Do nothing
  return -1;
}

}

#endif // __cplusplus

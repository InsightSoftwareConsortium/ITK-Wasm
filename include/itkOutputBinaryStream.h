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
#ifndef itkOutputBinaryStream_h
#define itkOutputBinaryStream_h

#include "itkOutputStreamBase.h"

#include <ios>
#include <string>

namespace itk
{
namespace wasm
{

/**
 *\class OutputBinaryStream
 * \brief Output binary std::ostream for an itk::wasm::Pipeline
 *
 * \ingroup WebAssemblyInterface
 */
class OutputBinaryStream: public OutputStreamBase
{
public:
  void
  SetFileName(const std::string & fileName) override
  {
    OutputStreamBase::SetFile(fileName, std::ios_base::binary);
  }
};

} // end namespace wasm
} // end namespace itk

#endif

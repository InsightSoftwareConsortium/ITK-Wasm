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
#ifndef itkInputStreamBase_h
#define itkInputStreamBase_h

#include <ios>
#include <iosfwd> // For istream.
#include <memory> // For unique_ptr.
#include <string>

#include "WebAssemblyInterfaceExport.h"

namespace itk
{
namespace wasm
{

/**
 *\class InputStreamBase
 * \brief Base class of input stream for an itk::wasm::Pipeline
 *
 * This stream is read from the filesystem or memory when ITK_WASM_PARSE_ARGS is called.
 *
 * Call `Get()` to get the std::istream & to use an input to a pipeline.
 *
 * \ingroup WebAssemblyInterface
 */
class WebAssemblyInterface_EXPORT InputStreamBase
{
public:
  std::istream &
  Get()
  {
    return *m_IStream;
  }

  std::istream *
  GetPointer()
  {
    return m_IStream.get();
  }

  void
  SetJSON(const std::string & json);

  virtual void
  SetFileName(const std::string & fileName) = 0;

protected:
  void
  SetFile(const std::string & fileName, const std::ios_base::openmode openMode);

  InputStreamBase() = default;

  // Move semantics for its derived classes:
  InputStreamBase(InputStreamBase &&) = default;
  InputStreamBase &
  operator=(InputStreamBase &&) = default;

  virtual ~InputStreamBase();

private:
  std::unique_ptr<std::istream> m_IStream;
};


WebAssemblyInterface_EXPORT bool
lexical_cast(const std::string & input, InputStreamBase & inputStream);

} // end namespace wasm
} // end namespace itk

#endif

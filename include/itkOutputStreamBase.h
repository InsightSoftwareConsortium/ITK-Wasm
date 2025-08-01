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
#ifndef itkOutputStreamBase_h
#define itkOutputStreamBase_h

#include "itkPipeline.h"
#include "itkWasmStringStream.h"

#include <string>
#ifndef ITK_WASM_NO_MEMORY_IO
#  include <sstream>
#endif
#ifndef ITK_WASM_NO_FILESYSTEM_IO
#  include <fstream>
#endif

#include "WebAssemblyInterfaceExport.h"

namespace itk
{
namespace wasm
{

/**
 *\class OutputStreamBase
 * \brief Base class of output stream for an itk::wasm::Pipeline
 *
 * This stream is written to the filesystem or memory when the object goes out of scope.
 *
 * Call `Get()` to get the std::ostream & to use an output for a pipeline.
 *
 * \ingroup WebAssemblyInterface
 */
class WebAssemblyInterface_EXPORT OutputStreamBase
{
public:
  std::ostream &
  Get()
  {
    return *m_OStream;
  }

  virtual void
  SetFileName(const std::string & fileName) = 0;

  /** Output index. */
  void
  SetIdentifier(const std::string & identifier)
  {
    if (m_DeleteOStream && m_OStream != nullptr)
    {
      delete m_OStream;
    }
    m_DeleteOStream = false;
    m_WasmStringStream = WasmStringStream::New();

    m_OStream = &(m_WasmStringStream->GetStringStream());
    this->m_Identifier = identifier;
  }
  const std::string &
  GetIdentifier() const
  {
    return this->m_Identifier;
  }

protected:
  OutputStreamBase() = default;
  virtual ~OutputStreamBase();

  void
  SetFile(const std::string & fileName, const std::ios_base::openmode openMode)
  {
    if (m_DeleteOStream && m_OStream != nullptr)
    {
      delete m_OStream;
    }
    m_OStream = new std::ofstream(fileName, openMode);
    m_DeleteOStream = true;
  }

private:
  std::ostream * m_OStream{ nullptr };
  bool           m_DeleteOStream{ false };

  std::string m_Identifier;

  WasmStringStream::Pointer m_WasmStringStream;
};


WebAssemblyInterface_EXPORT bool
lexical_cast(const std::string & output, OutputStreamBase & outputStream);

} // end namespace wasm
} // end namespace itk

#endif

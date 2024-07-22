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

#define ITK_TEMPLATE_EXPLICIT_WasmZstdTransformIO
#include "itkWasmZstdTransformIO.h"
#include "zstd.h"
#include "itkWasmIOCommon.h"

namespace itk
{

template <typename TParametersValueType>
WasmZstdTransformIOTemplate<TParametersValueType>
::WasmZstdTransformIOTemplate()
{
}


template <typename TParametersValueType>
WasmZstdTransformIOTemplate<TParametersValueType>
::~WasmZstdTransformIOTemplate()
{
}


template <typename TParametersValueType>
bool
WasmZstdTransformIOTemplate<TParametersValueType>
::CanReadFile(const char *filename)
{
  std::string fname = filename;

  bool extensionFound = false;
  std::string::size_type extensionPos = fname.rfind(".iwt");
  std::string::size_type zstdPos = fname.rfind(".zst");
  if ( extensionPos != std::string::npos && zstdPos != std::string::npos )
    {
    extensionFound = true;
    }

  if ( !extensionFound )
    {
    itkDebugMacro(<< "The filename extension is not recognized");
    return false;
    }

  return true;
}


template <typename TParametersValueType>
void
WasmZstdTransformIOTemplate<TParametersValueType>
::Read()
{
  const std::string path = this->GetFileName();
  std::string::size_type zstdPos = path.rfind(".zst");
  if ( ( zstdPos != std::string::npos )
       && ( zstdPos == path.length() - 4 ) )
  {
    std::ifstream dataStream;
    openFileForReading(dataStream, path.c_str());

    std::ostringstream ostrm;
    ostrm << dataStream.rdbuf();
    auto inputBinary = ostrm.str();


    const size_t decompressedBufferSize = ZSTD_getFrameContentSize(inputBinary.data(), inputBinary.size());
    std::vector<char> decompressedBinary(decompressedBufferSize);

    const size_t decompressedSize = ZSTD_decompress(decompressedBinary.data(), decompressedBufferSize, inputBinary.data(), inputBinary.size());
    decompressedBinary.resize(decompressedSize);

    this->ReadCBOR(nullptr, reinterpret_cast< unsigned char *>(&(decompressedBinary.at(0))), decompressedSize);
    return;
  }

  Superclass::Read();
}


template <typename TParametersValueType>
bool
WasmZstdTransformIOTemplate<TParametersValueType>
::CanWriteFile(const char *name)
{
  std::string filename = name;

  if( filename == "" )
    {
    return false;
    }

  bool extensionFound = false;
  std::string::size_type iwtPos = filename.rfind(".iwt");
  std::string::size_type zstdPos = filename.rfind(".zst");
  if ( iwtPos != std::string::npos && zstdPos != std::string::npos )
    {
    extensionFound = true;
    }

  if ( !extensionFound )
    {
    itkDebugMacro(<< "The filename extension is not recognized");
    return false;
    }

  return true;
}


template <typename TParametersValueType>
void
WasmZstdTransformIOTemplate<TParametersValueType>
::Write()
{
  const std::string path(this->GetFileName());

  std::string::size_type cborPos = path.rfind(".zst");
  if ( ( cborPos != std::string::npos )
       && ( cborPos == path.length() - 4 ) )
  {
    unsigned char * inputBinary;
    const size_t inputBinarySize = this->WriteCBOR(nullptr, &inputBinary, true);

    const size_t compressedBufferSize = ZSTD_compressBound(inputBinarySize);
    std::vector<char> compressedBinary(compressedBufferSize);

    constexpr int compressionLevel = 3;
    const size_t compressedSize = ZSTD_compress(compressedBinary.data(), compressedBufferSize, inputBinary, inputBinarySize, compressionLevel);
    free(inputBinary);
    compressedBinary.resize(compressedSize);

    std::ofstream outputStream;
    openFileForWriting(outputStream, path.c_str(), true, false );
    std::ostream_iterator<char> oIt(outputStream);
    std::copy(compressedBinary.begin(), compressedBinary.end(), oIt);
    return;
  }

  Superclass::Write();
}

ITK_GCC_PRAGMA_DIAG_PUSH()
ITK_GCC_PRAGMA_DIAG(ignored "-Wattributes")

template class WebAssemblyInterface_EXPORT WasmZstdTransformIOTemplate<double>;
template class WebAssemblyInterface_EXPORT WasmZstdTransformIOTemplate<float>;

ITK_GCC_PRAGMA_DIAG_POP()

} // end namespace itk

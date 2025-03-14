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
#ifndef itkWasmZstdImageIO_h
#define itkWasmZstdImageIO_h
#include "WebAssemblyInterfaceExport.h"

#include "itkWasmImageIO.h"

namespace itk
{
/** \class WasmZstdImageIO
 *
 * \brief Read and write an itk::Image in a web-friendly format.
 *
 * This format is intended to facilitate data exchange in itk-wasm.
 * It reads and writes an itk-wasm Image object in a CbOR file on the
 * filesystem with JSON files and binary files for TypedArrays.
 *
 * This class extends WasmImageIO by adding support for zstandard compression.
 *
 * The file extensions used are .iwi, .iwi.cbor, and .iwi.cbor.zst.
 *
 * \ingroup IOFilters
 * \ingroup WebAssemblyInterface
 */
class WebAssemblyInterface_EXPORT WasmZstdImageIO : public WasmImageIO
{
public:
  /** Standard class typedefs. */
  typedef WasmZstdImageIO    Self;
  typedef WasmImageIO        Superclass;
  typedef SmartPointer<Self> Pointer;

  /** Method for creation through the object factory. */
  itkNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkOverrideGetNameOfClassMacro(WasmZstdImageIO);

  /** Determine the file type. Returns true if this ImageIO can read the
   * file specified. */
  bool
  CanReadFile(const char *) override;

  /** Set the spacing and dimension information for the set filename. */
  void
  ReadImageInformation() override;

  /** Reads the data from disk into the memory buffer provided. */
  void
  Read(void * buffer) override;

  /** Determine the file type. Returns true if this ImageIO can write the
   * file specified. */
  bool
  CanWriteFile(const char *) override;

  /** Set the spacing and dimension information for the set filename. */
  void
  WriteImageInformation() override;

  /** Writes the data to disk from the memory buffer provided. Make sure
   * that the IORegions has been set properly. */
  void
  Write(const void * buffer) override;

protected:
  WasmZstdImageIO();
  ~WasmZstdImageIO() override;

private:
  ITK_DISALLOW_COPY_AND_MOVE(WasmZstdImageIO);
};
} // end namespace itk

#endif // itkWasmZstdImageIO_h

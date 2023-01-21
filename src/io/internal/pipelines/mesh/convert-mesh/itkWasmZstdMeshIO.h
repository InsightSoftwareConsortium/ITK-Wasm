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
#ifndef itkWasmZstdMeshIO_h
#define itkWasmZstdMeshIO_h
#include "WebAssemblyInterfaceExport.h"

#include "itkWasmMeshIO.h"

namespace itk
{
/** \class WasmZstdMeshIO
 *
 * \brief Read and write an itk::Mesh in a web-friendly format.
 *
 * This format is intended to facilitate data exchange in itk-wasm.
 * It reads and writes an itk-wasm Mesh object in a CBOR file on the
 * filesystem with JSON files and binary files for TypedArray's.
 * 
 * This class extends WasmMeshIO by adding support for zstandard compression.
 *
 * The file extensions used are .iwm, .iwm.cbor, and .iwm.cbor.zstd.
 * 
 * \ingroup IOFilters
 * \ingroup WebAssemblyInterface
 */
class WebAssemblyInterface_EXPORT WasmZstdMeshIO: public WasmMeshIO
{
public:
  /** Standard class typedefs. */
  typedef WasmZstdMeshIO      Self;
  typedef WasmMeshIO          Superclass;
  typedef SmartPointer< Self > Pointer;

  /** Method for creation through the object factory. */
  itkNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkTypeMacro(WasmZstdMeshIO, WasmMeshIO);

  /** Determine the file type. Returns true if this MeshIO can read the
   * file specified. */
  bool CanReadFile(const char *) override;

  /** Set the spacing and dimension information for the set filename. */
  void ReadMeshInformation() override;

  /** Determine the file type. Returns true if this MeshIO can write the
   * file specified. */
  bool CanWriteFile(const char *) override;

  void Write() override;

protected:
  WasmZstdMeshIO();
  ~WasmZstdMeshIO() override;

private:
  ITK_DISALLOW_COPY_AND_ASSIGN(WasmZstdMeshIO);
};
} // end namespace itk

#endif // itkWasmZstdMeshIO_h

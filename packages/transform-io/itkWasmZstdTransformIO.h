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
#ifndef itkWasmZstdTransformIO_h
#define itkWasmZstdTransformIO_h

#include "itkWasmTransformIO.h"

namespace itk
{
/** \class WasmZstdTransformIO
 *
 * \brief Read and write an itk::Transform in a web-friendly format.
 *
 * This format is intended to facilitate data exchange in itk-wasm.
 * It reads and writes an itk-wasm Transform object in a CbOR file on the
 * filesystem with JSON files and binary files for TypedArrays.
 *
 * This class extends WasmTransformIO by adding support for zstandard compression.
 *
 * The file extensions used are .iwt.cbor.zst.
 *
 * \ingroup IOFilters
 * \ingroup WebAssemblyInterface
 */
template <typename TParametersValueType>
class ITK_TEMPLATE_EXPORT WasmZstdTransformIOTemplate: public WasmTransformIOTemplate<TParametersValueType>
{
public:
  /** Standard class typedefs. */
  using Self = WasmZstdTransformIOTemplate;
  using Superclass = WasmTransformIOTemplate<TParametersValueType>;
  using Pointer = SmartPointer<Self>;

  using ParametersValueType = TParametersValueType;

  /** Method for creation through the object factory. */
  itkNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkTypeMacro(WasmZstdTransformIOTemplate, WasmTransformIOTemplate);

  /** Determine the file type. Returns true if this TransformIO can read the
   * file specified. */
  bool CanReadFile(const char *) override;

  /** Reads the data from disk into the memory buffer provided. */
  void Read() override;

  /** Determine the file type. Returns true if this TransformIO can write the
   * file specified. */
  bool CanWriteFile(const char *) override;

  /** Writes the data to disk from the memory buffer provided. Make sure
   * that the IORegions has been set properly. */
  void Write() override;

protected:
  WasmZstdTransformIOTemplate();
  ~WasmZstdTransformIOTemplate() override;

private:
  ITK_DISALLOW_COPY_AND_ASSIGN(WasmZstdTransformIOTemplate);
};
} // end namespace itk

#endif // itkWasmZstdTransformIO_h

/** Explicit instantiations */
#ifndef ITK_TEMPLATE_EXPLICIT_WasmZstdTransformIO
// Explicit instantiation is required to ensure correct dynamic_cast
// behavior across shared libraries.
//
// IMPORTANT: Since within the same compilation unit,
//            ITK_TEMPLATE_EXPLICIT_<classname> defined and undefined states
//            need to be considered. This code *MUST* be *OUTSIDE* the header
//            guards.
//
#if defined(WebAssemblyInterface_EXPORTS)
//   We are building this library
#  define WebAssemblyInterface_EXPORT_EXPLICIT ITK_FORWARD_EXPORT
#else
//   We are using this library
#  define WebAssemblyInterface_EXPORT_EXPLICIT WebAssemblyInterface_EXPORT
#endif
namespace itk
{
ITK_GCC_PRAGMA_DIAG_PUSH()
ITK_GCC_PRAGMA_DIAG(ignored "-Wattributes")

extern template class WebAssemblyInterface_EXPORT_EXPLICIT WasmZstdTransformIOTemplate<double>;
extern template class WebAssemblyInterface_EXPORT_EXPLICIT WasmZstdTransformIOTemplate<float>;

ITK_GCC_PRAGMA_DIAG_POP()

} // end namespace itk
#undef WebAssemblyInterface_EXPORT_EXPLICIT
#endif

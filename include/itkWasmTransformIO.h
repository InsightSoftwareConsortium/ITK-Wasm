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
#ifndef itkWasmTransformIO_h
#define itkWasmTransformIO_h
#include "WebAssemblyInterfaceExport.h"

#include "itkTransformIOBase.h"
#include "itkMacro.h"
#include <fstream>

#include "itkTransformJSON.h"
#include "cbor.h"

namespace itk
{
/** \class WasmTransformIOTemplate
 *
 * \brief Read and write the an itk::Transform in a format for interfacing in WebAssembly (Wasm).
 *
 * This format is intended to facilitate data exchange in itk-wasm.
 * It reads and writes an itk-wasm Transform object where TypedArrays are
 * replaced by binary files on the filesystem or in a CBOR file.
 *
 * The file extensions used are .iwt and .iwt.cbor.
 *
 * \ingroup IOFilters
 * \ingroup WebAssemblyInterface
 */
template <typename TParametersValueType>
class ITK_TEMPLATE_EXPORT WasmTransformIOTemplate : public TransformIOBaseTemplate<TParametersValueType>
{
public:
  using Self = WasmTransformIOTemplate;
  using Superclass = TransformIOBaseTemplate<TParametersValueType>;
  using Pointer = SmartPointer<Self>;
  using typename Superclass::TransformListType;
  using typename Superclass::TransformPointer;
  using typename Superclass::TransformType;
  using ParametersType = typename TransformType::ParametersType;
  using ParametersValueType = typename TransformType::ParametersValueType;
  using FixedParametersType = typename TransformType::FixedParametersType;
  using FixedParametersValueType = typename TransformType::FixedParametersValueType;

  using ConstTransformListType = typename TransformIOBaseTemplate<ParametersValueType>::ConstTransformListType;

  /** Method for creation through the object factory. */
  itkNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkTypeMacro(WasmTransformIOTemplate, TransformIOBaseTemplate);

  /** Reads the data from disk into the memory buffer provided. */
  void
  Read() override;

  bool
  CanReadFile(const char *) override;

  /** Set the JSON representation of the image information. */
  void
  SetJSON(const TransformListJSON & json, bool inMemory=false);

  /*-------- This part of the interfaces deals with writing data ----- */

  bool
  CanWriteFile(const char *) override;

  void
  Write() override;

#if !defined(ITK_WRAPPING_PARSER)
  /** Get the JSON representation of the mesh information. */
  auto
  GetJSON(bool inMemory=false) -> TransformListJSON;
#endif

protected:
  WasmTransformIOTemplate();
  ~WasmTransformIOTemplate() override;
  void
  PrintSelf(std::ostream & os, Indent indent) const override;

  virtual auto
  ReadTransformInformation() -> const TransformListJSON;
  void
  ReadFixedParameters(const TransformListJSON & json);
  void
  ReadParameters(const TransformListJSON & json);

  void
  WriteTransformInformation();
  void
  WriteFixedParameters();
  void
  WriteParameters();

  void ReadCBOR(void * buffer = nullptr, unsigned char * cborBuffer = nullptr, size_t cborBufferLength = 0);
  size_t WriteCBOR(const void * buffer = nullptr, unsigned char ** cborBuffer = nullptr, bool allocateCBORBuffer = false);

  cbor_item_t * m_CBORRoot{ nullptr };

private:
  ITK_DISALLOW_COPY_AND_ASSIGN(WasmTransformIOTemplate);
};
} // end namespace itk

#endif // itkWasmTransformIO_h

/** Explicit instantiations */
#ifndef ITK_TEMPLATE_EXPLICIT_WasmTransformIO
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

extern template class WebAssemblyInterface_EXPORT_EXPLICIT WasmTransformIOTemplate<double>;
extern template class WebAssemblyInterface_EXPORT_EXPLICIT WasmTransformIOTemplate<float>;

ITK_GCC_PRAGMA_DIAG_POP()

} // end namespace itk
#undef WebAssemblyInterface_EXPORT_EXPLICIT
#endif

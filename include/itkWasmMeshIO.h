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
#ifndef itkWasmMeshIO_h
#define itkWasmMeshIO_h
#include "WebAssemblyInterfaceExport.h"

#include "itkMeshIOBase.h"
#include <fstream>

#include "itkMeshJSON.h"
#include "cbor.h"

namespace itk
{
/** \class WasmMeshIO
 *
 * \brief Read and write the an itk::Mesh in a format for interfacing in WebAssembly (Wasm).
 *
 * This format is intended to facilitate data exchange in itk-wasm.
 * It reads and writes an itk-wasm Mesh object where TypedArrays are
 * replaced by binary files on the filesystem or in a CBOR file.
 *
 * The file extensions used are .iwm and .iwm.cbor.
 * 
 * \ingroup IOFilters
 * \ingroup WebAssemblyInterface
 */
class WebAssemblyInterface_EXPORT WasmMeshIO: public MeshIOBase
{
public:
  /** Standard class typedefs. */
  typedef WasmMeshIO           Self;
  typedef MeshIOBase           Superclass;
  typedef SmartPointer< Self > Pointer;

  /** Method for creation through the object factory. */
  itkNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkTypeMacro(WasmMeshIO, MeshIOBase);

  bool CanReadFile(const char *) override;

  /** Determine the required information and whether need to ReadPoints,
    ReadCells, ReadPointData and ReadCellData */
  void ReadMeshInformation() override;

  /** Reads the data from disk into the memory buffer provided. */
  void ReadPoints(void *buffer) override;

  void ReadCells(void *buffer) override;

  void ReadPointData(void *buffer) override;

  void ReadCellData(void *buffer) override;

  /** Set the JSON representation of the image information. */
  void SetJSON(const MeshJSON & json);

  /*-------- This part of the interfaces deals with writing data ----- */

  /** Writes the data to disk from the memory buffer provided. Make sure
     * that the IORegions has been set properly. */
  bool CanWriteFile(const char *)  override;

  void WriteMeshInformation() override;

  void WritePoints(void *buffer) override;

  void WriteCells(void *buffer) override;

  void WritePointData(void *buffer) override;

  void WriteCellData(void *buffer) override;

  void Write() override;

#if !defined(ITK_WRAPPING_PARSER)
  /** Get the JSON representation of the mesh information. */
  auto GetJSON() -> MeshJSON;
#endif

protected:
  WasmMeshIO();
  ~WasmMeshIO() override;
  void PrintSelf(std::ostream & os, Indent indent) const override;

  /** Reads in the mesh information and populates the related buffers. */
  void ReadCBOR(void * buffer = nullptr, unsigned char * cborBuffer = nullptr, size_t cborBufferLength = 0);
  /** Writes the buffers into the CBOR item and the buffer out to disk. */
  void WriteCBOR();

  cbor_item_t * m_CBORRoot{ nullptr };

private:
  ITK_DISALLOW_COPY_AND_ASSIGN(WasmMeshIO);
};
} // end namespace itk

#endif // itkWasmMeshIO_h

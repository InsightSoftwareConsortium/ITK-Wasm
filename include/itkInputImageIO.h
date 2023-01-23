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
#ifndef itkInputImageIO_h
#define itkInputImageIO_h

#include "itkPipeline.h"
#include "itkWasmImageIOBase.h"
#include "itkWasmImageIO.h"

#ifndef ITK_WASM_NO_MEMORY_IO
#include "itkWasmExports.h"
#endif
#ifndef ITK_WASM_NO_FILESYSTEM_IO
#endif

namespace itk
{
namespace wasm
{

/**
 *\class InputImageIO
 * \brief Input image for an itk::wasm::Pipeline from an itk::ImageIOBase
 *
 * This image is read from the filesystem or memory when ITK_WASM_PARSE_ARGS is called.
 *
 * This class is for the WriteImage itk-wasm pipeline. Most pipelines will use itk::wasm::InputImage.
 *
 * \ingroup WebAssemblyInterface
 */
class InputImageIO
{
public:
  void Set(const WasmImageIOBase * imageIO) {
    this->m_WasmImageIOBase = imageIO;
  }

  const WasmImageIOBase * Get() const {
    return this->m_WasmImageIOBase.GetPointer();
  }

  InputImageIO() = default;
  ~InputImageIO() = default;
protected:
  typename WasmImageIOBase::ConstPointer m_WasmImageIOBase;
};


bool lexical_cast(const std::string &input, InputImageIO &inputImageIO)
{
  if (input.empty())
  {
    return false;
  }

  if (wasm::Pipeline::get_use_memory_io())
  {
#ifndef ITK_WASM_NO_MEMORY_IO
    const unsigned int index = std::stoi(input);
    auto json = getMemoryStoreInputJSON(0, index);
    rapidjson::Document document;
    document.Parse(json.c_str());

    auto wasmImageIO = itk::WasmImageIO::New();
    wasmImageIO->SetJSON(document);

    const unsigned int dimension = wasmImageIO->GetNumberOfDimensions();

    auto wasmImageIOBase = itk::WasmImageIOBase::New();
    const rapidjson::Value & directionJson = document["direction"];
    const std::string directionString( directionJson.GetString() );
    const double * directionPtr = reinterpret_cast< double * >( std::strtoull(directionString.substr(35).c_str(), nullptr, 10) );
    WasmImageIOBase::DirectionContainerType * directionContainer = wasmImageIOBase->GetDirectionContainer();
    directionContainer->resize(dimension*dimension);
    directionContainer->assign(directionPtr, directionPtr + dimension*dimension);

    const rapidjson::Value & dataJson = document["data"];
    const std::string dataString( dataJson.GetString() );
    const char * dataPtr = reinterpret_cast< char * >( std::strtoull(dataString.substr(35).c_str(), nullptr, 10) );
    WasmImageIOBase::PixelDataContainerType * pixelDataContainer = wasmImageIOBase->GetPixelDataContainer();
    const size_t pixelDataBytes = wasmImageIO->GetImageSizeInBytes();
    pixelDataContainer->resize(pixelDataBytes);
    pixelDataContainer->assign(dataPtr, dataPtr + pixelDataBytes);
    wasmImageIOBase->SetImageIO(wasmImageIO, false);
    wasmImageIOBase->SetJSON(json);

    inputImageIO.Set(wasmImageIOBase);
#else
    return false;
#endif
  }
  else
  {
#ifndef ITK_WASM_NO_FILESYSTEM_IO
    auto wasmImageIO = itk::WasmImageIO::New();
    wasmImageIO->SetFileName(input);

    auto wasmImageIOBase = itk::WasmImageIOBase::New();
    wasmImageIOBase->SetImageIO(wasmImageIO);

    inputImageIO.Set(wasmImageIOBase);
#else
    return false;
#endif
  }
  return true;
}

} // end namespace wasm
} // end namespace itk

#endif

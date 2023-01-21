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
#ifndef itkInputMeshIO_h
#define itkInputMeshIO_h

#include "itkPipeline.h"
#include "itkWasmMeshIOBase.h"
#include "itkWasmMeshIO.h"

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
 *\class InputMeshIO
 * \brief Input mesh for an itk::wasm::Pipeline from an itk::MeshIOBase
 *
 * This mesh is read from the filesystem or memory when ITK_WASM_PARSE_ARGS is called.
 *
 * This class is for the WriteMesh itk-wasm pipeline. Most pipelines will use itk::wasm::InputMesh.
 *
 * \ingroup WebAssemblyInterface
 */
class InputMeshIO
{
public:
  void Set(const WasmMeshIOBase * meshIO) {
    this->m_WasmMeshIOBase = meshIO;
  }

  const WasmMeshIOBase * Get() const {
    return this->m_WasmMeshIOBase.GetPointer();
  }

  InputMeshIO() = default;
  ~InputMeshIO() = default;
protected:
  typename WasmMeshIOBase::ConstPointer m_WasmMeshIOBase;
};


bool lexical_cast(const std::string &input, InputMeshIO &inputMeshIO)
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

    auto wasmMeshIO = itk::WasmMeshIO::New();
    wasmMeshIO->SetJSON(document);

    const unsigned int dimension = wasmMeshIO->GetPointDimension();

    auto wasmMeshIOBase = itk::WasmMeshIOBase::New();

    const rapidjson::Value & pointsJson = document["points"];
    const std::string pointsString( pointsJson.GetString() );
    const char * pointsPtr = reinterpret_cast< char * >( std::strtoull(pointsString.substr(35).c_str(), nullptr, 10) );
    WasmMeshIOBase::DataContainerType * pointsContainer = wasmMeshIOBase->GetPointsContainer();
    SizeValueType numberOfBytes = wasmMeshIO->GetNumberOfPoints() * wasmMeshIO->GetPointDimension() * WasmMeshIO::ITKComponentSize( wasmMeshIO->GetPointComponentType() );
    pointsContainer->resize(numberOfBytes);
    pointsContainer->assign(pointsPtr, pointsPtr + numberOfBytes);

    const rapidjson::Value & cellsJson = document["cells"];
    const std::string cellsString( cellsJson.GetString() );
    const char * cellsPtr = reinterpret_cast< char * >( std::strtoull(cellsString.substr(35).c_str(), nullptr, 10) );
    WasmMeshIOBase::DataContainerType * cellsContainer = wasmMeshIOBase->GetCellsContainer();
    numberOfBytes = static_cast< SizeValueType >( wasmMeshIO->GetCellBufferSize() * WasmMeshIO::ITKComponentSize( wasmMeshIO->GetCellComponentType() ));
    cellsContainer->resize(numberOfBytes);
    cellsContainer->assign(cellsPtr, cellsPtr + numberOfBytes);

    const rapidjson::Value & pointDataJson = document["pointData"];
    const std::string pointDataString( pointDataJson.GetString() );
    const char * pointDataPtr = reinterpret_cast< char * >( std::strtoull(pointDataString.substr(35).c_str(), nullptr, 10) );
    WasmMeshIOBase::DataContainerType * pointDataContainer = wasmMeshIOBase->GetPointDataContainer();
    numberOfBytes =
      static_cast< SizeValueType >(
          wasmMeshIO->GetNumberOfPointPixels() * wasmMeshIO->GetNumberOfPointPixelComponents() * WasmMeshIO::ITKComponentSize( wasmMeshIO->GetPointPixelComponentType() )
          );
    pointDataContainer->resize(numberOfBytes);
    pointDataContainer->assign(pointDataPtr, pointDataPtr + numberOfBytes);

    const rapidjson::Value & cellDataJson = document["cellData"];
    const std::string cellDataString( cellDataJson.GetString() );
    const char * cellDataPtr = reinterpret_cast< char * >( std::strtoull(cellDataString.substr(35).c_str(), nullptr, 10) );
    WasmMeshIOBase::DataContainerType * cellDataContainer = wasmMeshIOBase->GetCellDataContainer();
    numberOfBytes =
      static_cast< SizeValueType >(
          wasmMeshIO->GetNumberOfPointPixels() * wasmMeshIO->GetNumberOfPointPixelComponents() * WasmMeshIO::ITKComponentSize( wasmMeshIO->GetPointPixelComponentType() )
          );
    cellDataContainer->resize(numberOfBytes);
    cellDataContainer->assign(cellDataPtr, cellDataPtr + numberOfBytes);

    wasmMeshIOBase->SetMeshIO(wasmMeshIO, false);
    wasmMeshIOBase->SetJSON(json);

    inputMeshIO.Set(wasmMeshIOBase);
#else
    return false;
#endif
  }
  else
  {
#ifndef ITK_WASM_NO_FILESYSTEM_IO
    auto wasmMeshIO = itk::WasmMeshIO::New();
    wasmMeshIO->SetFileName(input);

    auto wasmMeshIOBase = itk::WasmMeshIOBase::New();
    wasmMeshIOBase->SetMeshIO(wasmMeshIO);

    inputMeshIO.Set(wasmMeshIOBase);
#else
    return false;
#endif
  }
  return true;
}

} // end namespace wasm
} // end namespace itk

#endif

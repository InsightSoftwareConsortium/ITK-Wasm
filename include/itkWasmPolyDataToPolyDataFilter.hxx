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
#ifndef itkWasmPolyDataToPolyDataFilter_hxx
#define itkWasmPolyDataToPolyDataFilter_hxx

#include "itkWasmPolyDataToPolyDataFilter.h"
#include "itkNumericTraits.h"
#include "itkCommonEnums.h"
#include "itkHexahedronCell.h"
#include "itkLineCell.h"
#include "itkPolygonCell.h"
#include "itkQuadrilateralCell.h"
#include "itkQuadraticEdgeCell.h"
#include "itkQuadraticTriangleCell.h"
#include "itkTetrahedronCell.h"
#include "itkTriangleCell.h"
#include "itkVertexCell.h"

#include <exception>
#include "itkWasmMapComponentType.h"
#include "itkWasmMapPixelType.h"
#include "itkMeshConvertPixelTraits.h"

#include "itkPolyDataJSON.h"

namespace itk
{

template <typename TPolyData>
WasmPolyDataToPolyDataFilter<TPolyData>
::WasmPolyDataToPolyDataFilter()
{
  this->SetNumberOfRequiredInputs(1);

  typename PolyDataType::Pointer output = static_cast<PolyDataType *>(this->MakeOutput(0).GetPointer());
  this->ProcessObject::SetNumberOfRequiredOutputs(1);
  this->ProcessObject::SetNthOutput(0, output.GetPointer());
}

template <typename TPolyData>
ProcessObject::DataObjectPointer
WasmPolyDataToPolyDataFilter<TPolyData>
::MakeOutput(ProcessObject::DataObjectPointerArraySizeType)
{
  return PolyDataType::New().GetPointer();
}

template <typename TPolyData>
ProcessObject::DataObjectPointer
WasmPolyDataToPolyDataFilter<TPolyData>
::MakeOutput(const ProcessObject::DataObjectIdentifierType &)
{
  return PolyDataType::New().GetPointer();
}

template <typename TPolyData>
auto
WasmPolyDataToPolyDataFilter<TPolyData>
::GetOutput() -> PolyDataType *
{
  // we assume that the first output is of the templated type
  return itkDynamicCastInDebugMode<PolyDataType *>(this->GetPrimaryOutput());
}

template <typename TPolyData>
auto
WasmPolyDataToPolyDataFilter<TPolyData>
::GetOutput() const -> const PolyDataType *
{
  // we assume that the first output is of the templated type
  return itkDynamicCastInDebugMode<const PolyDataType *>(this->GetPrimaryOutput());
}

template <typename TPolyData>
auto
WasmPolyDataToPolyDataFilter<TPolyData>
::GetOutput(unsigned int idx) -> PolyDataType *
{
  auto * out = dynamic_cast<PolyDataType *>(this->ProcessObject::GetOutput(idx));

  if (out == nullptr && this->ProcessObject::GetOutput(idx) != nullptr)
  {
    itkWarningMacro(<< "Unable to convert output number " << idx << " to type " << typeid(PolyDataType).name());
  }
  return out;
}

template <typename TPolyData>
void
WasmPolyDataToPolyDataFilter<TPolyData>
::SetInput(const WasmPolyDataType * input)
{
  // Process object is not const-correct so the const_cast is required here
  this->ProcessObject::SetNthInput(0, const_cast<WasmPolyDataType *>(input));
}

template <typename TPolyData>
void
WasmPolyDataToPolyDataFilter<TPolyData>
::SetInput(unsigned int index, const WasmPolyDataType * polyData)
{
  // Process object is not const-correct so the const_cast is required here
  this->ProcessObject::SetNthInput(index, const_cast<WasmPolyDataType *>(polyData));
}

template <typename TPolyData>
const typename WasmPolyDataToPolyDataFilter<TPolyData>::WasmPolyDataType *
WasmPolyDataToPolyDataFilter<TPolyData>
::GetInput()
{
  return itkDynamicCastInDebugMode<const WasmPolyDataType *>(this->GetPrimaryInput());
}

template <typename TPolyData>
const typename WasmPolyDataToPolyDataFilter<TPolyData>::WasmPolyDataType *
WasmPolyDataToPolyDataFilter<TPolyData>
::GetInput(unsigned int idx)
{
  return itkDynamicCastInDebugMode<const TPolyData *>(this->ProcessObject::GetInput(idx));
}

template <typename TPolyData>
void
WasmPolyDataToPolyDataFilter<TPolyData>
::GenerateData()
{
  // Get the input and output pointers
  const WasmPolyDataType * wasmPolyData = this->GetInput();
  const std::string json(wasmPolyData->GetJSON());
  PolyDataType * polyData = this->GetOutput();

  using PointType = typename TPolyData::PointType;
  using PointPixelType = typename PolyDataType::PixelType;
  using ConvertPointPixelTraits = MeshConvertPixelTraits<PointPixelType>;
  using CellPixelType = typename PolyDataType::CellPixelType;
  using ConvertCellPixelTraits = MeshConvertPixelTraits<CellPixelType>;

  auto deserializedAttempt = glz::read_json<PolyDataJSON>(json);
  if (!deserializedAttempt)
  {
    const std::string descriptiveError = glz::format_error(deserializedAttempt, json);
    itkExceptionMacro("Failed to deserialize PolyDataJSON: " << descriptiveError);
  }
  const auto polyDataJSON = deserializedAttempt.value();
  const auto & polyDataType = polyDataJSON.polyDataType;

  if ( polyDataType.pointPixelComponentType != itk::wasm::MapComponentType<typename ConvertPointPixelTraits::ComponentType>::JSONComponentEnum )
  {
    throw std::runtime_error("Unexpected point pixel component type");
  }

  if ( polyDataType.pointPixelType != itk::wasm::MapPixelType<PointPixelType>::JSONPixelEnum )
  {
    throw std::runtime_error("Unexpected point pixel type");
  }

  if ( polyDataType.cellPixelComponentType != itk::wasm::MapComponentType<typename ConvertCellPixelTraits::ComponentType>::JSONComponentEnum )
  {
    throw std::runtime_error("Unexpected cell pixel component type");
  }

  if ( polyDataType.cellPixelType != itk::wasm::MapPixelType<CellPixelType>::JSONPixelEnum )
  {
    throw std::runtime_error("Unexpected cell pixel type");
  }

  const SizeValueType numberOfPoints = polyDataJSON.numberOfPoints;
  if (numberOfPoints)
  {
    const std::string pointsString = polyDataJSON.points;
    const auto * pointsPtr = reinterpret_cast< PointType * >( std::strtoull(pointsString.substr(35).c_str(), nullptr, 10) );
    polyData->GetPoints()->resize(numberOfPoints);
    polyData->GetPoints()->assign(pointsPtr, pointsPtr + numberOfPoints);
  }

  const SizeValueType verticesBufferSize = polyDataJSON.verticesBufferSize;
  if (verticesBufferSize)
  {
    const std::string verticesString = polyDataJSON.vertices;
    auto verticesPtr = reinterpret_cast< uint32_t * >( std::strtoull(verticesString.substr(35).c_str(), nullptr, 10) );
    polyData->GetVertices()->resize(verticesBufferSize);
    polyData->GetVertices()->assign(verticesPtr, verticesPtr + verticesBufferSize);
  }

  const SizeValueType linesBufferSize = polyDataJSON.linesBufferSize;
  if (linesBufferSize)
  {
    const std::string linesString = polyDataJSON.lines;
    auto linesPtr = reinterpret_cast< uint32_t * >( std::strtoull(linesString.substr(35).c_str(), nullptr, 10) );
    polyData->GetLines()->resize(linesBufferSize);
    polyData->GetLines()->assign(linesPtr, linesPtr + linesBufferSize);
  }

  const SizeValueType polygonsBufferSize = polyDataJSON.polygonsBufferSize;
  if (polygonsBufferSize)
  {
    const std::string polygonsString = polyDataJSON.polygons;
    auto polygonsPtr = reinterpret_cast< uint32_t * >( std::strtoull(polygonsString.substr(35).c_str(), nullptr, 10) );
    polyData->GetPolygons()->resize(polygonsBufferSize);
    polyData->GetPolygons()->assign(polygonsPtr, polygonsPtr + polygonsBufferSize);
  }

  const SizeValueType triangleStripsBufferSize = polyDataJSON.triangleStripsBufferSize;
  if (triangleStripsBufferSize)
  {
    const std::string triangleStripsString = polyDataJSON.triangleStrips;
    auto triangleStripsPtr = reinterpret_cast< uint32_t * >( std::strtoull(triangleStripsString.substr(35).c_str(), nullptr, 10) );
    polyData->GetTriangleStrips()->resize(triangleStripsBufferSize);
    polyData->GetTriangleStrips()->assign(triangleStripsPtr, triangleStripsPtr + triangleStripsBufferSize);
  }

  const SizeValueType numberOfPointPixels = polyDataJSON.numberOfPointPixels;
  if (numberOfPointPixels)
  {
    const SizeValueType pointPixelComponents = polyDataType.pointPixelComponents;
    using PointPixelType = typename TPolyData::PixelType;
    using ConvertPointPixelTraits = MeshConvertPixelTraits<PointPixelType>;
    const std::string pointDataString = polyDataJSON.pointData;
    auto pointDataPtr = reinterpret_cast< typename ConvertPointPixelTraits::ComponentType * >( std::strtoull(pointDataString.substr(35).c_str(), nullptr, 10) );
    polyData->GetPointData()->resize(numberOfPointPixels * pointPixelComponents);
    polyData->GetPointData()->assign(pointDataPtr, pointDataPtr + numberOfPointPixels * pointPixelComponents);
  }

  const SizeValueType numberOfCellPixels = polyDataJSON.numberOfCellPixels;
  if (numberOfCellPixels)
  {
    const SizeValueType cellPixelComponents = polyDataType.cellPixelComponents;
    using CellPixelType = typename TPolyData::CellPixelType;
    using ConvertCellPixelTraits = MeshConvertPixelTraits<CellPixelType>;
    const std::string cellDataString = polyDataJSON.cellData;
    auto cellDataPtr = reinterpret_cast< typename ConvertCellPixelTraits::ComponentType * >( std::strtoull(cellDataString.substr(35).c_str(), nullptr, 10) );
    if (polyData->GetCellData() == nullptr)
    {
      polyData->SetCellData(PolyDataType::CellDataContainer::New());
    }
    polyData->GetCellData()->resize(numberOfCellPixels * cellPixelComponents);
    polyData->GetCellData()->assign(cellDataPtr, cellDataPtr + numberOfCellPixels * cellPixelComponents);
  }
}

template <typename TPolyData>
void
WasmPolyDataToPolyDataFilter<TPolyData>
::PrintSelf(std::ostream & os, Indent indent) const
{
  Superclass::PrintSelf(os, indent);
}
} // end namespace itk

#endif

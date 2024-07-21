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
#ifndef itkWasmPointSetToPointSetFilter_hxx
#define itkWasmPointSetToPointSetFilter_hxx

#include "itkWasmPointSetToPointSetFilter.h"
#include "itkNumericTraits.h"
#include "itkCommonEnums.h"

#include <exception>
#include "itkWasmMapComponentType.h"
#include "itkWasmMapPixelType.h"
#include "itkMeshConvertPixelTraits.h"

#include "itkPointSetJSON.h"

namespace itk
{

template <typename TPointSet>
WasmPointSetToPointSetFilter<TPointSet>
::WasmPointSetToPointSetFilter()
{
  this->SetNumberOfRequiredInputs(1);

  typename PointSetType::Pointer output = static_cast<PointSetType *>(this->MakeOutput(0).GetPointer());
  this->ProcessObject::SetNumberOfRequiredOutputs(1);
  this->ProcessObject::SetNthOutput(0, output.GetPointer());
}

template <typename TPointSet>
ProcessObject::DataObjectPointer
WasmPointSetToPointSetFilter<TPointSet>
::MakeOutput(ProcessObject::DataObjectPointerArraySizeType)
{
  return PointSetType::New().GetPointer();
}

template <typename TPointSet>
ProcessObject::DataObjectPointer
WasmPointSetToPointSetFilter<TPointSet>
::MakeOutput(const ProcessObject::DataObjectIdentifierType &)
{
  return PointSetType::New().GetPointer();
}

template <typename TPointSet>
auto
WasmPointSetToPointSetFilter<TPointSet>
::GetOutput() -> PointSetType *
{
  // we assume that the first output is of the templated type
  return itkDynamicCastInDebugMode<PointSetType *>(this->GetPrimaryOutput());
}

template <typename TPointSet>
auto
WasmPointSetToPointSetFilter<TPointSet>
::GetOutput() const -> const PointSetType *
{
  // we assume that the first output is of the templated type
  return itkDynamicCastInDebugMode<const PointSetType *>(this->GetPrimaryOutput());
}

template <typename TPointSet>
auto
WasmPointSetToPointSetFilter<TPointSet>
::GetOutput(unsigned int idx) -> PointSetType *
{
  auto * out = dynamic_cast<PointSetType *>(this->ProcessObject::GetOutput(idx));

  if (out == nullptr && this->ProcessObject::GetOutput(idx) != nullptr)
  {
    itkWarningMacro(<< "Unable to convert output number " << idx << " to type " << typeid(PointSetType).name());
  }
  return out;
}

template <typename TPointSet>
void
WasmPointSetToPointSetFilter<TPointSet>
::SetInput(const WasmPointSetType * input)
{
  // Process object is not const-correct so the const_cast is required here
  this->ProcessObject::SetNthInput(0, const_cast<WasmPointSetType *>(input));
}

template <typename TPointSet>
void
WasmPointSetToPointSetFilter<TPointSet>
::SetInput(unsigned int index, const WasmPointSetType * pointSet)
{
  // Process object is not const-correct so the const_cast is required here
  this->ProcessObject::SetNthInput(index, const_cast<WasmPointSetType *>(pointSet));
}

template <typename TPointSet>
const typename WasmPointSetToPointSetFilter<TPointSet>::WasmPointSetType *
WasmPointSetToPointSetFilter<TPointSet>
::GetInput()
{
  return itkDynamicCastInDebugMode<const WasmPointSetType *>(this->GetPrimaryInput());
}

template <typename TPointSet>
const typename WasmPointSetToPointSetFilter<TPointSet>::WasmPointSetType *
WasmPointSetToPointSetFilter<TPointSet>
::GetInput(unsigned int idx)
{
  return itkDynamicCastInDebugMode<const TPointSet *>(this->ProcessObject::GetInput(idx));
}

template <typename TPointSet>
void
WasmPointSetToPointSetFilter<TPointSet>
::GenerateData()
{
  // Get the input and output pointers
  const WasmPointSetType * wasmPointSet = this->GetInput();
  PointSetType * pointSet = this->GetOutput();

  using PointPixelType = typename PointSetType::PixelType;
  using ConvertPointPixelTraits = MeshConvertPixelTraits<PointPixelType>;

  const std::string json(wasmPointSet->GetJSON());
  auto deserializedAttempt = glz::read_json<PointSetJSON>(json);
  if (!deserializedAttempt)
  {
    const std::string descriptiveError = glz::format_error(deserializedAttempt, json);
    itkExceptionMacro("Failed to deserialize pointSetJSON: " << descriptiveError);
  }
  const auto pointSetJSON = deserializedAttempt.value();

  const auto dimension = pointSetJSON.pointSetType.dimension;
  const auto numberOfPointPixels = pointSetJSON.numberOfPointPixels;
  const auto pointComponentType = pointSetJSON.pointSetType.pointComponentType;
  const auto pointPixelComponentType = pointSetJSON.pointSetType.pointPixelComponentType;
  const auto pointPixelType = pointSetJSON.pointSetType.pointPixelType;
  const auto numberOfPoints = pointSetJSON.numberOfPoints;

  if (dimension != PointSetType::PointDimension)
  {
    throw std::runtime_error("Unexpected dimension");
  }
  if (numberOfPointPixels && pointPixelComponentType != itk::wasm::MapComponentType<typename ConvertPointPixelTraits::ComponentType>::JSONComponentEnum )
  {
    throw std::runtime_error("Unexpected point pixel component type");
  }

  if (numberOfPointPixels && pointPixelType != itk::wasm::MapPixelType<PointPixelType>::JSONPixelEnum )
  {
    throw std::runtime_error("Unexpected point pixel type");
  }

  pointSet->SetObjectName(pointSetJSON.name);
  pointSet->GetPoints()->resize(pointSetJSON.numberOfPoints);
  using PointType = typename PointSetType::PointType;
  const std::string pointsString = pointSetJSON.points;
  if (numberOfPoints)
  {
    if (pointComponentType == itk::wasm::MapComponentType<typename PointSetType::CoordRepType>::JSONFloatTypeEnum)
    {
      const auto * pointsPtr = reinterpret_cast< PointType * >( std::strtoull(pointsString.substr(35).c_str(), nullptr, 10) );
      pointSet->GetPoints()->assign(pointsPtr, pointsPtr + pointSetJSON.numberOfPoints);
    }
    else if (pointComponentType == itk::wasm::MapComponentType<float>::JSONFloatTypeEnum)
    {
      auto * pointsPtr = reinterpret_cast< float * >( std::strtoull(pointsString.substr(35).c_str(), nullptr, 10) );
      const size_t pointComponents = numberOfPoints * dimension;
      auto * pointsContainerPtr = reinterpret_cast<typename PointSetType::CoordRepType *>(&(pointSet->GetPoints()->at(0)) );
      std::copy(pointsPtr, pointsPtr + pointComponents, pointsContainerPtr);
    }
    else if (pointComponentType == itk::wasm::MapComponentType<double>::JSONFloatTypeEnum)
    {
      auto * pointsPtr = reinterpret_cast< double * >( std::strtoull(pointsString.substr(35).c_str(), nullptr, 10) );
      const size_t pointComponents = numberOfPoints * dimension;
      auto * pointsContainerPtr = reinterpret_cast<typename PointSetType::CoordRepType *>(&(pointSet->GetPoints()->at(0)) );
      std::copy(pointsPtr, pointsPtr + pointComponents, pointsContainerPtr);
    }
    else
    {
      throw std::runtime_error("Unexpected point component type");
    }
  }


  using PointPixelType = typename TPointSet::PixelType;
  const std::string pointDataString = pointSetJSON.pointData;
  auto pointDataPtr = reinterpret_cast< PointPixelType * >( std::strtoull(pointDataString.substr(35).c_str(), nullptr, 10) );
  pointSet->GetPointData()->resize(numberOfPointPixels);
  pointSet->GetPointData()->assign(pointDataPtr, pointDataPtr + numberOfPointPixels);

  auto dictionary = pointSet->GetMetaDataDictionary();
  jsonToMetaDataDictionary(pointSetJSON.metadata, dictionary);
}

template <typename TPointSet>
void
WasmPointSetToPointSetFilter<TPointSet>
::PrintSelf(std::ostream & os, Indent indent) const
{
  Superclass::PrintSelf(os, indent);
}
} // end namespace itk

#endif

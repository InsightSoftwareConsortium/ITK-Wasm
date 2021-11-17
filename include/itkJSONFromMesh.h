/*=========================================================================
 *
 *  Copyright NumFOCUS
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *=========================================================================*/
#ifndef itkJSONFromMesh_h
#define itkJSONFromMesh_h

#include "itkDefaultConvertPixelTraits.h"
#include "itkMeshConvertPixelTraits.h"

#include "itkWASMMapComponentType.h"
#include "itkWASMMapPixelType.h"

#include "rapidjson/document.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"

namespace itk
{


template<typename TMesh >
std::string
JSONFromMesh(TMesh * mesh)
{
  using MeshType = TMesh;
  // using ConvertPixelTraits = DefaultConvertPixelTraits<PixelType>;
  // using ComponentType = typename ConvertPixelTraits::ComponentType;

  rapidjson::Document document;
  document.SetObject();
  rapidjson::Document::AllocatorType& allocator = document.GetAllocator();

  rapidjson::Value meshType;
  meshType.SetObject();

  constexpr unsigned int dimension = MeshType::PointDimension;
  meshType.AddMember("dimension", rapidjson::Value(dimension).Move(), allocator );

  rapidjson::Value pointComponentType;
  pointComponentType.SetString( wasm::MapComponentType<typename MeshType::CoordRepType>::ComponentString.data(), allocator );
  meshType.AddMember("pointComponentType", pointComponentType.Move(), allocator );

  using PointPixelType = typename TMesh::PixelType;
  using ConvertPointPixelTraits = MeshConvertPixelTraits<PointPixelType>;
  rapidjson::Value pointPixelComponentType;
  pointPixelComponentType.SetString( wasm::MapComponentType<typename ConvertPointPixelTraits::ComponentType>::ComponentString.data(), allocator );
  meshType.AddMember("pointPixelComponentType", pointPixelComponentType.Move(), allocator );

  rapidjson::Value pointPixelType;
  pointPixelType.SetString( wasm::MapPixelType<PointPixelType>::PixelString.data(), allocator );
  meshType.AddMember("pointPixelType", pointPixelType.Move(), allocator );

  meshType.AddMember("pointPixelComponents", rapidjson::Value( ConvertPointPixelTraits::GetNumberOfComponents() ).Move(), allocator );

  rapidjson::Value cellComponentType;
  cellComponentType.SetString( wasm::MapComponentType<typename MeshType::CellIdentifier>::ComponentString.data(),allocator );
  meshType.AddMember("cellComponentType", cellComponentType.Move(), allocator );

  using CellPixelType = typename TMesh::CellPixelType;
  using ConvertCellPixelTraits = MeshConvertPixelTraits<CellPixelType>;
  rapidjson::Value cellPixelComponentType;
  cellPixelComponentType.SetString( wasm::MapComponentType<typename ConvertCellPixelTraits::ComponentType>::ComponentString.data(), allocator );
  meshType.AddMember("cellPixelComponentType", cellPixelComponentType.Move(), allocator );

  rapidjson::Value cellPixelType;
  cellPixelType.SetString( wasm::MapPixelType<CellPixelType>::PixelString.data(), allocator );
  meshType.AddMember("cellPixelType", cellPixelType, allocator );

  meshType.AddMember("cellPixelComponents", rapidjson::Value( ConvertCellPixelTraits::GetNumberOfComponents() ).Move(), allocator );

  document.AddMember( "meshType", meshType.Move(), allocator );

  rapidjson::Value numberOfPoints;
  numberOfPoints.SetInt( mesh->GetNumberOfPoints() );
  document.AddMember( "numberOfPoints", numberOfPoints.Move(), allocator );

  rapidjson::Value numberOfPointPixels;
  numberOfPointPixels.SetInt( mesh->GetPointData()->Size() );
  document.AddMember( "numberOfPointPixels", numberOfPointPixels.Move(), allocator );

  rapidjson::Value numberOfCells;
  numberOfCells.SetInt( mesh->GetNumberOfCells() );
  document.AddMember( "numberOfCells", numberOfCells.Move(), allocator );

  rapidjson::Value numberOfCellPixels;
  numberOfCellPixels.SetInt( mesh->GetCellData()->Size() );
  document.AddMember( "numberOfCellPixels", numberOfCellPixels.Move(), allocator );

  rapidjson::Value cellBufferSizeMember;
  SizeValueType cellBufferSize = 2 * mesh->GetNumberOfCells();
  for (typename MeshType::CellsContainerConstIterator ct = mesh->GetCells()->Begin(); ct != mesh->GetCells()->End(); ++ct)
  {
    cellBufferSize += ct->Value()->GetNumberOfPoints();
  }
  cellBufferSizeMember.SetInt( cellBufferSize );
  document.AddMember( "cellBufferSize", cellBufferSizeMember.Move(), allocator );

  const auto pointsAddress = reinterpret_cast< size_t >( &(mesh->GetPoints()[0]) );
  std::ostringstream pointsStream;
  pointsStream << "address:";
  pointsStream << pointsAddress;
  rapidjson::Value pointsString;
  pointsString.SetString( pointsStream.str().c_str(), allocator );
  document.AddMember( "points", pointsString.Move(), allocator );

  std::string cellsDataFileString( "path:data/cells.raw" );
  rapidjson::Value cellsDataFile;
  cellsDataFile.SetString( cellsDataFileString.c_str(), allocator );
  document.AddMember( "cells", cellsDataFile, allocator );

  std::string pointDataDataFileString( "path:data/pointData.raw" );
  rapidjson::Value pointDataDataFile;
  pointDataDataFile.SetString( pointDataDataFileString.c_str(), allocator );
  document.AddMember( "pointData", pointDataDataFile, allocator );

  std::string cellDataDataFileString( "path:data/cellData.raw" );
  rapidjson::Value cellDataDataFile;
  cellDataDataFile.SetString( cellDataDataFileString.c_str(), allocator );
  document.AddMember( "cellData", cellDataDataFile, allocator );

  const auto data = reinterpret_cast< size_t >( &(mesh->GetPoints()[0]) );
  std::ostringstream dataStream;
  dataStream << "address:";
  dataStream << data;
  rapidjson::Value dataString;
  dataString.SetString( dataStream.str().c_str(), allocator );
  document.AddMember( "points", dataString.Move(), allocator );

  rapidjson::StringBuffer stringBuffer;
  rapidjson::Writer<rapidjson::StringBuffer> writer(stringBuffer);
  document.Accept(writer);

  const auto jsonMeshInterface = stringBuffer.GetString();

  return jsonMeshInterface;
}

} // end namespace itk
#endif // itkJSONFromMesh_h

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
#include "itkWasmMeshIOBase.h"

#include "itkWasmMeshIO.h"
#include "itkWasmIOCommon.h"

#include <sstream>

namespace itk
{

WasmPointSetIOBase::WasmPointSetIOBase()
{
  this->m_PointsContainer = DataContainerType::New();
  this->m_PointDataContainer = DataContainerType::New();
}

void
WasmPointSetIOBase::SetMeshIO(MeshIOBase * meshIO, bool readPointSet)
{
  this->m_MeshIOBase = meshIO;
  if (!readPointSet)
  {
    return;
  }

  meshIO->ReadMeshInformation();
  auto wasmMeshIO = itk::WasmMeshIO::New();

  const unsigned int dimension = meshIO->GetPointDimension();
  wasmMeshIO->SetPointDimension(dimension);
  wasmMeshIO->SetPointComponentType(meshIO->GetPointComponentType());
  wasmMeshIO->SetPointPixelType(meshIO->GetPointPixelType());
  wasmMeshIO->SetPointPixelComponentType(meshIO->GetPointPixelComponentType());
  wasmMeshIO->SetNumberOfPointPixelComponents(meshIO->GetNumberOfPointPixelComponents());
  wasmMeshIO->SetNumberOfPoints(meshIO->GetNumberOfPoints());
  wasmMeshIO->SetNumberOfPointPixels(meshIO->GetNumberOfPointPixels());

  auto pointSetJSON = wasmMeshIO->GetPointSetJSON();

  size_t        pointsAddress = 0;
  SizeValueType numberOfBytes =
    meshIO->GetNumberOfPoints() * meshIO->GetPointDimension() * ITKComponentSize(meshIO->GetPointComponentType());
  if (numberOfBytes)
  {
    this->m_PointsContainer->resize(numberOfBytes);
    meshIO->ReadPoints(reinterpret_cast<void *>(&(this->m_PointsContainer->at(0))));
    pointsAddress = reinterpret_cast<size_t>(&(this->m_PointsContainer->at(0)));
  }

  std::ostringstream dataStream;
  dataStream << "data:application/vnd.itk.address,0:";
  dataStream << pointsAddress;
  pointSetJSON.points = dataStream.str();

  numberOfBytes =
    static_cast<SizeValueType>(meshIO->GetNumberOfPointPixels() * meshIO->GetNumberOfPointPixelComponents() *
                               ITKComponentSize(meshIO->GetPointPixelComponentType()));

  size_t pointDataAddress = 0;
  if (numberOfBytes)
  {
    this->m_PointDataContainer->resize(numberOfBytes);
    meshIO->ReadPointData(reinterpret_cast<void *>(&(this->m_PointDataContainer->at(0))));
    pointDataAddress = reinterpret_cast<size_t>(&(this->m_PointDataContainer->at(0)));
  }

  dataStream.str("");
  dataStream << "data:application/vnd.itk.address,0:";
  dataStream << pointDataAddress;
  pointSetJSON.pointData = dataStream.str();

  std::string serialized{};
  auto        ec = glz::write<glz::opts{ .prettify = true }>(pointSetJSON, serialized);
  if (ec)
  {
    itkExceptionMacro("Failed to serialize TransformListJSON");
  }
  this->SetJSON(serialized);
}

void
WasmPointSetIOBase::PrintSelf(std::ostream & os, Indent indent) const
{
  Superclass::PrintSelf(os, indent);

  os << indent << "PointsContainer";
  if (this->m_PointsContainer->size())
  {
    this->m_PointsContainer->Print(os, indent);
  }
  else
  {
    os << ": (empty)" << std::endl;
  }
  os << indent << "PointDataContainer";
  if (this->m_PointDataContainer->size())
  {
    this->m_PointDataContainer->Print(os, indent);
  }
  else
  {
    os << ": (empty)" << std::endl;
  }
}

} // end namespace itk

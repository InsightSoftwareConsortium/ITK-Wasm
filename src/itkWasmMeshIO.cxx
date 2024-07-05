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

#include "itkWasmMeshIO.h"

#include "itkioComponentEnumFromJSON.h"
#include "itkioPixelEnumFromJSON.h"
#include "itkjsonFromIOComponentEnum.h"
#include "itkjsonFromIOPixelEnum.h"
#include "itkIOPixelEnumFromWasmPixelType.h"
#include "itkIOComponentEnumFromWasmComponentType.h"
#include "itkWasmComponentTypeFromIOComponentEnum.h"
#include "itkWasmPixelTypeFromIOPixelEnum.h"
#include "itkWasmIOCommon.h"

#include "itkMetaDataObject.h"
#include "itkIOCommon.h"
#include "itksys/SystemTools.hxx"

#include "itksys/SystemTools.hxx"

#include "cbor.h"

namespace itk
{

WasmMeshIO
::WasmMeshIO()
{
  this->AddSupportedWriteExtension(".iwm");
  this->AddSupportedWriteExtension(".iwm.cbor");
  this->AddSupportedReadExtension(".iwm");
  this->AddSupportedReadExtension(".iwm.cbor");
}


WasmMeshIO
::~WasmMeshIO()
{
}


void
WasmMeshIO
::PrintSelf(std::ostream & os, Indent indent) const
{
  Superclass::PrintSelf(os, indent);
}


bool
WasmMeshIO
::CanReadFile(const char *filename)
{
  // Check the extension first to avoid opening files that do not
  // look like JSON.  The file must have an appropriate extension to be
  // recognized.
  std::string fname = filename;

  bool extensionFound = false;
  std::string::size_type extensionPos = fname.rfind(".iwm");
  if ( extensionPos != std::string::npos )
    {
    extensionFound = true;
    }

  if ( !extensionFound )
    {
    itkDebugMacro(<< "The filename extension is not recognized");
    return false;
    }

  return true;
}


void
WasmMeshIO
::ReadCBOR( void *buffer, unsigned char * cborBuffer, size_t cborBufferLength )
{
  bool cborBufferAllocated = false;
  size_t length = cborBufferLength;
  if (cborBuffer == nullptr)
  {
    FILE* file = fopen(this->GetFileName(), "rb");
    if (file == NULL) {
      itkExceptionMacro("Could not read file: " << this->GetFileName());
    }
    fseek(file, 0, SEEK_END);
    length = (size_t)ftell(file);
    fseek(file, 0, SEEK_SET);
    cborBuffer = static_cast< unsigned char *>(malloc(length));
    cborBufferAllocated = true;
    if (!fread(cborBuffer, length, 1, file))
    {
      itkExceptionMacro("Could not successfully read " << this->GetFileName());

    }
    fclose(file);
  }

  if (this->m_CBORRoot != nullptr) {
    cbor_decref(&(this->m_CBORRoot));
  }
  struct cbor_load_result result;
  this->m_CBORRoot = cbor_load(cborBuffer, length, &result);
  if (cborBufferAllocated)
  {
    free(cborBuffer);
  }
  if (result.error.code != CBOR_ERR_NONE) {
    std::string errorDescription;
    switch (result.error.code) {
      case CBOR_ERR_MALFORMATED: {
        errorDescription = "Malformed data\n";
        break;
      }
      case CBOR_ERR_MEMERROR: {
        errorDescription = "Memory error -- perhaps the input is too large?\n";
        break;
      }
      case CBOR_ERR_NODATA: {
        errorDescription = "The input is empty\n";
        break;
      }
      case CBOR_ERR_NOTENOUGHDATA: {
        errorDescription = "Data seem to be missing -- is the input complete?\n";
        break;
      }
      case CBOR_ERR_SYNTAXERROR: {
        errorDescription = 
            "Syntactically malformed data -- see https://tools.ietf.org/html/rfc7049\n";
        break;
      }
      case CBOR_ERR_NONE: {
        break;
      }
    }
    itkExceptionMacro("" << errorDescription << "There was an error while reading the input near byte " << result.error.position << " (read " << result.read << " bytes in total): ");
  }

  cbor_item_t * index = this->m_CBORRoot;
  const size_t indexCount = cbor_map_size(index);
  const struct cbor_pair * indexHandle = cbor_map_handle(index);
  for (size_t ii = 0; ii < indexCount; ++ii)
  {
    const std::string_view key(reinterpret_cast<char *>(cbor_string_handle(indexHandle[ii].key)), cbor_string_length(indexHandle[ii].key));
    if (key == "meshType")
    {
      const cbor_item_t * meshTypeItem = indexHandle[ii].value;
      const size_t meshTypeCount = cbor_map_size(meshTypeItem);
      const struct cbor_pair * meshTypeHandle = cbor_map_handle(meshTypeItem);
      for (size_t jj = 0; jj < meshTypeCount; ++jj)
      {
        const std::string_view meshTypeKey(reinterpret_cast<char *>(cbor_string_handle(meshTypeHandle[jj].key)), cbor_string_length(meshTypeHandle[jj].key));
        if (meshTypeKey == "dimension")
        {
          const auto dimension = cbor_get_uint32(meshTypeHandle[jj].value);
          this->SetPointDimension( dimension );
        }
        else if (meshTypeKey == "pointComponentType")
        {
          const std::string pointComponentType(reinterpret_cast<char *>(cbor_string_handle(meshTypeHandle[jj].value)), cbor_string_length(meshTypeHandle[jj].value));
          const CommonEnums::IOComponent pointIOComponentType = IOComponentEnumFromWasmComponentType( pointComponentType );
          this->SetPointComponentType( pointIOComponentType );
        }
        else if (meshTypeKey == "pointPixelType")
        {
          const std::string pointPixelType(reinterpret_cast<char *>(cbor_string_handle(meshTypeHandle[jj].value)), cbor_string_length(meshTypeHandle[jj].value));
          const CommonEnums::IOPixel pointIOPixelType = IOPixelEnumFromWasmPixelType( pointPixelType );
          this->SetPointPixelType( pointIOPixelType );
        }
        else if (meshTypeKey == "pointPixelComponentType")
        {
          const std::string pointPixelComponentType(reinterpret_cast<char *>(cbor_string_handle(meshTypeHandle[jj].value)), cbor_string_length(meshTypeHandle[jj].value));
          const CommonEnums::IOComponent pointPixelIOComponentType = IOComponentEnumFromWasmComponentType( pointPixelComponentType );
          this->SetPointPixelComponentType( pointPixelIOComponentType );
        }
        else if (meshTypeKey == "pointPixelComponents")
        {
          const auto components = cbor_get_uint32(meshTypeHandle[jj].value);
          this->SetNumberOfPointPixelComponents( components );
        }
        else if (meshTypeKey == "cellComponentType")
        {
          const std::string cellComponentType(reinterpret_cast<char *>(cbor_string_handle(meshTypeHandle[jj].value)), cbor_string_length(meshTypeHandle[jj].value));
          const CommonEnums::IOComponent cellIOComponentType = IOComponentEnumFromWasmComponentType( cellComponentType );
          this->SetCellComponentType( cellIOComponentType );
        }
        else if (meshTypeKey == "cellPixelType")
        {
          const std::string cellPixelType(reinterpret_cast<char *>(cbor_string_handle(meshTypeHandle[jj].value)), cbor_string_length(meshTypeHandle[jj].value));
          const CommonEnums::IOPixel cellIOPixelType = IOPixelEnumFromWasmPixelType( cellPixelType );
          this->SetCellPixelType( cellIOPixelType );
        }
        else if (meshTypeKey == "cellPixelComponentType")
        {
          const std::string cellPixelComponentType(reinterpret_cast<char *>(cbor_string_handle(meshTypeHandle[jj].value)), cbor_string_length(meshTypeHandle[jj].value));
          const CommonEnums::IOComponent cellPixelIOComponentType = IOComponentEnumFromWasmComponentType( cellPixelComponentType );
          this->SetCellPixelComponentType( cellPixelIOComponentType );
        }
        else if (meshTypeKey == "cellPixelComponents")
        {
          const auto components = cbor_get_uint32(meshTypeHandle[jj].value);
          this->SetNumberOfCellPixelComponents( components );
        }
        else
        {
          itkExceptionMacro("Unexpected meshType cbor map key: " << meshTypeKey);
        }
      }
    }
    else if (key == "numberOfPoints")
    {
      const auto components = cbor_get_uint64(indexHandle[ii].value);
      this->SetNumberOfPoints( components );
      if ( components )
        {
        this->m_UpdatePoints = true;
        }
    }
    else if (key == "numberOfPointPixels")
    {
      const auto components = cbor_get_uint64(indexHandle[ii].value);
      this->SetNumberOfPointPixels( components );
      if ( components )
        {
        this->m_UpdatePointData = true;
        }
    }
    else if (key == "numberOfCells")
    {
      const auto components = cbor_get_uint64(indexHandle[ii].value);
      this->SetNumberOfCells( components );
      if ( components )
        {
        this->m_UpdateCells = true;
        }
    }
    else if (key == "numberOfCellPixels")
    {
      const auto components = cbor_get_uint64(indexHandle[ii].value);
      this->SetNumberOfCellPixels( components );
      if ( components )
        {
        this->m_UpdateCellData = true;
        }
    }
    else if (key == "cellBufferSize")
    {
      const auto components = cbor_get_uint64(indexHandle[ii].value);
      this->SetCellBufferSize( components );
    }
 }
}

auto
WasmMeshIO
::GetJSON() -> MeshJSON
{
  MeshJSON meshJSON;

  meshJSON.meshType.dimension = this->GetPointDimension();

  const auto pointIOComponentType = this->GetPointComponentType();
  meshJSON.meshType.pointComponentType = jsonFloatTypeFromIOComponentEnum( pointIOComponentType );
  const auto pointPixelIOComponentType = this->GetPointPixelComponentType();
  meshJSON.meshType.pointPixelComponentType = jsonComponentTypeFromIOComponentEnum( pointPixelIOComponentType );
  const auto pointIOPixelType = this->GetPointPixelType();
  meshJSON.meshType.pointPixelType = jsonFromIOPixelEnum( pointIOPixelType );
  meshJSON.meshType.pointPixelComponents = this->GetNumberOfPointPixelComponents();

  const auto cellIOComponentType = this->GetCellComponentType();
  meshJSON.meshType.cellComponentType = jsonIntTypeFromIOComponentEnum( cellIOComponentType );
  const auto cellPixelIOComponentType = this->GetCellPixelComponentType();
  meshJSON.meshType.cellPixelComponentType = jsonComponentTypeFromIOComponentEnum( cellPixelIOComponentType );
  const auto cellIOPixelType = this->GetCellPixelType();
  meshJSON.meshType.cellPixelType = jsonFromIOPixelEnum( cellIOPixelType );
  meshJSON.meshType.cellPixelComponents = this->GetNumberOfCellPixelComponents();

  meshJSON.numberOfPoints =this->GetNumberOfPoints();
  meshJSON.numberOfPointPixels = this->GetNumberOfPointPixels();
  meshJSON.numberOfCells = this->GetNumberOfCells();
  meshJSON.numberOfCellPixels = this->GetNumberOfCellPixels();
  meshJSON.cellBufferSize = this->GetCellBufferSize();

  meshJSON.points = "data:application/vnd.itk.path,data/points.raw";
  meshJSON.cells = "data:application/vnd.itk.path,data/cells.raw";
  meshJSON.pointData = "data:application/vnd.itk.path,data/point-data.raw";
  meshJSON.cellData = "data:application/vnd.itk.path,data/cell-data.raw";

  return meshJSON;
}


void
WasmMeshIO
::SetJSON(const MeshJSON & meshJSON)
{
  const auto & meshType = meshJSON.meshType;
  this->SetPointDimension( meshType.dimension );

  const auto pointIOComponentType = ioComponentEnumFromJSON( meshType.pointComponentType );
  this->SetPointComponentType( pointIOComponentType );
  const auto pointPixelIOComponentType = ioComponentEnumFromJSON( meshType.pointPixelComponentType );
  this->SetPointPixelComponentType( pointPixelIOComponentType );
  const auto pointIOPixelType = ioPixelEnumFromJSON( meshType.pointPixelType );
  this->SetPointPixelType( pointIOPixelType );
  this->SetNumberOfPointPixelComponents( meshType.pointPixelComponents );

  const auto cellIOComponentType = ioComponentEnumFromJSON( meshType.cellComponentType );
  this->SetCellComponentType( cellIOComponentType );

  const auto cellPixelIOComponentType = ioComponentEnumFromJSON( meshType.cellPixelComponentType );
  this->SetCellPixelComponentType( cellPixelIOComponentType );
  const auto cellIOPixelType = ioPixelEnumFromJSON( meshType.cellPixelType );
  this->SetCellPixelType( cellIOPixelType );
  this->SetNumberOfCellPixelComponents( meshType.cellPixelComponents );

  this->SetNumberOfPoints( meshJSON.numberOfPoints );
  this->SetNumberOfPointPixels( meshJSON.numberOfPointPixels );
  this->SetNumberOfCells( meshJSON.numberOfCells );
  this->SetNumberOfCellPixels( meshJSON.numberOfCellPixels );
  this->SetCellBufferSize( meshJSON.cellBufferSize );
}


void
WasmMeshIO
::WriteCBOR()
{
  if (this->m_CBORRoot != nullptr) {
    cbor_decref(&(this->m_CBORRoot));
  }
  this->m_CBORRoot = cbor_new_definite_map(10);

  cbor_item_t * index = this->m_CBORRoot;
  cbor_item_t * meshTypeItem = cbor_new_definite_map(9);
  cbor_map_add(meshTypeItem,
    cbor_pair{
      cbor_move(cbor_build_string("dimension")),
      cbor_move(cbor_build_uint32(this->GetPointDimension()))});
  std::string componentString = WasmComponentTypeFromIOComponentEnum( this->GetPointComponentType() );
  cbor_map_add(meshTypeItem,
    cbor_pair{
      cbor_move(cbor_build_string("pointComponentType")),
      cbor_move(cbor_build_string(componentString.c_str()))});
  std::string pixelString = WasmPixelTypeFromIOPixelEnum( this->GetPointPixelType() );
  cbor_map_add(meshTypeItem,
    cbor_pair{
      cbor_move(cbor_build_string("pointPixelType")),
      cbor_move(cbor_build_string(pixelString.c_str()))});
  componentString = WasmComponentTypeFromIOComponentEnum( this->GetPointPixelComponentType() );
  cbor_map_add(meshTypeItem,
    cbor_pair{
      cbor_move(cbor_build_string("pointPixelComponentType")),
      cbor_move(cbor_build_string(componentString.c_str()))});
  cbor_map_add(meshTypeItem,
    cbor_pair{
      cbor_move(cbor_build_string("pointPixelComponents")),
      cbor_move(cbor_build_uint32(this->GetNumberOfPointPixelComponents()))});
  componentString = WasmComponentTypeFromIOComponentEnum( this->GetCellComponentType() );
  cbor_map_add(meshTypeItem,
    cbor_pair{
      cbor_move(cbor_build_string("cellComponentType")),
      cbor_move(cbor_build_string(componentString.c_str()))});
  pixelString = WasmPixelTypeFromIOPixelEnum( this->GetCellPixelType() );
  cbor_map_add(meshTypeItem,
    cbor_pair{
      cbor_move(cbor_build_string("cellPixelType")),
      cbor_move(cbor_build_string(pixelString.c_str()))});
  componentString = WasmComponentTypeFromIOComponentEnum( this->GetCellPixelComponentType() );
  cbor_map_add(meshTypeItem,
    cbor_pair{
      cbor_move(cbor_build_string("cellPixelComponentType")),
      cbor_move(cbor_build_string(componentString.c_str()))});
  cbor_map_add(meshTypeItem,
    cbor_pair{
      cbor_move(cbor_build_string("cellPixelComponents")),
      cbor_move(cbor_build_uint32(this->GetNumberOfCellPixelComponents()))});
  cbor_map_add(index,
    cbor_pair{
      cbor_move(cbor_build_string("meshType")),
      cbor_move(meshTypeItem)});

  cbor_map_add(index,
    cbor_pair{
      cbor_move(cbor_build_string("numberOfPoints")),
      cbor_move(cbor_build_uint64(this->GetNumberOfPoints()))});
  if ( this->GetNumberOfPoints() )
    {
    this->m_UpdatePoints = true;
    }

  cbor_map_add(index,
    cbor_pair{
      cbor_move(cbor_build_string("numberOfPointPixels")),
      cbor_move(cbor_build_uint64(this->GetNumberOfPointPixels()))});
  if ( this->GetNumberOfPointPixels() )
    {
    this->m_UpdatePointData = true;
    }

  cbor_map_add(index,
      cbor_pair{
        cbor_move(cbor_build_string("numberOfCells")),
        cbor_move(cbor_build_uint64(this->GetNumberOfCells()))});
  if ( this->GetNumberOfCells() )
    {
    this->m_UpdateCells = true;
    }

  cbor_map_add(index,
      cbor_pair{
        cbor_move(cbor_build_string("numberOfCellPixels")),
        cbor_move(cbor_build_uint64(this->GetNumberOfCellPixels()))});
  if ( this->GetNumberOfCellPixels() )
    {
    this->m_UpdateCellData = true;
    }

  cbor_map_add(index,
      cbor_pair{
        cbor_move(cbor_build_string("cellBufferSize")),
        cbor_move(cbor_build_uint64(this->GetCellBufferSize()))});
}

void
WasmMeshIO
::ReadMeshInformation()
{
  this->SetByteOrderToLittleEndian();

  if ( fileNameIsCBOR(this->GetFileName()) )
  {
    this->ReadCBOR();
    return;
  }

  const std::string path = this->GetFileName();
  const auto indexPath = path + "/index.json";
  const auto dataPath = path + "/data";

  std::ifstream inputStream;
  openFileForReading( inputStream, indexPath.c_str(), true );
  std::string str((std::istreambuf_iterator<char>(inputStream)), std::istreambuf_iterator<char>());
  auto        deserializedAttempt = glz::read_json<itk::MeshJSON>(str);
  if (!deserializedAttempt)
  {
    const std::string descriptiveError = glz::format_error(deserializedAttempt, str);
    itkExceptionMacro("Failed to deserialize MeshJSON: " << descriptiveError);
  }
  auto meshJSON = deserializedAttempt.value();

  this->SetJSON(meshJSON);

  if ( this->GetNumberOfPoints() )
    {
    this->m_UpdatePoints = true;
    }

  if ( this->GetNumberOfPointPixels() )
    {
    this->m_UpdatePointData = true;
    }

  if ( this->GetNumberOfCells() )
    {
    this->m_UpdateCells = true;
    }

  if ( this->GetNumberOfCellPixels() )
    {
    this->m_UpdateCellData = true;
    }
}


void
WasmMeshIO
::ReadPoints( void *buffer )
{
  const SizeValueType numberOfBytesToBeRead =
    static_cast< SizeValueType >( this->GetNumberOfPoints() * this->GetPointDimension() * ITKComponentSize( this->GetPointComponentType() ) );

  if ( fileNameIsCBOR(this->GetFileName()) )
  {
    readCBORBuffer(this->m_CBORRoot, "points", buffer, numberOfBytesToBeRead);
    return;
  }

  std::ifstream dataStream;
  const std::string path(this->GetFileName());
  const std::string dataFile = path + "/data/points.raw";
  openFileForReading( dataStream, dataFile.c_str() );

  if ( !readBufferAsBinary( dataStream, buffer, numberOfBytesToBeRead ) )
    {
    itkExceptionMacro(<< "Read failed: Wanted "
                      << numberOfBytesToBeRead
                      << " bytes, but read "
                      << dataStream.gcount() << " bytes.");
    }
}


void
WasmMeshIO
::ReadCells( void *buffer )
{
  const SizeValueType numberOfBytesToBeRead =
    static_cast< SizeValueType >( this->GetCellBufferSize() * ITKComponentSize( this->GetCellComponentType() ));

  if ( fileNameIsCBOR(this->GetFileName()) )
  {
    readCBORBuffer(this->m_CBORRoot, "cells", buffer, numberOfBytesToBeRead);
    return;
  }

  const std::string path(this->GetFileName());
  const std::string dataPath = "data/cells.raw";
  std::ifstream dataStream;
  const std::string dataFile = path + "/" + dataPath;
  openFileForReading( dataStream, dataFile.c_str() );

  if ( !readBufferAsBinary( dataStream, buffer, numberOfBytesToBeRead ) )
    {
    itkExceptionMacro(<< "Read failed: Wanted "
                      << numberOfBytesToBeRead
                      << " bytes, but read "
                      << dataStream.gcount() << " bytes.");
    }
}


void
WasmMeshIO
::ReadPointData( void *buffer )
{
  const SizeValueType numberOfBytesToBeRead =
    static_cast< SizeValueType >( this->GetNumberOfPointPixels() * this->GetNumberOfPointPixelComponents() * ITKComponentSize( this->GetPointPixelComponentType() ));

  if ( fileNameIsCBOR(this->GetFileName()) )
  {
    readCBORBuffer(this->m_CBORRoot, "pointData", buffer, numberOfBytesToBeRead);
    return;
  }

  const std::string path(this->GetFileName());
  const std::string dataPath = "data/point-data.raw";
  std::ifstream dataStream;
  const std::string dataFile = path + "/" + dataPath;
  openFileForReading( dataStream, dataFile.c_str() );

  if ( !readBufferAsBinary( dataStream, buffer, numberOfBytesToBeRead ) )
    {
    itkExceptionMacro(<< "Read failed: Wanted "
                      << numberOfBytesToBeRead
                      << " bytes, but read "
                      << dataStream.gcount() << " bytes.");
    }
}


void
WasmMeshIO
::ReadCellData( void *buffer )
{
  const SizeValueType numberOfBytesToBeRead =
    static_cast< SizeValueType >( this->GetNumberOfCellPixels() * this->GetNumberOfCellPixelComponents() * ITKComponentSize( this->GetCellPixelComponentType() ));

  if ( fileNameIsCBOR(this->GetFileName()) )
  {
    readCBORBuffer(this->m_CBORRoot, "cellData", buffer, numberOfBytesToBeRead);
    return;
  }

  const std::string path(this->GetFileName());
  const std::string dataPath = "data/cell-data.raw";
  std::ifstream dataStream;
  const std::string dataFile = path + "/" + dataPath;
  openFileForReading( dataStream, dataFile.c_str() );

  if ( !readBufferAsBinary( dataStream, buffer, numberOfBytesToBeRead ) )
    {
    itkExceptionMacro(<< "Read failed: Wanted "
                      << numberOfBytesToBeRead
                      << " bytes, but read "
                      << dataStream.gcount() << " bytes.");
    }
}


bool
WasmMeshIO
::CanWriteFile(const char *name)
{
  std::string filename = name;

  if( filename == "" )
    {
    return false;
    }

  bool extensionFound = false;
  std::string::size_type extensionPos = filename.rfind(".iwm");
  if ( extensionPos != std::string::npos )
    {
    extensionFound = true;
    }

  if ( !extensionFound )
    {
    itkDebugMacro(<< "The filename extension is not recognized");
    return false;
    }

  return true;
}


void
WasmMeshIO
::WriteMeshInformation()
{
  if ( fileNameIsCBOR(this->GetFileName()) )
  {
    this->WriteCBOR();
    return;
  }

  const std::string path = this->GetFileName();
  const auto indexPath = path + "/index.json";
  const auto dataPath = path + "/data";
  if ( !itksys::SystemTools::FileExists(path, false) )
    {
      itksys::SystemTools::MakeDirectory(path);
    }
  if ( !itksys::SystemTools::FileExists(dataPath, false) )
    {
      itksys::SystemTools::MakeDirectory(dataPath);
    }

  const auto meshJSON = this->GetJSON();

  if ( this->GetNumberOfPoints() )
    {
    this->m_UpdatePoints = true;
    }

  if ( this->GetNumberOfPointPixels() )
    {
    this->m_UpdatePointData = true;
    }

  if ( this->GetNumberOfCells() )
    {
    this->m_UpdateCells = true;
    }

  if ( this->GetNumberOfCellPixels() )
    {
    this->m_UpdateCellData = true;
    }

  std::string serialized{};
  auto ec = glz::write<glz::opts{ .prettify = true }>(meshJSON, serialized);
  if (ec)
  {
    itkExceptionMacro("Failed to serialize MeshJSON");
  }
  std::ofstream outputStream;
  openFileForWriting(outputStream, indexPath.c_str(), true, true);
  outputStream << serialized;
  outputStream.close();
}


void
WasmMeshIO
::WritePoints( void *buffer )
{
  const SizeValueType numberOfBytes = this->GetNumberOfPoints() * this->GetPointDimension() * ITKComponentSize( this->GetPointComponentType() );

  if (fileNameIsCBOR(this->GetFileName()))
  {
    writeCBORBuffer(this->m_CBORRoot, "points", buffer, numberOfBytes, this->GetPointComponentType() );
    return;
  }

  const std::string path(this->GetFileName());
  const std::string filePath = "data/points.raw";
  const std::string fileName = path + "/" + filePath;
  std::ofstream outputStream;
  openFileForWriting( outputStream, fileName, true, false );
  outputStream.write(static_cast< const char * >( buffer ), numberOfBytes);
  if (outputStream.tellp() != numberOfBytes )
    {
    itkExceptionMacro(<< "Write failed: Wanted to write "
                      << numberOfBytes
                      << " bytes, but wrote "
                      << outputStream.tellp() << " bytes.");
    }
}


void
WasmMeshIO
::WriteCells( void *buffer )
{
  const SizeValueType numberOfBytes = this->GetCellBufferSize() * ITKComponentSize( this->GetCellComponentType() );

  if (fileNameIsCBOR(this->GetFileName()))
  {
    writeCBORBuffer(this->m_CBORRoot, "cells", buffer, numberOfBytes, this->GetCellComponentType() );
    return;
  }

  const std::string path(this->GetFileName());
  const std::string filePath = "data/cells.raw";
  const std::string fileName = path + "/" + filePath;
  std::ofstream outputStream;
  openFileForWriting( outputStream, fileName, true, false );
  outputStream.write(static_cast< const char * >( buffer ), numberOfBytes); \
  if (outputStream.tellp() != numberOfBytes )
    {
    itkExceptionMacro(<< "Write failed: Wanted to write "
                      << numberOfBytes
                      << " bytes, but wrote "
                      << outputStream.tellp() << " bytes.");
    }
}


void
WasmMeshIO
::WritePointData( void *buffer )
{
  const SizeValueType numberOfBytes = this->GetNumberOfPointPixels() * this->GetNumberOfPointPixelComponents() * ITKComponentSize( this->GetPointPixelComponentType() );

  if (fileNameIsCBOR(this->GetFileName()))
  {
    writeCBORBuffer(this->m_CBORRoot, "pointData", buffer, numberOfBytes, this->GetPointPixelComponentType() );
    return;
  }

  const std::string path(this->GetFileName());
  const std::string filePath = "data/point-data.raw";
  const std::string fileName = path + "/" + filePath;
  std::ofstream outputStream;
  openFileForWriting( outputStream, fileName, true, false );
  outputStream.write(static_cast< const char * >( buffer ), numberOfBytes); \
  if (outputStream.tellp() != numberOfBytes )
    {
    itkExceptionMacro(<< "Write failed: Wanted to write "
                      << numberOfBytes
                      << " bytes, but wrote "
                      << outputStream.tellp() << " bytes.");
    }
}


void
WasmMeshIO
::WriteCellData( void *buffer )
{
  const SizeValueType numberOfBytes = this->GetNumberOfPointPixels() * this->GetNumberOfPointPixelComponents() * ITKComponentSize( this->GetCellPixelComponentType() );

  if (fileNameIsCBOR(this->GetFileName()))
  {
    writeCBORBuffer(this->m_CBORRoot, "cellData", buffer, numberOfBytes, this->GetCellPixelComponentType() );
    return;
  }

  const std::string path(this->GetFileName());
  const std::string filePath = "data/cell-data.raw";
  const std::string fileName = path + "/" + filePath;
  std::ofstream outputStream;
  openFileForWriting( outputStream, fileName, true, false );
  outputStream.write(static_cast< const char * >( buffer ), numberOfBytes); \
  if (outputStream.tellp() != numberOfBytes )
    {
    itkExceptionMacro(<< "Write failed: Wanted to write "
                      << numberOfBytes
                      << " bytes, but wrote "
                      << outputStream.tellp() << " bytes.");
    }
}

void
WasmMeshIO
::Write()
{
  if (fileNameIsCBOR(this->GetFileName()))
    {
    unsigned char* cborBuffer;
    size_t cborBufferSize;
    size_t length = cbor_serialize_alloc(this->m_CBORRoot, &cborBuffer, &cborBufferSize);

    FILE* file = fopen(this->GetFileName(), "wb");
    fwrite(cborBuffer, 1, length, file);
    free(cborBuffer);
    fclose(file);

    cbor_decref(&(this->m_CBORRoot));
    }
}

} // end namespace itk

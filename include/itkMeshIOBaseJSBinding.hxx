/*=========================================================================
 *
 *  Copyright Insight Software Consortium
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
#ifndef itkMeshIOBaseJSBinding_hxx
#define itkMeshIOBaseJSBinding_hxx
#if defined(EMSCRIPTEN)

#include "itkMeshIOBaseJSBinding.h"

#include "itkMeshIOBase.h"

namespace itk
{

template< typename TMeshIO >
MeshIOBaseJSBinding< TMeshIO >
::MeshIOBaseJSBinding()
{
  this->m_MeshIO = MeshIOType::New();
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetFileName(std::string fileName)
{
  this->m_MeshIO->SetFileName( fileName );
}


template< typename TMeshIO >
std::string
MeshIOBaseJSBinding< TMeshIO >
::GetFileName() const
{
  return this->m_MeshIO->GetFileName();
}


template< typename TMeshIO >
bool
MeshIOBaseJSBinding< TMeshIO >
::CanReadFile( std::string fileName )
{
  return this->m_MeshIO->CanReadFile( fileName.c_str() );
}


template< typename TMeshIO >
bool
MeshIOBaseJSBinding< TMeshIO >
::CanWriteFile( std::string fileName )
{
  return this->m_MeshIO->CanWriteFile( fileName.c_str() );
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetPointPixelType( IOPixelType pixelType )
{
  return this->m_MeshIO->SetPointPixelType( pixelType );
}


template< typename TMeshIO >
typename MeshIOBaseJSBinding< TMeshIO >::IOPixelType
MeshIOBaseJSBinding< TMeshIO >
::GetPointPixelType() const
{
  return this->m_MeshIO->GetPointPixelType();
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetCellPixelType( IOPixelType pixelType )
{
  return this->m_MeshIO->SetCellPixelType( pixelType );
}


template< typename TMeshIO >
typename MeshIOBaseJSBinding< TMeshIO >::IOPixelType
MeshIOBaseJSBinding< TMeshIO >
::GetCellPixelType() const
{
  return this->m_MeshIO->GetCellPixelType();
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetFileType( FileType fileType )
{
  return this->m_MeshIO->SetFileType( fileType );
}


template< typename TMeshIO >
typename MeshIOBaseJSBinding< TMeshIO >::FileType
MeshIOBaseJSBinding< TMeshIO >
::GetFileType() const
{
  return this->m_MeshIO->GetFileType();
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetByteOrder( ByteOrder byteOrder )
{
  return this->m_MeshIO->SetByteOrder( byteOrder );
}


template< typename TMeshIO >
typename MeshIOBaseJSBinding< TMeshIO >::ByteOrder
MeshIOBaseJSBinding< TMeshIO >
::GetByteOrder() const
{
  return this->m_MeshIO->GetByteOrder();
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetPointComponentType( IOComponentType componentType )
{
  return this->m_MeshIO->SetPointComponentType( componentType );
}


template< typename TMeshIO >
typename MeshIOBaseJSBinding< TMeshIO >::IOComponentType
MeshIOBaseJSBinding< TMeshIO >
::GetPointComponentType() const
{
  return this->m_MeshIO->GetPointComponentType();
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetCellComponentType( IOComponentType componentType )
{
  return this->m_MeshIO->SetCellComponentType( componentType );
}


template< typename TMeshIO >
typename MeshIOBaseJSBinding< TMeshIO >::IOComponentType
MeshIOBaseJSBinding< TMeshIO >
::GetCellComponentType() const
{
  return this->m_MeshIO->GetCellComponentType();
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetPointPixelComponentType( IOComponentType componentType )
{
  return this->m_MeshIO->SetPointPixelComponentType( componentType );
}


template< typename TMeshIO >
typename MeshIOBaseJSBinding< TMeshIO >::IOComponentType
MeshIOBaseJSBinding< TMeshIO >
::GetPointPixelComponentType() const
{
  return this->m_MeshIO->GetPointPixelComponentType();
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetCellPixelComponentType( IOComponentType componentType )
{
  return this->m_MeshIO->SetCellPixelComponentType( componentType );
}


template< typename TMeshIO >
typename MeshIOBaseJSBinding< TMeshIO >::IOComponentType
MeshIOBaseJSBinding< TMeshIO >
::GetCellPixelComponentType() const
{
  return this->m_MeshIO->GetCellPixelComponentType();
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetNumberOfPointPixelComponents( unsigned int components )
{
  this->m_MeshIO->SetNumberOfPointPixelComponents( components );
}


template< typename TMeshIO >
unsigned int
MeshIOBaseJSBinding< TMeshIO >
::GetNumberOfPointPixelComponents() const
{
  return this->m_MeshIO->GetNumberOfPointPixelComponents();
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetNumberOfCellPixelComponents( unsigned int components )
{
  this->m_MeshIO->SetNumberOfCellPixelComponents( components );
}


template< typename TMeshIO >
unsigned int
MeshIOBaseJSBinding< TMeshIO >
::GetNumberOfCellPixelComponents() const
{
  return this->m_MeshIO->GetNumberOfCellPixelComponents();
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetPointDimension( unsigned int dimension )
{
  this->m_MeshIO->SetPointDimension( dimension );
}


template< typename TMeshIO >
unsigned int
MeshIOBaseJSBinding< TMeshIO >
::GetPointDimension() const
{
  return this->m_MeshIO->GetPointDimension();
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetNumberOfPoints( unsigned long points )
{
  this->m_MeshIO->SetNumberOfPoints( points );
}


template< typename TMeshIO >
unsigned long
MeshIOBaseJSBinding< TMeshIO >
::GetNumberOfPoints() const
{
  return static_cast< unsigned long >( this->m_MeshIO->GetNumberOfPoints() );
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetNumberOfCells( unsigned long points )
{
  this->m_MeshIO->SetNumberOfCells( points );
}


template< typename TMeshIO >
unsigned long
MeshIOBaseJSBinding< TMeshIO >
::GetNumberOfCells() const
{
  return static_cast< unsigned long >( this->m_MeshIO->GetNumberOfCells() );
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetNumberOfPointPixels( unsigned long points )
{
  this->m_MeshIO->SetNumberOfPointPixels( points );
}


template< typename TMeshIO >
unsigned long
MeshIOBaseJSBinding< TMeshIO >
::GetNumberOfPointPixels() const
{
  return static_cast< unsigned long >( this->m_MeshIO->GetNumberOfPointPixels() );
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetNumberOfCellPixels( unsigned long points )
{
  this->m_MeshIO->SetNumberOfCellPixels( points );
}


template< typename TMeshIO >
unsigned long
MeshIOBaseJSBinding< TMeshIO >
::GetNumberOfCellPixels() const
{
  return static_cast< unsigned long >( this->m_MeshIO->GetNumberOfCellPixels() );
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetCellBufferSize( unsigned long points )
{
  this->m_MeshIO->SetCellBufferSize( points );
}


template< typename TMeshIO >
unsigned long
MeshIOBaseJSBinding< TMeshIO >
::GetCellBufferSize() const
{
  return static_cast< unsigned long >( this->m_MeshIO->GetCellBufferSize() );
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetUpdatePoints( bool update )
{
  this->m_MeshIO->SetUpdatePoints( update );
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetUpdatePointData( bool update )
{
  this->m_MeshIO->SetUpdatePointData( update );
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetUpdateCells( bool update )
{
  this->m_MeshIO->SetUpdateCells( update );
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetUpdateCellData( bool update )
{
  this->m_MeshIO->SetUpdateCellData( update );
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::ReadMeshInformation()
{
  this->m_MeshIO->ReadMeshInformation();
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::WriteMeshInformation()
{
  this->m_MeshIO->WriteMeshInformation();
}


template< typename TMeshIO >
unsigned long
MeshIOBaseJSBinding< TMeshIO >
::GetIOComponentSizeInBytes( IOComponentType componentType )
{
  switch( componentType )
    {
  case itk::CommonEnums::IOComponent::UCHAR:
    return sizeof(unsigned char);
  case itk::CommonEnums::IOComponent::CHAR:
    return sizeof(signed char);
  case itk::CommonEnums::IOComponent::USHORT:
    return sizeof(unsigned short);
  case itk::CommonEnums::IOComponent::SHORT:
    return sizeof(signed short);
  case itk::CommonEnums::IOComponent::UINT:
    return sizeof(unsigned int);
  case itk::CommonEnums::IOComponent::INT:
    return sizeof(signed int);
  case itk::CommonEnums::IOComponent::ULONG:
    return sizeof(unsigned long);
  case itk::CommonEnums::IOComponent::LONG:
    return sizeof(signed long);
  case itk::CommonEnums::IOComponent::ULONGLONG:
    return sizeof(unsigned long long);
  case itk::CommonEnums::IOComponent::LONGLONG:
    return sizeof(signed long long);
  case itk::CommonEnums::IOComponent::FLOAT:
    return sizeof(float);
  case itk::CommonEnums::IOComponent::DOUBLE:
    return sizeof(double);
  case itk::CommonEnums::IOComponent::LDOUBLE:
    return sizeof(long double);
  case itk::CommonEnums::IOComponent::UNKNOWNCOMPONENTTYPE:
  default:
    return 0;
    }
}


template< typename TMeshIO >
emscripten::val
MeshIOBaseJSBinding< TMeshIO >
::ReadPoints()
{
  const unsigned long components = this->GetNumberOfPoints() * this->GetPointDimension();
  m_PointsBuffer.reserve( components * this->GetIOComponentSizeInBytes( this->GetPointComponentType() ));
  this->m_MeshIO->ReadPoints( reinterpret_cast< void * >( m_PointsBuffer.data() ) );
  switch( this->m_MeshIO->GetPointComponentType() )
    {
  case itk::CommonEnums::IOComponent::UCHAR:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned char * >( m_PointsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Uint8Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::CHAR:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed char * >( m_PointsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Int8Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::USHORT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned short * >( m_PointsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Uint16Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::SHORT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed short * >( m_PointsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Int16Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::UINT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned int * >( m_PointsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Uint32Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::INT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed int * >( m_PointsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Int32Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::ULONG:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned long * >( m_PointsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("BigUint64Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::LONG:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed long * >( m_PointsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("BigInt64Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::ULONGLONG:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned long * >( m_PointsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("BigUint64Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::LONGLONG:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed long * >( m_PointsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("BigInt64Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::FLOAT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< float * >( m_PointsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Float32Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::DOUBLE:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< double * >( m_PointsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Float64Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::UNKNOWNCOMPONENTTYPE:
  default:
    return emscripten::val::undefined();
    }
}


template< typename TMeshIO >
emscripten::val
MeshIOBaseJSBinding< TMeshIO >
::ReadCells()
{
  const unsigned long components = this->GetCellBufferSize();
  m_CellsBuffer.reserve( components * this->GetIOComponentSizeInBytes( this->GetCellComponentType() ));
  this->m_MeshIO->ReadCells( reinterpret_cast< void * >( m_CellsBuffer.data() ) );
  switch( this->m_MeshIO->GetCellComponentType() )
    {
  case itk::CommonEnums::IOComponent::UCHAR:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned char * >( m_CellsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Uint8Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::CHAR:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed char * >( m_CellsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Int8Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::USHORT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned short * >( m_CellsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Uint16Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::SHORT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed short * >( m_CellsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Int16Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::UINT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned int * >( m_CellsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Uint32Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::INT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed int * >( m_CellsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Int32Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::ULONG:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned long * >( m_CellsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("BigUint64Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::LONG:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed long * >( m_CellsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("BigInt64Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::ULONGLONG:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned long * >( m_CellsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("BigUint64Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::LONGLONG:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed long * >( m_CellsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("BigInt64Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::FLOAT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< float * >( m_CellsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Float32Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::DOUBLE:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< double * >( m_CellsBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Float64Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::UNKNOWNCOMPONENTTYPE:
  default:
    return emscripten::val::undefined();
    }
}


template< typename TMeshIO >
emscripten::val
MeshIOBaseJSBinding< TMeshIO >
::ReadPointData()
{
  const unsigned long components = this->GetNumberOfPointPixelComponents() * this->GetNumberOfPointPixels();
  m_PointDataBuffer.reserve( components * this->GetIOComponentSizeInBytes( this->GetPointPixelComponentType() ));
  this->m_MeshIO->ReadPointData( reinterpret_cast< void * >( m_PointDataBuffer.data() ) );
  switch( this->m_MeshIO->GetPointComponentType() )
    {
  case itk::CommonEnums::IOComponent::UCHAR:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned char * >( m_PointDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Uint8Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::CHAR:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed char * >( m_PointDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Int8Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::USHORT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned short * >( m_PointDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Uint16Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::SHORT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed short * >( m_PointDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Int16Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::UINT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned int * >( m_PointDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Uint32Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::INT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed int * >( m_PointDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Int32Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::ULONG:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned long * >( m_PointDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("BigUint64Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::LONG:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed long * >( m_PointDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("BigInt64Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::ULONGLONG:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned long * >( m_PointDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("BigUint64Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::LONGLONG:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed long * >( m_PointDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("BigInt64Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::FLOAT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< float * >( m_PointDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Float32Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::DOUBLE:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< double * >( m_PointDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Float64Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::UNKNOWNCOMPONENTTYPE:
  default:
    return emscripten::val::undefined();
    }
}


template< typename TMeshIO >
emscripten::val
MeshIOBaseJSBinding< TMeshIO >
::ReadCellData()
{
  const unsigned long components = this->GetNumberOfCellPixelComponents() * this->GetNumberOfCellPixels();
  m_CellDataBuffer.reserve( components * this->GetIOComponentSizeInBytes( this->GetCellPixelComponentType() ));
  this->m_MeshIO->ReadCellData( reinterpret_cast< void * >( m_CellDataBuffer.data() ) );
  switch( this->m_MeshIO->GetCellComponentType() )
    {
  case itk::CommonEnums::IOComponent::UCHAR:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned char * >( m_CellDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Uint8Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::CHAR:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed char * >( m_CellDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Int8Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::USHORT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned short * >( m_CellDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Uint16Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::SHORT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed short * >( m_CellDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Int16Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::UINT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned int * >( m_CellDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Uint32Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::INT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed int * >( m_CellDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Int32Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::ULONG:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned long * >( m_CellDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("BigUint64Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::LONG:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed long * >( m_CellDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("BigInt64Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::ULONGLONG:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned long * >( m_CellDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("BigUint64Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::LONGLONG:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed long * >( m_CellDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("BigInt64Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::FLOAT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< float * >( m_CellDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Float32Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::DOUBLE:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< double * >( m_CellDataBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Float64Array");
      emscripten::val data = array.new_( components );
      data.call<void>( "set", view );
      return data;
      }
  case itk::CommonEnums::IOComponent::UNKNOWNCOMPONENTTYPE:
  default:
    return emscripten::val::undefined();
    }
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::WritePoints( uintptr_t cBuffer )
{
  this->m_MeshIO->WritePoints( reinterpret_cast< void * >( cBuffer ));
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::WriteCells( uintptr_t cBuffer )
{
  this->m_MeshIO->WriteCells( reinterpret_cast< void * >( cBuffer ));
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::WritePointData( uintptr_t cBuffer )
{
  this->m_MeshIO->WritePointData( reinterpret_cast< void * >( cBuffer ));
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::WriteCellData( uintptr_t cBuffer )
{
  this->m_MeshIO->WriteCellData( reinterpret_cast< void * >( cBuffer ));
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::Write()
{
  this->m_MeshIO->Write();
}


template< typename TMeshIO >
void
MeshIOBaseJSBinding< TMeshIO >
::SetUseCompression( bool compression )
{
  this->m_MeshIO->SetUseCompression( compression );
}

} // end namespace itk

#endif // #if defined(EMSCRIPTEN)
#endif

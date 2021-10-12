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
#ifndef itkImageIOBaseJSBinding_hxx
#define itkImageIOBaseJSBinding_hxx
#if defined(EMSCRIPTEN)

#include "itkImageIOBaseJSBinding.h"

#include "itkImageIOBase.h"
#include "itkImageIORegion.h"

namespace itk
{

template< typename TImageIO >
ImageIOBaseJSBinding< TImageIO >
::ImageIOBaseJSBinding()
{
  this->m_ImageIO = ImageIOType::New();
}


template< typename TImageIO >
void
ImageIOBaseJSBinding< TImageIO >
::SetNumberOfDimensions( unsigned int numberOfDimensions )
{
  this->m_ImageIO->SetNumberOfDimensions( numberOfDimensions );
}


template< typename TImageIO >
unsigned int
ImageIOBaseJSBinding< TImageIO >
::GetNumberOfDimensions() const
{
  return this->m_ImageIO->GetNumberOfDimensions();
}


template< typename TImageIO >
void
ImageIOBaseJSBinding< TImageIO >
::SetFileName(std::string fileName)
{
  this->m_ImageIO->SetFileName( fileName );
}


template< typename TImageIO >
std::string
ImageIOBaseJSBinding< TImageIO >
::GetFileName() const
{
  return this->m_ImageIO->GetFileName();
}


template< typename TImageIO >
bool
ImageIOBaseJSBinding< TImageIO >
::CanReadFile( std::string fileName )
{
  return this->m_ImageIO->CanReadFile( fileName.c_str() );
}


template< typename TImageIO >
bool
ImageIOBaseJSBinding< TImageIO >
::CanWriteFile( std::string fileName )
{
  return this->m_ImageIO->CanWriteFile( fileName.c_str() );
}


template< typename TImageIO >
void
ImageIOBaseJSBinding< TImageIO >
::ReadImageInformation()
{
  return this->m_ImageIO->ReadImageInformation();
}


template< typename TImageIO >
void
ImageIOBaseJSBinding< TImageIO >
::WriteImageInformation()
{
  return this->m_ImageIO->WriteImageInformation();
}


template< typename TImageIO >
void
ImageIOBaseJSBinding< TImageIO >
::SetDimensions( unsigned int i, unsigned long dimension )
{
  this->m_ImageIO->SetDimensions( i, dimension );
}


template< typename TImageIO >
unsigned long
ImageIOBaseJSBinding< TImageIO >
::GetDimensions( unsigned int i ) const
{
  return this->m_ImageIO->GetDimensions(i);
}


template< typename TImageIO >
void
ImageIOBaseJSBinding< TImageIO >
::SetOrigin( unsigned int i, double dimension )
{
  this->m_ImageIO->SetOrigin( i, dimension );
}


template< typename TImageIO >
double
ImageIOBaseJSBinding< TImageIO >
::GetOrigin( unsigned int i ) const
{
  return this->m_ImageIO->GetOrigin(i);
}


template< typename TImageIO >
void
ImageIOBaseJSBinding< TImageIO >
::SetSpacing( unsigned int i, double dimension )
{
  this->m_ImageIO->SetSpacing( i, dimension );
}


template< typename TImageIO >
double
ImageIOBaseJSBinding< TImageIO >
::GetSpacing( unsigned int i ) const
{
  return this->m_ImageIO->GetSpacing( i );
}


template< typename TImageIO >
typename ImageIOBaseJSBinding< TImageIO >::AxisDirectionType
ImageIOBaseJSBinding< TImageIO >
::GetDirection( unsigned int i ) const
{
  return this->m_ImageIO->GetDirection( i );
}


template< typename TImageIO >
void
ImageIOBaseJSBinding< TImageIO >
::SetDirection( unsigned int i, const AxisDirectionType direction )
{
  return this->m_ImageIO->SetDirection( i, direction );
}

template< typename TImageIO >
typename ImageIOBaseJSBinding< TImageIO >::AxisDirectionType
ImageIOBaseJSBinding< TImageIO >
::GetDefaultDirection( unsigned int i ) const
{
  return this->m_ImageIO->GetDefaultDirection( i );
}

template< typename TImageIO >
void
ImageIOBaseJSBinding< TImageIO >
::SetPixelType( IOPixelType pixelType )
{
  return this->m_ImageIO->SetPixelType( pixelType );
}


template< typename TImageIO >
typename ImageIOBaseJSBinding< TImageIO >::IOPixelType
ImageIOBaseJSBinding< TImageIO >
::GetPixelType() const
{
  return this->m_ImageIO->GetPixelType();
}


template< typename TImageIO >
void
ImageIOBaseJSBinding< TImageIO >
::SetComponentType( IOComponentType componentType )
{
  return this->m_ImageIO->SetComponentType( componentType );
}


template< typename TImageIO >
typename ImageIOBaseJSBinding< TImageIO >::IOComponentType
ImageIOBaseJSBinding< TImageIO >
::GetComponentType() const
{
  return this->m_ImageIO->GetComponentType();
}


template< typename TImageIO >
unsigned long
ImageIOBaseJSBinding< TImageIO >
::GetImageSizeInPixels() const
{
  return static_cast< unsigned long >( this->m_ImageIO->GetImageSizeInPixels() );
}


template< typename TImageIO >
unsigned long
ImageIOBaseJSBinding< TImageIO >
::GetImageSizeInBytes() const
{
  return static_cast< unsigned long >( this->m_ImageIO->GetImageSizeInBytes() );
}


template< typename TImageIO >
unsigned long
ImageIOBaseJSBinding< TImageIO >
::GetImageSizeInComponents() const
{
  return static_cast< unsigned long >( this->m_ImageIO->GetImageSizeInComponents() );
}


template< typename TImageIO >
unsigned int
ImageIOBaseJSBinding< TImageIO >
::GetNumberOfComponents() const
{
  return this->m_ImageIO->GetNumberOfComponents();
}


template< typename TImageIO >
void
ImageIOBaseJSBinding< TImageIO >
::SetNumberOfComponents(unsigned int components)
{
  return this->m_ImageIO->SetNumberOfComponents( components );
}


template< typename TImageIO >
emscripten::val
ImageIOBaseJSBinding< TImageIO >
::Read()
{
  const unsigned int dimension = this->m_ImageIO->GetNumberOfDimensions();
  itk::ImageIORegion ioRegion( dimension );
  for( unsigned int dim = 0; dim < dimension; ++dim )
    {
    ioRegion.SetSize( dim, this->m_ImageIO->GetDimensions( dim ) );
    }
  this->m_ImageIO->SetIORegion( ioRegion );

  const unsigned long imageSizeInBytes = this->GetImageSizeInBytes();
  m_PixelBuffer.reserve( imageSizeInBytes );
  this->m_ImageIO->Read( reinterpret_cast< void * >( m_PixelBuffer.data() ) );
  const unsigned long components = this->GetImageSizeInComponents();
  emscripten::val bufferObject = emscripten::val::global("SharedArrayBuffer");
  if (!bufferObject.as<bool>())
    {
    // We do not have SharedArrayBuffer.
    bufferObject = emscripten::val::global("ArrayBuffer");
    }
  emscripten::val buffer = bufferObject.new_(emscripten::val(imageSizeInBytes));
  switch( this->m_ImageIO->GetComponentType() )
    {
  case itk::ImageIOBase::IOComponentEnum::UCHAR:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned char * >( m_PixelBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Uint8Array");
      emscripten::val data = array.new_( buffer );
      data.call<void>( "set", view );
      return data;
      }
  case itk::ImageIOBase::IOComponentEnum::CHAR:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed char * >( m_PixelBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Int8Array");
      emscripten::val data = array.new_( buffer );
      data.call<void>( "set", view );
      return data;
      }
  case itk::ImageIOBase::IOComponentEnum::USHORT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned short * >( m_PixelBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Uint16Array");
      emscripten::val data = array.new_( buffer );
      data.call<void>( "set", view );
      return data;
      }
  case itk::ImageIOBase::IOComponentEnum::SHORT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed short * >( m_PixelBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Int16Array");
      emscripten::val data = array.new_( buffer );
      data.call<void>( "set", view );
      return data;
      }
  case itk::ImageIOBase::IOComponentEnum::UINT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned int * >( m_PixelBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Uint32Array");
      emscripten::val data = array.new_( buffer );
      data.call<void>( "set", view );
      return data;
      }
  case itk::ImageIOBase::IOComponentEnum::INT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed int * >( m_PixelBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Int32Array");
      emscripten::val data = array.new_( buffer );
      data.call<void>( "set", view );
      return data;
      }
  case itk::ImageIOBase::IOComponentEnum::ULONG:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned long * >( m_PixelBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("BigUint64Array");
      emscripten::val data = array.new_( buffer );
      data.call<void>( "set", view );
      return data;
      }
  case itk::ImageIOBase::IOComponentEnum::LONG:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed long * >( m_PixelBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("BigInt64Array");
      emscripten::val data = array.new_( buffer );
      data.call<void>( "set", view );
      return data;
      }
  case itk::ImageIOBase::IOComponentEnum::ULONGLONG:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< unsigned long * >( m_PixelBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("BigUint64Array");
      emscripten::val data = array.new_( buffer );
      data.call<void>( "set", view );
      return data;
      }
  case itk::ImageIOBase::IOComponentEnum::LONGLONG:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< signed long * >( m_PixelBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("BigInt64Array");
      emscripten::val data = array.new_( buffer );
      data.call<void>( "set", view );
      return data;
      }
  case itk::ImageIOBase::IOComponentEnum::FLOAT:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< float * >( m_PixelBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Float32Array");
      emscripten::val data = array.new_( buffer );
      data.call<void>( "set", view );
      return data;
      }
  case itk::ImageIOBase::IOComponentEnum::DOUBLE:
      {
      const emscripten::val view( emscripten::typed_memory_view( components, reinterpret_cast< double * >( m_PixelBuffer.data() ) ) );
      emscripten::val array = emscripten::val::global("Float64Array");
      emscripten::val data = array.new_( buffer );
      data.call<void>( "set", view );
      return data;
      }
  case itk::ImageIOBase::IOComponentEnum::UNKNOWNCOMPONENTTYPE:
  default:
    return emscripten::val::undefined();
    }
}


template< typename TImageIO >
void
ImageIOBaseJSBinding< TImageIO >
::Write( uintptr_t cBuffer )
{
  const unsigned int dimension = this->m_ImageIO->GetNumberOfDimensions();
  itk::ImageIORegion ioRegion( dimension );
  for( unsigned int dim = 0; dim < dimension; ++dim )
    {
    ioRegion.SetSize( dim, this->m_ImageIO->GetDimensions( dim ) );
    }
  this->m_ImageIO->SetIORegion( ioRegion );

  this->m_ImageIO->Write( reinterpret_cast< void * >( cBuffer ));
}


template< typename TImageIO >
void
ImageIOBaseJSBinding< TImageIO >
::SetUseCompression( bool compression )
{
  this->m_ImageIO->SetUseCompression( compression );
}

} // end namespace itk

#endif // #if defined(EMSCRIPTEN)
#endif

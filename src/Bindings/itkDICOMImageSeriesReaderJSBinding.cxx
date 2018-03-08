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
#include <string>
#include <vector>
#include <fstream>

#include <emscripten/val.h>
#include <emscripten.h>
#include <emscripten/bind.h>

#include "itkDCMTKSeriesFileNames.h"
#include "itkImageIOBase.h"
#include "itkImageSeriesReader.h"
#include "itkDCMTKImageIO.h"
#include "itkVectorImage.h"

namespace itk
{

/** \class DICOMImageSeriesReaderJSBinding
 *
 * \brief Provides a JavaScript binding interface to
 * itk::DICOMImageSeriesReader.
 */
class DICOMImageSeriesReaderJSBinding
{
public:
  static const unsigned int ImageDimension = 3;

  typedef DCMTKSeriesFileNames::FileNamesContainerType FileNamesContainerType;

  /** Enums used to manipulate the pixel type. The pixel type provides
   * context for automatic data conversions (for instance, RGB to
   * SCALAR, VECTOR to SCALAR). */
  typedef ImageIOBase::IOPixelType IOPixelType;
  /** Set/Get the type of the pixel. The PixelTypes provides context
   * to the IO mechanisms for data conversions.  PixelTypes can be
   * SCALAR, RGB, RGBA, VECTOR, COVARIANTVECTOR, POINT, INDEX. If
   * the PIXELTYPE is SCALAR, then the NumberOfComponents should be 1.
   * Any other of PIXELTYPE will have more than one component. */
  void SetIOPixelType( IOPixelType pixelType )
    {
    m_IOPixelType = pixelType;
    }

  IOPixelType GetIOPixelType()
    {
    return m_IOPixelType;
    }

  /** Enums used to manipulate the component type. The component type
   * refers to the actual storage class associated with either a
   * SCALAR pixel type or elements of a compound pixel.
   */
  typedef ImageIOBase::IOComponentType IOComponentType;

  /** Set/Get the component type of the image. This is always a native
   * type. */
  void SetIOComponentType( IOComponentType componentType )
    {
    m_IOComponentType = componentType;
    }

  /** Set/Get the component type of the image. This is always a native
   * type. */
  IOComponentType GetIOComponentType()
    {
    return m_IOComponentType;
    }

  /** Set the number of components per pixel in the image. This may be set
   * by the reading process. For SCALAR pixel types, NumberOfComponents will
   * be 1. For other pixel types, NumberOfComponents will be greater than or
   * equal to one. */
  void SetNumberOfComponents( unsigned int components )
    {
    m_NumberOfComponents = components;
    }

  unsigned int GetNumberOfComponents()
    {
    return m_NumberOfComponents;
    }

  DICOMImageSeriesReaderJSBinding():
    m_NumberOfComponents(1),
    m_IOComponentType( ImageIOBase::UCHAR ),
    m_IOPixelType( ImageIOBase::SCALAR )
  {
    m_DCMTKImageIO = DCMTKImageIO::New();
  }

  /** Set a test file used to IOComponentType
   * series files. */
  void SetTestFileName( std::string testFile )
    {
    m_DCMTKImageIO->SetFileName( testFile );
    }

  /** Set a test file used to IOComponentType
   * series files. */
  bool CanReadTestFile( std::string testFile )
    {
    return m_DCMTKImageIO->CanReadFile( testFile.c_str() );
    }

  /** Set the directory in the Emscripten filesystem that contains the DICOM
   * series files. */
  void SetDirectory( std::string directory )
    {
    m_Directory = directory;
    }

  /** Read information fr8om the TestFile. */
  void ReadTestImageInformation()
    {
    m_DCMTKImageIO->ReadImageInformation();
    m_IOComponentType = m_DCMTKImageIO->GetComponentType();
    m_IOPixelType = m_DCMTKImageIO->GetPixelType();
    m_NumberOfComponents = m_DCMTKImageIO->GetNumberOfComponents();
    }

  /** Do the actual file reading. Return EXIT_SUCCESS (0) on success and
   * EXIT_FAILURE (1) on failure. */
  int Read()
    {
    switch( m_IOComponentType )
      {
      case itk::ImageIOBase::UCHAR:
        {
        typedef VectorImage< unsigned char, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::ImageIOBase::CHAR:
        {
        typedef VectorImage< signed char, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::ImageIOBase::USHORT:
        {
        typedef VectorImage< unsigned short, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::ImageIOBase::SHORT:
        {
        typedef VectorImage< short, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::ImageIOBase::UINT:
        {
        typedef VectorImage< unsigned int, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::ImageIOBase::INT:
        {
        typedef VectorImage< int, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::ImageIOBase::ULONG:
        {
        typedef VectorImage< unsigned long, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::ImageIOBase::LONG:
        {
        typedef VectorImage< long, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::ImageIOBase::FLOAT:
        {
        typedef VectorImage< float, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::ImageIOBase::DOUBLE:
        {
        typedef VectorImage< double, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::ImageIOBase::UNKNOWNCOMPONENTTYPE:
      default:
        return EXIT_FAILURE;
      }
    }

  double GetSpacing( unsigned int index )
    {
    return m_ReadImage->GetSpacing()[index];
    }

  unsigned long GetSize( unsigned int index )
    {
    return m_ReadImage->GetBufferedRegion().GetSize()[index];
    }

  double GetOrigin( unsigned int index )
    {
    return m_ReadImage->GetOrigin()[index];
    }

  double GetDirection( unsigned int row, unsigned int column )
    {
    return m_ReadImage->GetDirection()( row, column );
    }

  emscripten::val GetPixelBufferData()
    {
    switch( m_IOComponentType )
      {
    case itk::ImageIOBase::UCHAR:
        {
        typedef itk::VectorImage< unsigned char, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("Uint8Array");
        emscripten::val data = array.new_( components );
        data.call<void>( "set", view );
        return data;
        }
    case itk::ImageIOBase::CHAR:
        {
        typedef itk::VectorImage< signed char, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("Int8Array");
        emscripten::val data = array.new_( components );
        data.call<void>( "set", view );
        return data;
        }
    case itk::ImageIOBase::USHORT:
        {
        typedef itk::VectorImage< unsigned short, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("Uint16Array");
        emscripten::val data = array.new_( components );
        data.call<void>( "set", view );
        return data;
        }
    case itk::ImageIOBase::SHORT:
        {
        typedef itk::VectorImage< short, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("Int16Array");
        emscripten::val data = array.new_( components );
        data.call<void>( "set", view );
        return data;
        }
    case itk::ImageIOBase::UINT:
        {
        typedef itk::VectorImage< unsigned int, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("Uint32Array");
        emscripten::val data = array.new_( components );
        data.call<void>( "set", view );
        return data;
        }
    case itk::ImageIOBase::INT:
        {
        typedef itk::VectorImage< signed int, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("Int32Array");
        emscripten::val data = array.new_( components );
        data.call<void>( "set", view );
        return data;
        }
    case itk::ImageIOBase::ULONG:
        {
        typedef itk::VectorImage< unsigned long, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("Uint64Array");
        emscripten::val data = array.new_( components );
        data.call<void>( "set", view );
        return data;
        }
    case itk::ImageIOBase::LONG:
        {
        typedef itk::VectorImage< signed long, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("Int64Array");
        emscripten::val data = array.new_( components );
        data.call<void>( "set", view );
        return data;
        }
    case itk::ImageIOBase::FLOAT:
        {
        typedef itk::VectorImage< float, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("Float32Array");
        emscripten::val data = array.new_( components );
        data.call<void>( "set", view );
        return data;
        }
    case itk::ImageIOBase::DOUBLE:
        {
        typedef itk::VectorImage< double, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("Float64Array");
        emscripten::val data = array.new_( components );
        data.call<void>( "set", view );
        return data;
        }
    case itk::ImageIOBase::UNKNOWNCOMPONENTTYPE:
    default:
      return emscripten::val::undefined();
      }
    }

private:

  template< typename TImage >
  int ReadTypedImage()
    {
    typedef TImage                              ImageType;


    typedef itk::DCMTKSeriesFileNames SeriesFileNames;
    SeriesFileNames::Pointer seriesFileNames = SeriesFileNames::New();
    seriesFileNames->SetInputDirectory( m_Directory );

    typedef itk::ImageSeriesReader< ImageType > ReaderType;
    typename ReaderType::Pointer reader = ReaderType::New();
    const typename ReaderType::FileNamesContainer & fileNames = seriesFileNames->GetInputFileNames();
    reader->SetFileNames( fileNames );

    reader->SetImageIO( m_DCMTKImageIO );

    try
      {
      reader->Update();
      }
    catch (itk::ExceptionObject &excp)
      {
      std::cerr << "Exception thrown while writing the image" << std::endl;
      std::cerr << excp << std::endl;

      return EXIT_FAILURE;
      }
    m_ReadImage = reader->GetOutput();
    return EXIT_SUCCESS;
    }

  unsigned int m_NumberOfComponents;
  IOComponentType m_IOComponentType;
  IOPixelType m_IOPixelType;
  std::string m_Directory;

  itk::DCMTKImageIO::Pointer m_DCMTKImageIO;
  ImageBase< ImageDimension >::Pointer m_ReadImage;
};

} // end namespace itk

EMSCRIPTEN_BINDINGS(itk_dicom_image_series_reader_js_binding) {
  emscripten::register_vector< std::string >("FileNamesContainerType");
  emscripten::enum_<itk::DICOMImageSeriesReaderJSBinding::IOPixelType>("IOPixelType")
    .value("UNKNOWNPIXELTYPE", itk::ImageIOBase::UNKNOWNPIXELTYPE)
    .value("SCALAR", itk::ImageIOBase::SCALAR)
    .value("RGB", itk::ImageIOBase::RGB)
    .value("RGBA", itk::ImageIOBase::RGBA)
    .value("OFFSET", itk::ImageIOBase::OFFSET)
    .value("VECTOR", itk::ImageIOBase::VECTOR)
    .value("POINT", itk::ImageIOBase::POINT)
    .value("COVARIANTVECTOR", itk::ImageIOBase::COVARIANTVECTOR)
    .value("SYMMETRICSECONDRANKTENSOR", itk::ImageIOBase::SYMMETRICSECONDRANKTENSOR)
    .value("POINT", itk::ImageIOBase::POINT)
    .value("COVARIANTVECTOR", itk::ImageIOBase::COVARIANTVECTOR)
    .value("SYMMETRICSECONDRANKTENSOR", itk::ImageIOBase::SYMMETRICSECONDRANKTENSOR)
    .value("DIFFUSIONTENSOR3D", itk::ImageIOBase::DIFFUSIONTENSOR3D)
    .value("COMPLEX", itk::ImageIOBase::COMPLEX)
    .value("FIXEDARRAY", itk::ImageIOBase::FIXEDARRAY)
    .value("MATRIX", itk::ImageIOBase::MATRIX)
    ;
  emscripten::enum_<itk::DICOMImageSeriesReaderJSBinding::IOComponentType>("IOComponentType")
    .value("UNKNOWNCOMPONENTTYPE", itk::ImageIOBase::UNKNOWNCOMPONENTTYPE)
    .value("UCHAR", itk::ImageIOBase::UCHAR)
    .value("CHAR", itk::ImageIOBase::CHAR)
    .value("USHORT", itk::ImageIOBase::USHORT)
    .value("SHORT", itk::ImageIOBase::SHORT)
    .value("UINT", itk::ImageIOBase::UINT)
    .value("INT", itk::ImageIOBase::INT)
    .value("ULONG", itk::ImageIOBase::ULONG)
    .value("LONG", itk::ImageIOBase::LONG)
    .value("FLOAT", itk::ImageIOBase::FLOAT)
    .value("DOUBLE", itk::ImageIOBase::DOUBLE)
    ;
  emscripten::class_<itk::DICOMImageSeriesReaderJSBinding>("ITKDICOMImageSeriesReader")
  .constructor<>()
  .function("SetNumberOfComponents", &itk::DICOMImageSeriesReaderJSBinding::SetNumberOfComponents)
  .function("SetIOComponentType", &itk::DICOMImageSeriesReaderJSBinding::SetIOComponentType)
  .function("SetIOPixelType", &itk::DICOMImageSeriesReaderJSBinding::SetIOPixelType)
  .function("GetNumberOfComponents", &itk::DICOMImageSeriesReaderJSBinding::GetNumberOfComponents)
  .function("GetIOComponentType", &itk::DICOMImageSeriesReaderJSBinding::GetIOComponentType)
  .function("GetIOPixelType", &itk::DICOMImageSeriesReaderJSBinding::GetIOPixelType)
  .function("SetDirectory", &itk::DICOMImageSeriesReaderJSBinding::SetDirectory)
  .function("Read", &itk::DICOMImageSeriesReaderJSBinding::Read)
  .function("GetSpacing", &itk::DICOMImageSeriesReaderJSBinding::GetSpacing)
  .function("GetSize", &itk::DICOMImageSeriesReaderJSBinding::GetSize)
  .function("GetOrigin", &itk::DICOMImageSeriesReaderJSBinding::GetOrigin)
  .function("GetDirection", &itk::DICOMImageSeriesReaderJSBinding::GetDirection)
  .function("GetPixelBufferData", &itk::DICOMImageSeriesReaderJSBinding::GetPixelBufferData)
  .function("SetTestFileName", &itk::DICOMImageSeriesReaderJSBinding::SetTestFileName)
  .function("ReadTestImageInformation", &itk::DICOMImageSeriesReaderJSBinding::ReadTestImageInformation)
  .function("CanReadTestFile", &itk::DICOMImageSeriesReaderJSBinding::CanReadTestFile)
  ;
}

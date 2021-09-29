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

#include "itkCommonEnums.h"
#include "itkGDCMSeriesFileNames.h"
#include "itkImageIOBase.h"
#include "itkImageSeriesReader.h"
#include "itkGDCMImageIO.h"
#include "itkVectorImage.h"

namespace itk
{

template <typename TOutputImage>
class ITK_TEMPLATE_EXPORT QuickDICOMImageSeriesReader : public ImageSeriesReader<TOutputImage>
{
public:
  ITK_DISALLOW_COPY_AND_ASSIGN(QuickDICOMImageSeriesReader);

  /** Standard class type aliases. */
  using Self = QuickDICOMImageSeriesReader;
  using Superclass = ImageSeriesReader<TOutputImage>;
  using Pointer = SmartPointer<Self>;

  /** Method for creation through the object factory. */
  itkNewMacro(Self);

  /** Run-time type information (and related methods). */
  itkTypeMacro(QuickDICOMImageSeriesReader, ImageSeriesReader);

  /** The size of the output image. */
  using SizeType = typename TOutputImage::SizeType;

  /** The index of the output image. */
  using IndexType = typename TOutputImage::IndexType;

  /** The region of the output image. */
  using ImageRegionType = typename TOutputImage::RegionType;

  /** The pixel type of the output image. */
  using OutputImagePixelType = typename TOutputImage::PixelType;

protected:
  QuickDICOMImageSeriesReader()
    {
    }

  ~QuickDICOMImageSeriesReader() override
    {
    }

  /** Does the real work. */
  void
  GenerateData() override
    {
      TOutputImage * output = this->GetOutput();

      ImageRegionType requestedRegion = output->GetRequestedRegion();
      ImageRegionType largestRegion = output->GetLargestPossibleRegion();
      ImageRegionType sliceRegionToRequest = output->GetRequestedRegion();

      // Each file must have the same size.
      SizeType validSize = largestRegion.GetSize();

      // If more than one file is being read, then the input dimension
      // will be less than the output dimension.  In this case, set
      // the last dimension that is other than 1 of validSize to 1.  However, if the
      // input and output have the same number of dimensions, this should
      // not be done because it will lower the dimension of the output image.
      if (TOutputImage::ImageDimension != this->m_NumberOfDimensionsInImage)
      {
        validSize[this->m_NumberOfDimensionsInImage] = 1;
        sliceRegionToRequest.SetSize(this->m_NumberOfDimensionsInImage, 1);
        sliceRegionToRequest.SetIndex(this->m_NumberOfDimensionsInImage, 0);
      }

      ImageIORegion imageIORegion(this->m_NumberOfDimensionsInImage);
      for (unsigned int dim = 0; dim < this->m_NumberOfDimensionsInImage; ++dim) {
        imageIORegion.SetSize(dim, sliceRegionToRequest.GetSize(dim));
        imageIORegion.SetIndex(dim, sliceRegionToRequest.GetIndex(dim));
      }
      // the size of the buffer is computed based on the actual number of
      // pixels to be read and the actual size of the pixels to be read
      // (as opposed to the sizes of the output)
      const size_t sizeOfActualIORegion =
        imageIORegion.GetNumberOfPixels() * (this->m_ImageIO->GetComponentSize() * this->m_ImageIO->GetNumberOfComponents());


      // Allocate the output buffer
      output->SetBufferedRegion(requestedRegion);
      output->Allocate();

      // progress reported on a per slice basis
      ProgressReporter progress(this, 0, requestedRegion.GetSize(TOutputImage::ImageDimension - 1), 100);

      const bool needToUpdateMetaDataDictionaryArray = false;

      typename TOutputImage::InternalPixelType * outputBuffer = output->GetBufferPointer();
      IndexType                                  sliceStartIndex = requestedRegion.GetIndex();
      const auto                                 numberOfFiles = static_cast<int>(this->m_FileNames.size());

      typename TOutputImage::PointType   prevSliceOrigin = output->GetOrigin();
      typename TOutputImage::SpacingType outputSpacing = output->GetSpacing();
      double                             maxSpacingDeviation = 0.0;
      bool                               prevSliceIsValid = false;

      for (int i = 0; i != numberOfFiles; ++i)
      {
        if (TOutputImage::ImageDimension != this->m_NumberOfDimensionsInImage)
        {
          sliceStartIndex[this->m_NumberOfDimensionsInImage] = i;
        }

        const bool insideRequestedRegion = requestedRegion.IsInside(sliceStartIndex);
        const int  iFileName = i;
        bool       nonUniformSampling = false;
        double     spacingDeviation = 0.0;

        // check if we need this slice
        if (!insideRequestedRegion && !needToUpdateMetaDataDictionaryArray)
        {
          continue;
        }

        this->m_ImageIO->SetFileName(this->m_FileNames[iFileName].c_str());
        this->m_ImageIO->SetIORegion(imageIORegion);

        const size_t numberOfPixelsInSlice = sliceRegionToRequest.GetNumberOfPixels();

        using AccessorFunctorType = typename TOutputImage::AccessorFunctorType;
        const size_t numberOfInternalComponentsPerPixel = AccessorFunctorType::GetVectorLength(output);


        const ptrdiff_t sliceOffset = (TOutputImage::ImageDimension != this->m_NumberOfDimensionsInImage)
                                        ? (i - requestedRegion.GetIndex(this->m_NumberOfDimensionsInImage))
                                        : 0;

        const ptrdiff_t numberOfPixelComponentsUpToSlice =
          numberOfPixelsInSlice * numberOfInternalComponentsPerPixel * sliceOffset;

        typename TOutputImage::InternalPixelType * outputSliceBuffer = outputBuffer + numberOfPixelComponentsUpToSlice;
        this->m_ImageIO->Read(outputSliceBuffer);

        // report progress for read slices
        progress.CompletedPixel();

      } // end per slice loop
    } // end GenerateData
};

/** \class DICOMImageSeriesReaderJSBinding
 *
 * \brief Provides a JavaScript binding interface to
 * itk::DICOMImageSeriesReader.
 */
class DICOMImageSeriesReaderJSBinding
{
public:
  static const unsigned int ImageDimension = 3;

  typedef GDCMSeriesFileNames::FileNamesContainerType FileNamesContainerType;

  /** Enums used to manipulate the pixel type. The pixel type provides
   * context for automatic data conversions (for instance, RGB to
   * SCALAR, VECTOR to SCALAR). */
  typedef CommonEnums::IOPixel IOPixelType;
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
  typedef CommonEnums::IOComponent IOComponentType;

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
    m_IOComponentType( ::itk::CommonEnums::IOComponent::UCHAR ),
    m_IOPixelType( ::itk::CommonEnums::IOPixel::SCALAR )
  {
    m_GDCMImageIO = GDCMImageIO::New();
  }

  /** Set a test file used to IOComponentType
   * series files. */
  void SetTestFileName( std::string testFile )
    {
    m_GDCMImageIO->SetFileName( testFile );
    }

  /** Set a test file used to IOComponentType
   * series files. */
  bool CanReadTestFile( std::string testFile )
    {
    return m_GDCMImageIO->CanReadFile( testFile.c_str() );
    }

  /** Set the directory in the Emscripten filesystem that contains the DICOM
   * series files. Only use SetDirectory or SetFileNames, not both. */
  void SetDirectory( std::string directory )
    {
    m_Directory = directory;
    }

  /** Set filepaths in the Emscripten filesystem that contains the DICOM
   * series files. */
  void SetFileNames( const FileNamesContainerType filePaths )
    {
    m_FileNames = filePaths;
    }

  /** Read information fr8om the TestFile. */
  void ReadTestImageInformation()
    {
    m_GDCMImageIO->ReadImageInformation();
    m_IOComponentType = m_GDCMImageIO->GetComponentType();
    m_IOPixelType = m_GDCMImageIO->GetPixelType();
    m_NumberOfComponents = m_GDCMImageIO->GetNumberOfComponents();
    }

  /** Do the actual file reading. Return EXIT_SUCCESS (0) on success and
   * EXIT_FAILURE (1) on failure. */
  int Read()
    {
    switch( m_IOComponentType )
      {
      case itk::CommonEnums::IOComponent::UCHAR:
        {
        typedef VectorImage< unsigned char, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::CommonEnums::IOComponent::CHAR:
        {
        typedef VectorImage< signed char, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::CommonEnums::IOComponent::USHORT:
        {
        typedef VectorImage< unsigned short, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::CommonEnums::IOComponent::SHORT:
        {
        typedef VectorImage< short, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::CommonEnums::IOComponent::UINT:
        {
        typedef VectorImage< unsigned int, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::CommonEnums::IOComponent::INT:
        {
        typedef VectorImage< int, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::CommonEnums::IOComponent::ULONG:
        {
        typedef VectorImage< unsigned long, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::CommonEnums::IOComponent::LONG:
        {
        typedef VectorImage< long, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::CommonEnums::IOComponent::ULONGLONG:
        {
        typedef VectorImage< unsigned long long, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::CommonEnums::IOComponent::LONGLONG:
        {
        typedef VectorImage< long long, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::CommonEnums::IOComponent::FLOAT:
        {
        typedef VectorImage< float, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::CommonEnums::IOComponent::DOUBLE:
        {
        typedef VectorImage< double, ImageDimension > ImageType;
        return this->ReadTypedImage< ImageType >();
        }
      case itk::CommonEnums::IOComponent::UNKNOWNCOMPONENTTYPE:
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
    emscripten::val bufferObject = emscripten::val::global("SharedArrayBuffer");
    if (!bufferObject.as<bool>())
      {
      // We do not have SharedArrayBuffer.
      bufferObject = emscripten::val::global("ArrayBuffer");
      }
    switch( m_IOComponentType )
      {
    case itk::CommonEnums::IOComponent::UCHAR:
        {
        typedef itk::VectorImage< unsigned char, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("Uint8Array");
        emscripten::val buffer = bufferObject.new_( emscripten::val(components * sizeof(unsigned char) ));
        emscripten::val data = array.new_( buffer );
        data.call<void>( "set", view );
        return data;
        }
    case itk::CommonEnums::IOComponent::CHAR:
        {
        typedef itk::VectorImage< signed char, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("Int8Array");
        emscripten::val buffer = bufferObject.new_( emscripten::val(components * sizeof(char) ));
        emscripten::val data = array.new_( buffer );
        data.call<void>( "set", view );
        return data;
        }
    case itk::CommonEnums::IOComponent::USHORT:
        {
        typedef itk::VectorImage< unsigned short, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("Uint16Array");
        emscripten::val buffer = bufferObject.new_( emscripten::val(components * sizeof(unsigned short) ));
        emscripten::val data = array.new_( buffer );
        data.call<void>( "set", view );
        return data;
        }
    case itk::CommonEnums::IOComponent::SHORT:
        {
        typedef itk::VectorImage< short, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("Int16Array");
        emscripten::val buffer = bufferObject.new_( emscripten::val(components * sizeof(short) ));
        emscripten::val data = array.new_( buffer );
        data.call<void>( "set", view );
        return data;
        }
    case itk::CommonEnums::IOComponent::UINT:
        {
        typedef itk::VectorImage< unsigned int, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("Uint32Array");
        emscripten::val buffer = bufferObject.new_( emscripten::val(components * sizeof(unsigned int) ));
        emscripten::val data = array.new_( buffer );
        data.call<void>( "set", view );
        return data;
        }
    case itk::CommonEnums::IOComponent::INT:
        {
        typedef itk::VectorImage< signed int, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("Int32Array");
        emscripten::val buffer = bufferObject.new_( emscripten::val(components * sizeof(int) ));
        emscripten::val data = array.new_( buffer );
        data.call<void>( "set", view );
        return data;
        }
    case itk::CommonEnums::IOComponent::ULONG:
        {
        typedef itk::VectorImage< unsigned long, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("BigUint64Array");
        emscripten::val buffer = bufferObject.new_( emscripten::val(components * sizeof(unsigned long) ));
        emscripten::val data = array.new_( buffer );
        data.call<void>( "set", view );
        return data;
        }
    case itk::CommonEnums::IOComponent::LONG:
        {
        typedef itk::VectorImage< signed long, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("BigInt64Array");
        emscripten::val buffer = bufferObject.new_( emscripten::val(components * sizeof(long) ));
        emscripten::val data = array.new_( buffer );
        data.call<void>( "set", view );
        return data;
        }
    case itk::CommonEnums::IOComponent::ULONGLONG:
        {
        typedef itk::VectorImage< unsigned long, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("BigUint64Array");
        emscripten::val buffer = bufferObject.new_( emscripten::val(components * sizeof(unsigned long long) ));
        emscripten::val data = array.new_( buffer );
        data.call<void>( "set", view );
        return data;
        }
    case itk::CommonEnums::IOComponent::LONGLONG:
        {
        typedef itk::VectorImage< signed long, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("BigInt64Array");
        emscripten::val buffer = bufferObject.new_( emscripten::val(components * sizeof(long long) ));
        emscripten::val data = array.new_( buffer );
        data.call<void>( "set", view );
        return data;
        }
    case itk::CommonEnums::IOComponent::FLOAT:
        {
        typedef itk::VectorImage< float, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("Float32Array");
        emscripten::val buffer = bufferObject.new_( emscripten::val(components * sizeof(float) ));
        emscripten::val data = array.new_( buffer );
        data.call<void>( "set", view );
        return data;
        }
    case itk::CommonEnums::IOComponent::DOUBLE:
        {
        typedef itk::VectorImage< double, ImageDimension > ImageType;
        ImageType * image = static_cast< ImageType * >( m_ReadImage.GetPointer() );
        ImageType::PixelContainer * pixelContainer = image->GetPixelContainer();
        const unsigned long components = pixelContainer->Size();
        const emscripten::val view( emscripten::typed_memory_view( components, pixelContainer->GetBufferPointer() ) );
        emscripten::val array = emscripten::val::global("Float64Array");
        emscripten::val buffer = bufferObject.new_( emscripten::val(components * sizeof(double) ));
        emscripten::val data = array.new_( buffer );
        data.call<void>( "set", view );
        return data;
        }
    case itk::CommonEnums::IOComponent::UNKNOWNCOMPONENTTYPE:
    default:
      return emscripten::val::undefined();
      }
    }

  void DeleteImage()
    {
    m_ReadImage = nullptr;
    }

private:

  template< typename TImage >
  int ReadTypedImage()
    {
    typedef TImage                              ImageType;

    typedef itk::QuickDICOMImageSeriesReader< ImageType > ReaderType;
    typename ReaderType::Pointer reader = ReaderType::New();
    reader->SetMetaDataDictionaryArrayUpdate(false);

    if (!m_FileNames.size())
      {
      typedef itk::GDCMSeriesFileNames SeriesFileNames;
      SeriesFileNames::Pointer seriesFileNames = SeriesFileNames::New();
      seriesFileNames->SetDirectory( m_Directory );
      seriesFileNames->SetUseSeriesDetails(true);
      seriesFileNames->SetGlobalWarningDisplay(false);
      using SeriesIdContainer = std::vector<std::string>;
      const SeriesIdContainer & seriesUID = seriesFileNames->GetSeriesUIDs();

      using FileNamesContainer = std::vector<std::string>;
      FileNamesContainer fileNames = seriesFileNames->GetFileNames(seriesUID.begin()->c_str());
      reader->SetFileNames( fileNames );
      }
    else
      {
      reader->SetFileNames( m_FileNames );
      }

    reader->SetImageIO( m_GDCMImageIO );

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
  FileNamesContainerType m_FileNames;

  itk::GDCMImageIO::Pointer m_GDCMImageIO;
  ImageBase< ImageDimension >::Pointer m_ReadImage;
};

} // end namespace itk

EMSCRIPTEN_BINDINGS(itk_dicom_image_series_reader_js_binding) {
  emscripten::register_vector< std::string >("FileNamesContainerType");
  emscripten::enum_<itk::DICOMImageSeriesReaderJSBinding::IOPixelType>("IOPixelType")
    .value("UNKNOWNPIXELTYPE", itk::CommonEnums::IOPixel::UNKNOWNPIXELTYPE)
    .value("SCALAR", itk::CommonEnums::IOPixel::SCALAR)
    .value("RGB", itk::CommonEnums::IOPixel::RGB)
    .value("RGBA", itk::CommonEnums::IOPixel::RGBA)
    .value("OFFSET", itk::CommonEnums::IOPixel::OFFSET)
    .value("VECTOR", itk::CommonEnums::IOPixel::VECTOR)
    .value("POINT", itk::CommonEnums::IOPixel::POINT)
    .value("COVARIANTVECTOR", itk::CommonEnums::IOPixel::COVARIANTVECTOR)
    .value("SYMMETRICSECONDRANKTENSOR", itk::CommonEnums::IOPixel::SYMMETRICSECONDRANKTENSOR)
    .value("DIFFUSIONTENSOR3D", itk::CommonEnums::IOPixel::DIFFUSIONTENSOR3D)
    .value("FIXEDARRAY", itk::CommonEnums::IOPixel::ARRAY)
    .value("COMPLEX", itk::CommonEnums::IOPixel::COMPLEX)
    .value("FIXEDARRAY", itk::CommonEnums::IOPixel::FIXEDARRAY)
    .value("MATRIX", itk::CommonEnums::IOPixel::MATRIX)
    .value("VARIABLELENGTHVECTOR", itk::CommonEnums::IOPixel::VARIABLELENGTHVECTOR)
    .value("VARIABLESIZEMATRIX", itk::CommonEnums::IOPixel::VARIABLESIZEMATRIX)
    ;
  emscripten::enum_<itk::DICOMImageSeriesReaderJSBinding::IOComponentType>("IOComponentType")
    .value("UNKNOWNCOMPONENTTYPE", itk::CommonEnums::IOComponent::UNKNOWNCOMPONENTTYPE)
    .value("UCHAR", itk::CommonEnums::IOComponent::UCHAR)
    .value("CHAR", itk::CommonEnums::IOComponent::CHAR)
    .value("USHORT", itk::CommonEnums::IOComponent::USHORT)
    .value("SHORT", itk::CommonEnums::IOComponent::SHORT)
    .value("UINT", itk::CommonEnums::IOComponent::UINT)
    .value("INT", itk::CommonEnums::IOComponent::INT)
    .value("ULONG", itk::CommonEnums::IOComponent::ULONG)
    .value("LONG", itk::CommonEnums::IOComponent::LONG)
    .value("ULONGLONG", itk::CommonEnums::IOComponent::ULONGLONG)
    .value("LONGLONG", itk::CommonEnums::IOComponent::LONGLONG)
    .value("FLOAT", itk::CommonEnums::IOComponent::FLOAT)
    .value("DOUBLE", itk::CommonEnums::IOComponent::DOUBLE)
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
  .function("SetFileNames", &itk::DICOMImageSeriesReaderJSBinding::SetFileNames)
  .function("Read", &itk::DICOMImageSeriesReaderJSBinding::Read)
  .function("DeleteImage", &itk::DICOMImageSeriesReaderJSBinding::DeleteImage)
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

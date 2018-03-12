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
#ifndef itkImageIOBaseJSBinding_h
#define itkImageIOBaseJSBinding_h

#include <string>
#include <vector>

#include "emscripten/val.h"

namespace itk
{

/** \class ImageIOBaseJSBinding
 *
 * \brief Provides as JavaScript binding interface to itk::ImageIOBase derived
 * classes.
 *
 * \ingroup BridgeJavaScript
 */
template< typename TImageIO >
class ImageIOBaseJSBinding
{
public:
  typedef TImageIO ImageIOType;

  typedef std::vector< double > AxisDirectionType;

  /** Enums used to manipulate the pixel type. The pixel type provides
   * context for automatic data conversions (for instance, RGB to
   * SCALAR, VECTOR to SCALAR). */
  typedef typename ImageIOType::IOPixelType IOPixelType;

  /** Enums used to manipulate the component type. The component type
   * refers to the actual storage class associated with either a
   * SCALAR pixel type or elements of a compound pixel.
   */
  typedef typename ImageIOType::IOComponentType IOComponentType;

  ImageIOBaseJSBinding();

  /** Set/Get the number of independent variables (dimensions) in the
   * image being read or written. Note this is not necessarily what
   * is written, rather the IORegion controls that. */
  void SetNumberOfDimensions( unsigned int numberOfDimensions );
  unsigned int GetNumberOfDimensions() const;

  /** Set/Get the name of the file to be read. This file should exist on the
   * Emscripten virtual filesystem. */
  void SetFileName( std::string fileName );
  std::string GetFileName() const;

  bool CanReadFile( std::string fileName );
  bool CanWriteFile( std::string fileName );

  /** Read the spacing and dimensions of the image.
   * Assumes SetFileName has been called with a valid file name. */
  void ReadImageInformation();
  void WriteImageInformation();

  /** Set/Get the image dimensions in the x, y, z, etc. directions.
   * GetDimensions() is typically used after reading the data; the
   * SetDimensions() is used prior to writing the data. */
  void SetDimensions( unsigned int i, unsigned long dimension );
  unsigned long GetDimensions( unsigned int i ) const;

  /** Set/Get the image origin on a axis-by-axis basis. The SetOrigin() method
   * is required when writing the image. */
  void SetOrigin( unsigned int i, double origin );
  double GetOrigin( unsigned int i ) const;

  /** Set/Get the image spacing on an axis-by-axis basis. The
   * SetSpacing() method is required when writing the image. */
  void SetSpacing( unsigned int i, double origin );
  double GetSpacing( unsigned int i ) const;

  /** Set/Get the image direction on an axis-by-axis basis. The
   * SetDirection() method is required when writing the image. */
  void SetDirection( unsigned int i, const AxisDirectionType direction );
  AxisDirectionType GetDirection( unsigned int i ) const;

  /** Return the directions to be assigned by default to recipient images
   * whose dimension is smaller than the image dimension in file. */
  AxisDirectionType GetDefaultDirection( unsigned int i ) const;

  /** Set/Get the type of the pixel. The PixelTypes provides context
   * to the IO mechanisms for data conversions.  PixelTypes can be
   * SCALAR, RGB, RGBA, VECTOR, COVARIANTVECTOR, POINT, INDEX. If
   * the PIXELTYPE is SCALAR, then the NumberOfComponents should be 1.
   * Any other of PIXELTYPE will have more than one component. */
  void SetPixelType( IOPixelType pixelType );
  IOPixelType GetPixelType() const;

  /** Set/Get the component type of the image. This is always a native
   * type. */
  void SetComponentType( IOComponentType componentType );
  IOComponentType GetComponentType() const;

  /** Return the number of pixels in the image. */
  unsigned long GetImageSizeInPixels() const;

  /** Return the number of bytes in the image. */
  unsigned long GetImageSizeInBytes() const;

  /** Return the number of pixels times the number
   * of components in the image. */
  unsigned long GetImageSizeInComponents() const;

  /** Set/Get the number of components per pixel in the image. This may be set
   * by the reading process. For SCALAR pixel types, NumberOfComponents will
   * be 1. For other pixel types, NumberOfComponents will be greater than or
   * equal to one. */
  void SetNumberOfComponents( unsigned int components );
  unsigned int GetNumberOfComponents() const;


  /** Reads the pixel buffer data from the file and returns a JavaScript Typed
   * Array of type corresponding to the IOComponentType */
  emscripten::val Read();
  /** Writes the pixel buffer data from the JavaScript Typed
   * Array of type corresponding to the IOComponentType to the FileName */
  void Write( uintptr_t cBuffer );

  /** Use compression when writing */
  void SetUseCompression( bool compression );

private:
  typename ImageIOType::Pointer m_ImageIO;

  std::vector< unsigned char > m_PixelBuffer;

};

} // end namespace itk

#include "itkImageIOBaseJSBinding.hxx"

#endif

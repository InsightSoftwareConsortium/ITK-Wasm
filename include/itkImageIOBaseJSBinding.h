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

  ImageIOBaseJSBinding();

  /** Set/Get the number of independent variables (dimensions) in the
   * image being read or written. Note this is not necessarily what
   * is written, rather the IORegion controls that. */
  void SetNumberOfDimensions(unsigned int numberOfDimensions);
  unsigned int GetNumberOfDimensions();

  /** Set/Get the name of the file to be read. This file should exist on the
   * Emscripten virtual filesystem. */
  void SetFileName(std::string fileName);
  std::string GetFileName();

  /** Read the spacing and dimensions of the image.
   * Assumes SetFileName has been called with a valid file name. */
  void ReadImageInformation();

private:
  typename ImageIOType::Pointer m_ImageIO;
};

} // end namespace itk

#include "itkImageIOBaseJSBinding.hxx"

#endif

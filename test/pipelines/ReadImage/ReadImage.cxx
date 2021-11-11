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
#include "itkImageFileReader.h"
#include "itkImageFileWriter.h"
#include "itkRGBPixel.h"

int main( int argc, char * argv[] )
{
  if( argc < 3 )
    {
    std::cerr << "Usage: " << argv[0] << " <inputImage> <outputImage>" << std::endl;
    return EXIT_FAILURE;
    }
  const char * inputImageFile = argv[1];
  const char * outputImageFile = argv[2];

  using PixelType = itk::RGBPixel<unsigned char>;
  constexpr unsigned int Dimension = 2;
  using ImageType = itk::Image< PixelType, Dimension >;

  try
  {
    const auto image = itk::ReadImage<ImageType>(inputImageFile);
    itk::WriteImage(image, outputImageFile);
  }
  catch( std::exception & error )
  {
    std::cerr << "Error: " << error.what() << std::endl;
    return EXIT_FAILURE;
  }

  return EXIT_SUCCESS;
}

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
#include "itkImageFileReader.h"
#include "itkImageFileWriter.h"
#include "itkMedianImageFilter.h"

int main( int argc, char * argv[] )
{
  if( argc < 4 )
    {
    std::cerr << "Usage: " << argv[0] << " <inputImage> <outputImage> <radius>" << std::endl;
    return EXIT_FAILURE;
    }
  const char * inputImageFile = argv[1];
  const char * outputImageFile = argv[2];
  unsigned int radius = atoi( argv[3] );

  using PixelType = unsigned char;
  constexpr unsigned int Dimension = 2;
  using ImageType = itk::Image< PixelType, Dimension >;

  using ReaderType = itk::ImageFileReader< ImageType >;
  auto reader = ReaderType::New();
  reader->SetFileName( inputImageFile );

  using SmoothingFilterType = itk::MedianImageFilter< ImageType, ImageType >;
  auto smoother = SmoothingFilterType::New();
  smoother->SetInput( reader->GetOutput() );
  smoother->SetRadius( radius );

  using WriterType = itk::ImageFileWriter< ImageType >;
  auto writer = WriterType::New();
  writer->SetInput( smoother->GetOutput() );
  writer->SetFileName( outputImageFile );

  try
    {
    writer->Update();
    }
  catch( itk::ExceptionObject & error )
    {
    std::cerr << "Error: " << error << std::endl;
    return EXIT_FAILURE;
    }

  return EXIT_SUCCESS;
}

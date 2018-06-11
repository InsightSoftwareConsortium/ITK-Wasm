#include "itkImageFileReader.h"
#include "itkImageFileWriter.h"
#include "itkBinShrinkImageFilter.h"

int main( int argc, char * argv[] )
{
  if( argc < 4 )
    {
    std::cerr << "Usage: " << argv[0] << " <inputImage> <outputImage> <shrinkFactor>" << std::endl;
    return EXIT_FAILURE;
    }
  const char * inputImageFile = argv[1];
  const char * outputImageFile = argv[2];
  unsigned int shrinkFactor = atoi( argv[3] );

  using PixelType = unsigned char;
  constexpr unsigned int Dimension = 2;
  using ImageType = itk::Image< PixelType, Dimension >;

  using ReaderType = itk::ImageFileReader< ImageType >;
  auto reader = ReaderType::New();
  reader->SetFileName( inputImageFile );

  using ShrinkFilterType = itk::BinShrinkImageFilter< ImageType, ImageType >;
  auto shrinker = ShrinkFilterType::New();
  shrinker->SetInput( reader->GetOutput() );
  shrinker->SetShrinkFactors( shrinkFactor );

  using WriterType = itk::ImageFileWriter< ImageType >;
  auto writer = WriterType::New();
  writer->SetInput( shrinker->GetOutput() );
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

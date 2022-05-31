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
#include "itkWASMImageIOFactory.h"
#include "itkWASMImageIO.h"
#include "itkImageFileReader.h"
#include "itkImageFileWriter.h"
#include "itkTestingMacros.h"

int
itkWASMImageIOTest(int argc, char * argv[])
{
  if (argc < 6)
  {
    std::cerr << "Missing parameters" << std::endl;
    std::cerr << "Usage: " << itkNameOfTestExecutableMacro(argv) << " InputImage ImageDirectory ConvertedDirectory ImageCBOR ConvertedCBOR" << std::endl;
    return EXIT_FAILURE;
  }
  const char * inputImageFile = argv[1];
  const char * imageDirectory = argv[2];
  const char * convertedDirectoryFile = argv[3];
  const char * imageCBOR = argv[4];
  const char * convertedCBORFile = argv[5];

  itk::WASMImageIOFactory::RegisterOneFactory();

  constexpr unsigned int Dimension = 3;
  using PixelType = unsigned char;
  using ImageType = itk::Image<PixelType, Dimension>;
  using ImagePointer = ImageType::Pointer;

  ImagePointer inputImage = nullptr;
  ITK_TRY_EXPECT_NO_EXCEPTION(inputImage = itk::ReadImage<ImageType>(inputImageFile));

  auto imageIO = itk::WASMImageIO::New();

  using WriterType = itk::ImageFileWriter<ImageType>;
  auto wasmWriter = WriterType::New();
  //wasmWriter->SetImageIO( imageIO );
  wasmWriter->SetFileName( imageDirectory );
  wasmWriter->SetInput( inputImage );

  ITK_TRY_EXPECT_NO_EXCEPTION(wasmWriter->Update());

  using ReaderType = itk::ImageFileReader<ImageType>;
  auto wasmReader = ReaderType::New();
  //wasmReader->SetImageIO( imageIO );
  wasmReader->SetFileName( imageDirectory );

  ITK_TRY_EXPECT_NO_EXCEPTION(wasmReader->Update());

  ITK_TRY_EXPECT_NO_EXCEPTION(itk::WriteImage(wasmReader->GetOutput(), convertedDirectoryFile));

  wasmWriter->SetFileName( imageCBOR );
  ITK_TRY_EXPECT_NO_EXCEPTION(wasmWriter->Update());

  wasmReader->SetFileName( imageCBOR );
  ITK_TRY_EXPECT_NO_EXCEPTION(wasmReader->Update());

  ITK_TRY_EXPECT_NO_EXCEPTION(itk::WriteImage(wasmReader->GetOutput(), convertedCBORFile));

  return EXIT_SUCCESS;
}

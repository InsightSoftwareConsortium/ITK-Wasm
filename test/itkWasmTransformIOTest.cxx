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
#include "itkWasmTransformIOFactory.h"
#include "itkWasmTransformIO.h"
#include "itkTransformFileReader.h"
#include "itkTransformFileWriter.h"
#include "itkTestingMacros.h"

int
itkWasmTransformIOTest(int argc, char * argv[])
{
  if (argc < 6)
  {
    std::cerr << "Missing parameters" << std::endl;
    std::cerr << "Usage: " << itkNameOfTestExecutableMacro(argv) << " InputTransform TransformDirectory ConvertedDirectory TransformCBOR ConvertedCBOR" << std::endl;
    return EXIT_FAILURE;
  }
  const char * inputTransformFile = argv[1];
  const char * imageDirectory = argv[2];
  const char * convertedDirectoryFile = argv[3];
  const char * imageCBOR = argv[4];
  const char * convertedCBORFile = argv[5];

  itk::WasmTransformIOFactory::RegisterOneFactory();

  constexpr unsigned int Dimension = 3;
  using PixelType = unsigned char;
  using TransformType = itk::Transform<PixelType, Dimension>;
  using TransformPointer = TransformType::Pointer;

  TransformPointer inputTransform = nullptr;
  ITK_TRY_EXPECT_NO_EXCEPTION(inputTransform = itk::ReadTransform<TransformType>(inputTransformFile));

  auto imageIO = itk::WasmTransformIO::New();

  using WriterType = itk::TransformFileWriter<TransformType>;
  auto wasmWriter = WriterType::New();
  //wasmWriter->SetTransformIO( imageIO );
  wasmWriter->SetFileName( imageDirectory );
  wasmWriter->SetInput( inputTransform );

  ITK_TRY_EXPECT_NO_EXCEPTION(wasmWriter->Update());

  using ReaderType = itk::TransformFileReader<TransformType>;
  auto wasmReader = ReaderType::New();
  //wasmReader->SetTransformIO( imageIO );
  wasmReader->SetFileName( imageDirectory );

  ITK_TRY_EXPECT_NO_EXCEPTION(wasmReader->Update());

  TransformPointer writtenReadTransform = wasmReader->GetOutput();

  ITK_TRY_EXPECT_NO_EXCEPTION(itk::WriteTransform(writtenReadTransform, convertedDirectoryFile));

  wasmWriter->SetFileName( imageCBOR );
  ITK_TRY_EXPECT_NO_EXCEPTION(wasmWriter->Update());

  wasmReader->SetFileName( imageCBOR );
  ITK_TRY_EXPECT_NO_EXCEPTION(wasmReader->Update());

  ITK_TRY_EXPECT_NO_EXCEPTION(itk::WriteTransform(wasmReader->GetOutput(), convertedCBORFile));

  return EXIT_SUCCESS;
}

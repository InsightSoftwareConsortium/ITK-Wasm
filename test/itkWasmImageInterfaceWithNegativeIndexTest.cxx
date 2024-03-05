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
#include "itkImageToWasmImageFilter.h"
#include "itkWasmImageToImageFilter.h"

#include "itkConstantPadImageFilter.h"
#include "itkImageFileReader.h"
#include "itkImageFileWriter.h"
#include "itkTestingMacros.h"

int
itkWasmImageInterfaceWithNegativeIndexTest(int argc, char * argv[])
{
  if (argc < 3)
  {
    std::cerr << "Missing parameters" << std::endl;
    std::cerr << "Usage: " << itkNameOfTestExecutableMacro(argv) << " InputImage OutputImage" << std::endl;
    return EXIT_FAILURE;
  }
  const char * inputImageFile = argv[1];
  const char * outputImageFile = argv[2];

  constexpr unsigned int Dimension = 3;
  using PixelType = unsigned char;
  using ImageType = itk::Image<PixelType, Dimension>;
  using ImagePointer = ImageType::Pointer;

  ImagePointer inputImage = nullptr;
  ITK_TRY_EXPECT_NO_EXCEPTION(inputImage = itk::ReadImage<ImageType>(inputImageFile));
  std::cout << "inputImage: " << inputImage << std::endl;

  ImageType::SizeType lowerExtendRegion;
  lowerExtendRegion.Fill(1);

  ImageType::SizeType upperExtendRegion;
  upperExtendRegion.Fill(1);

  using ConstantPadImageFilterType = itk::ConstantPadImageFilter<ImageType,ImageType>;
  auto constantPad = ConstantPadImageFilterType::New();
  constantPad->SetInput(inputImage);
  constantPad->SetPadLowerBound(lowerExtendRegion);
  constantPad->SetPadUpperBound(upperExtendRegion);
  constantPad->SetConstant(0);

  using ImageToWasmImageFilterType = itk::ImageToWasmImageFilter<ImageType>;
  auto imageToJSON = ImageToWasmImageFilterType::New();
  imageToJSON->SetInput(constantPad->GetOutput());
  imageToJSON->Update();
  auto imageJSON = imageToJSON->GetOutput();
  std::cout << "Image JSON: " << imageJSON->GetJSON() << std::endl;

  using WasmImageToImageFilterType = itk::WasmImageToImageFilter<ImageType>;
  auto jsonToImage = WasmImageToImageFilterType::New();
  jsonToImage->SetInput(imageToJSON->GetOutput());
  jsonToImage->Update();
  ImageType::Pointer convertedImage = jsonToImage->GetOutput();

  std::cout << "convertedImage: " << convertedImage << std::endl;

  ITK_TRY_EXPECT_NO_EXCEPTION(itk::WriteImage(convertedImage, outputImageFile));

  return EXIT_SUCCESS;
}

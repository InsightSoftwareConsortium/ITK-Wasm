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
#include "itkPipeline.h"
#include "itkInputImage.h"
#include "itkOutputImage.h"
#include "itkSupportInputImageTypes.h"
#include "itkImageToWASMImageFilter.h"

template<typename TImage>
class PipelineFunctor
{
public:
  int operator()(itk::wasm::Pipeline & pipeline)
  {
    using ImageType = TImage;

    using InputImageType = itk::wasm::InputImage<ImageType>;
    InputImageType inputImage;
    pipeline.add_option("InputImage", inputImage, "The input image")->required();

    using OutputImageType = itk::wasm::OutputImage<ImageType>;
    OutputImageType outputImage;
    pipeline.add_option("OutputImage", outputImage, "The output image")->required();

    ITK_WASM_PARSE(pipeline);

    outputImage.Set(inputImage.Get());

    return EXIT_SUCCESS;
  }
};

int
itkSupportInputImageTypesMemoryIOTest(int argc, char * argv[])
{
  // Create image in memory
  constexpr unsigned int Dimension = 3;
  using PixelType = uint8_t;
  using ImageType = itk::Image<PixelType, Dimension>;

  const char * inputImageFile = argv[1];
  auto readInputImage = itk::ReadImage<ImageType>(inputImageFile);
  using ImageToWASMImageFilterType = itk::ImageToWASMImageFilter<ImageType>;
  auto imageToWASMImageFilter = ImageToWASMImageFilterType::New();
  imageToWASMImageFilter->SetInput(readInputImage);
  imageToWASMImageFilter->Update();
  auto readWASMImage = imageToWASMImageFilter->GetOutput();

  auto readWASMImageData = reinterpret_cast< const void * >(readWASMImage->GetImage()->GetBufferPointer());
  const auto readWASMImageDataSize = readWASMImage->GetImage()->GetPixelContainer()->Size();
  const size_t readWASMImageDataPointerAddress = itk_wasm_input_array_alloc(0, 0, 0, readWASMImageDataSize);
  auto readWASMImageDataPointer = reinterpret_cast< void * >(readWASMImageDataPointerAddress);
  std::memcpy(readWASMImageDataPointer, readWASMImageData, readWASMImageDataSize);

  auto readImageJSON = readWASMImage->GetJSON();
  void * readWASMImagePointer = reinterpret_cast< void * >( itk_wasm_input_json_alloc(0, 0, readImageJSON.size()));
  std::memcpy(readWASMImagePointer, readImageJSON.data(), readImageJSON.size());

  const char * mockArgv[] = {"itkSupportInputImageTypesMemoryIOTest", "--memory-io", "0", "0", NULL};

  itk::wasm::Pipeline pipeline("Test supporting multiple input image types in memory", 4, const_cast< char ** >(mockArgv));

  return itk::wasm::SupportInputImageTypes<PipelineFunctor,
   uint8_t,
   float>
  ::Dimensions<2U,3U>("InputImage", pipeline);
}

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
#include "itkImageToWasmImageFilter.h"

template<typename TImage>
class PipelineFunctor
{
public:
  int operator()(itk::wasm::Pipeline & pipeline)
  {
    using ImageType = TImage;

    using InputImageType = itk::wasm::InputImage<ImageType>;
    InputImageType inputImage;
    pipeline.add_option("input-image", inputImage, "The input image")->required()->type_name("INPUT_IMAGE");

    using OutputImageType = itk::wasm::OutputImage<ImageType>;
    OutputImageType outputImage;
    pipeline.add_option("output-image", outputImage, "The output image")->required()->type_name("OUTPUT_IMAGE");

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
  using ImageToWasmImageFilterType = itk::ImageToWasmImageFilter<ImageType>;
  auto imageToWasmImageFilter = ImageToWasmImageFilterType::New();
  imageToWasmImageFilter->SetInput(readInputImage);
  imageToWasmImageFilter->Update();
  auto readWasmImage = imageToWasmImageFilter->GetOutput();

  auto readWasmImageData = reinterpret_cast< const void * >(readWasmImage->GetImage()->GetBufferPointer());
  const auto readWasmImageDataSize = readWasmImage->GetImage()->GetPixelContainer()->Size();
  const size_t readWasmImageDataPointerAddress = itk_wasm_input_array_alloc(0, 0, 0, readWasmImageDataSize);
  auto readWasmImageDataPointer = reinterpret_cast< void * >(readWasmImageDataPointerAddress);
  std::memcpy(readWasmImageDataPointer, readWasmImageData, readWasmImageDataSize);

  auto readImageJSON = readWasmImage->GetJSON();
  void * readWasmImagePointer = reinterpret_cast< void * >( itk_wasm_input_json_alloc(0, 0, readImageJSON.size()));
  std::memcpy(readWasmImagePointer, readImageJSON.data(), readImageJSON.size());

  const char * mockArgv[] = {"itkSupportInputImageTypesMemoryIOTest", "--memory-io", "0", "0", NULL};

  itk::wasm::Pipeline pipeline("support-input-image-type-memory-io-test", "Test supporting multiple input image types in memory", 4, const_cast< char ** >(mockArgv));

  return itk::wasm::SupportInputImageTypes<PipelineFunctor,
   uint8_t,
   float>
  ::Dimensions<2U,3U>("input-image", pipeline);
}

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

template <typename TImage>
class PipelineFunctor
{
public:
  int
  operator()(itk::wasm::Pipeline & pipeline)
  {
    using ImageType = TImage;

    using InputImageType = itk::wasm::InputImage<ImageType>;
    InputImageType inputImage;
    pipeline.add_option("input-image", inputImage, "The input image")->required();

    using OutputImageType = itk::wasm::OutputImage<ImageType>;
    OutputImageType outputImage;
    pipeline.add_option("output-image", outputImage, "The output image")->required();

    ITK_WASM_PARSE(pipeline);

    outputImage.Set(inputImage.Get());

    return EXIT_SUCCESS;
  }
};

int
itkSupportInputImageTypesTest(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline(
    "support-input-image-types-test", "Test supporting multiple input image types", argc, argv);

  return itk::wasm::SupportInputImageTypes<PipelineFunctor, uint8_t, float, itk::VariableLengthVector<uint8_t>>::
    Dimensions<2U, 3U>("input-image", pipeline);
}

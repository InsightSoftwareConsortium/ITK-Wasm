/*=========================================================================

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

#include "itkBinShrinkImageFilter.h"

template<typename TImage>
class PipelineFunctor
{
public:
  int operator()(itk::wasm::Pipeline & pipeline)
  {
    using ImageType = TImage;
    constexpr unsigned int ImageDimension = ImageType::ImageDimension;

    using InputImageType = itk::wasm::InputImage<ImageType>;
    InputImageType inputImage;
    pipeline.add_option("input", inputImage, "Input image")->required()->type_name("INPUT_IMAGE");

    std::vector<unsigned int> shrinkFactors;
    pipeline.add_option("-s,--shrink-factors", shrinkFactors, "Shrink factors")->required()->type_size(ImageDimension);

    bool informationOnly = false;
    pipeline.add_flag("-i,--information-only", informationOnly, "Generate output image information only. Do not process pixels.")

    using OutputImageType = itk::wasm::OutputImage<ImageType>;
    OutputImageType downsampledImage;
    pipeline.add_option("downsampled", downsampledImage, "Output downsampled image")->required()->type_name("OUTPUT_IMAGE");

    ITK_WASM_PARSE(pipeline);

    using FilterType = itk::BinShrinkImageFilter<ImageType, ImageType>;
    auto filter = FilterType::New();
    filter->SetInput(inputImage.Get());
    for (unsigned int i = 0; i < ImageDimension; ++i)
    {
      filter->SetShrinkFactor(i, shrinkFactors[i]);
    }

    if (informationOnly)
    {
      ITK_WASM_CATCH_EXCEPTION(pipeline, filter->UpdateOutputInformation());
    }
    else
    {
      ITK_WASM_CATCH_EXCEPTION(pipeline, filter->UpdateLargestPossibleRegion());
    }

    typename ImageType::ConstPointer result = filter->GetOutput();
    downsampledImage.Set(result);

    return EXIT_SUCCESS;
  }
};

int main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("downsample-bin-strink", "Apply local averaging and subsample the input image.", argc, argv);

  return itk::wasm::SupportInputImageTypes<PipelineFunctor,
    uint8_t,
    double
    >
  ::Dimensions<2U>("input", pipeline);
}

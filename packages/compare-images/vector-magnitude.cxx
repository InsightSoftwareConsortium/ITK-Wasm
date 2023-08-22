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

#include "itkImage.h"
#include "itkVectorImage.h"
#include "itkVectorMagnitudeImageFilter.h"

template<typename TImage>
class PipelineFunctor
{
public:
  int operator()(itk::wasm::Pipeline & pipeline)
  {
    using ImageType = TImage;
    using ScalarType = typename ImageType::PixelType::ValueType;
    using ScalarImageType = itk::Image<ScalarType, ImageType::ImageDimension>;
    using MagnitudeFilterType = itk::VectorMagnitudeImageFilter<ImageType, ScalarImageType>;

    using InputImageType = itk::wasm::InputImage<ImageType>;
    InputImageType vectorImage;
    pipeline.add_option("vector-image", vectorImage, "Input vector image")->required()->type_name("INPUT_IMAGE");

    using OutputImageType = itk::wasm::OutputImage<ScalarImageType>;
    OutputImageType magnitudeImage;
    pipeline.add_option("magnitude-image", magnitudeImage, "Output magnitude image")->required()->type_name("OUTPUT_IMAGE");

    ITK_WASM_PARSE(pipeline);

    auto magnitudeFilter = MagnitudeFilterType::New();
    magnitudeFilter->SetInput(vectorImage.Get());
    ITK_WASM_CATCH_EXCEPTION(pipeline, magnitudeFilter->UpdateLargestPossibleRegion());

    typename ScalarImageType::ConstPointer magnitude = magnitudeFilter->GetOutput();
    magnitudeImage.Set(magnitude);

    return EXIT_SUCCESS;
  }
};

int main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("vector-magnitude", "Generate a scalar magnitude image based on the input vector's norm.", argc, argv);

  return itk::wasm::SupportInputImageTypes<PipelineFunctor,
  itk::VariableLengthVector<double> >
  ::Dimensions<2U,3U,4U,5U,6U>("vector-image", pipeline);
}
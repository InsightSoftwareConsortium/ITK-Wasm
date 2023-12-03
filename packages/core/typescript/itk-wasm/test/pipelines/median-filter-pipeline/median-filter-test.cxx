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
#include "itkMedianImageFilter.h"
#include "itkImageRegionSplitterSlowDimension.h"
#include "itkExtractImageFilter.h"
#include "itkPipeline.h"
#include "itkInputImage.h"
#include "itkOutputImage.h"
#include "itkSupportInputImageTypes.h"
#include "itkRGBPixel.h"
#include "itkRGBToLuminanceImageFilter.h"
#include "itkNumericTraits.h"

template<typename TImage>
int
MedianFilter(itk::wasm::Pipeline & pipeline, const TImage * inputImage)
{
  using ImageType = TImage;

  pipeline.get_option("input-image")->required()->type_name("INPUT_IMAGE");

  using OutputImageType = itk::wasm::OutputImage<ImageType>;
  OutputImageType outputImage;
  pipeline.add_option("output-image", outputImage, "The output image")->required()->type_name("OUTPUT_IMAGE");

  unsigned int radius = 1;
  pipeline.add_option("-r,--radius", radius, "Kernel radius in pixels");

  unsigned int maxTotalSplits = 1;
  pipeline.add_option("-m,--max-splits", maxTotalSplits, "Max total processing splits");

  unsigned int split = 1;
  pipeline.add_option("-s,--split", split, "Split to process");

  ITK_WASM_PARSE(pipeline);

  using SmoothingFilterType = itk::MedianImageFilter< ImageType, ImageType >;
  auto smoother = SmoothingFilterType::New();
  smoother->SetInput( inputImage );
  smoother->SetRadius( radius );

  using ROIFilterType = itk::ExtractImageFilter< ImageType, ImageType >;
  auto roiFilter = ROIFilterType::New();
  roiFilter->InPlaceOn();
  if (maxTotalSplits > 1)
  {
    smoother->UpdateOutputInformation();
    using RegionType = typename ImageType::RegionType;
    smoother->UpdateOutputInformation();
    const RegionType largestRegion( smoother->GetOutput()->GetLargestPossibleRegion() );

    using SplitterType = itk::ImageRegionSplitterSlowDimension;
    auto splitter = SplitterType::New();
    const unsigned int numberOfSplits = splitter->GetNumberOfSplits( largestRegion, maxTotalSplits );
    if (split >= numberOfSplits)
    {
      std::cerr << "Error: requested split: " << split << " is outside the number of splits: " << numberOfSplits << std::endl;
      return EXIT_FAILURE;
    }

    RegionType requestedRegion( largestRegion );
    splitter->GetSplit( split, numberOfSplits, requestedRegion );
    roiFilter->SetInput( smoother->GetOutput() );
    roiFilter->SetExtractionRegion( requestedRegion );
    roiFilter->UpdateLargestPossibleRegion();
    outputImage.Set( roiFilter->GetOutput() );
  }
  else
  {
    smoother->UpdateLargestPossibleRegion();
    outputImage.Set( smoother->GetOutput() );
  }

  return EXIT_SUCCESS;
}

template<typename TImage>
class PipelineFunctor
{
public:
  int operator()(itk::wasm::Pipeline & pipeline)
  {
    using ImageType = TImage;

    using InputImageType = itk::wasm::InputImage<ImageType>;
    InputImageType inputImage;
    pipeline.add_option("input-image", inputImage, "The input image");

    ITK_WASM_PRE_PARSE(pipeline);

    typename ImageType::ConstPointer image = inputImage.Get();
    return MedianFilter<ImageType>(pipeline, image);
  }
};

template<unsigned int VDimension>
class PipelineFunctor<itk::Image<itk::RGBPixel<uint8_t>, VDimension>>
{
public:
  int operator()(itk::wasm::Pipeline & pipeline)
  {
    constexpr unsigned int Dimension = VDimension;
    using PixelType = itk::RGBPixel<uint8_t>;
    using ImageType = itk::Image<PixelType, Dimension>;

    using InputImageType = itk::wasm::InputImage<ImageType>;
    InputImageType inputImage;
    pipeline.add_option("input-image", inputImage, "The input image");

    ITK_WASM_PRE_PARSE(pipeline);

    using ScalarImageType = itk::Image<uint8_t, Dimension>;

    using LuminanceFilterType = itk::RGBToLuminanceImageFilter<ImageType, ScalarImageType>;
    auto luminanceFilter = LuminanceFilterType::New();
    luminanceFilter->SetInput( inputImage.Get() );
    luminanceFilter->Update();

    return MedianFilter<ScalarImageType>(pipeline, luminanceFilter->GetOutput());
  }
};

int main( int argc, char * argv[] )
{
  itk::wasm::Pipeline pipeline("median-filter", "Apply a median filter to an image", argc, argv);

  return itk::wasm::SupportInputImageTypes<PipelineFunctor,
   uint8_t,
   itk::RGBPixel< uint8_t >,
   float>
  ::Dimensions<2U,3U>("input-image", pipeline);
}

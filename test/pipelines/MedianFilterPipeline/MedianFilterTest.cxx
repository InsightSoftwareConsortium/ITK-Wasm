/*=========================================================================
 *
 *  Copyright NumFOCUS
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0.txt
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

int main( int argc, char * argv[] )
{
  itk::wasm::Pipeline pipeline("Apply a median filter to an image", argc, argv);

  using PixelType = unsigned char;
  constexpr unsigned int Dimension = 2;
  using ImageType = itk::Image< PixelType, Dimension >;

  const char * inputImageFile = argv[1];
  using InputImageType = itk::wasm::InputImage<ImageType>;
  InputImageType inputImage;
  pipeline.add_option("InputImage", inputImage, "The input image")->required();

  using OutputImageType = itk::wasm::OutputImage<ImageType>;
  OutputImageType outputImage;
  pipeline.add_option("OutputImage", outputImage, "The output image")->required();

  unsigned int radius = 1;
  pipeline.add_option("-r,--radius", radius, "Kernel radius in pixels");

  unsigned int maxTotalSplits = 1;
  pipeline.add_option("-m,--max-splits", radius, "Max total processing splits");

  unsigned int split = 1;
  pipeline.add_option("-s,--split", radius, "Split to process");

  ITK_WASM_PARSE(pipeline);


  using SmoothingFilterType = itk::MedianImageFilter< ImageType, ImageType >;
  auto smoother = SmoothingFilterType::New();
  smoother->SetInput( inputImage.Get() );
  smoother->SetRadius( radius );

  using ROIFilterType = itk::ExtractImageFilter< ImageType, ImageType >;
  auto roiFilter = ROIFilterType::New();
  roiFilter->InPlaceOn();
  if (maxTotalSplits > 1)
  {
    smoother->UpdateOutputInformation();
    using RegionType = ImageType::RegionType;
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
    roiFilter->Update();
    outputImage.Set( roiFilter->GetOutput() );
  }
  else
  {
    smoother->Update();
    outputImage.Set( smoother->GetOutput() );
  }

  return EXIT_SUCCESS;
}

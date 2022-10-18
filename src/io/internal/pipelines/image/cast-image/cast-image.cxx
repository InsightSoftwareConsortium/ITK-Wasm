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
#include "itkSupportInputImageTypes.h"
#include "itkInputImage.h"
#include "itkOutputImage.h"
#include "itkPipeline.h"
#include "itkWASMMapComponentType.h"
#include "itkWASMMapPixelType.h"

#include "itkDefaultConvertPixelTraits.h"
#include "itkCastImageFilter.h"
#include "itkImage.h"
#include "itkVectorImage.h"

template <typename TInputImage, typename TOutputImage>
int CastImage(itk::wasm::Pipeline & pipeline)
{
  using InputWASMImageType = itk::wasm::InputImage<TInputImage>;
  InputWASMImageType inputImage;
  pipeline.add_option("input-image", inputImage, "The input image")->required()->type_name("INPUT_IMAGE");

  using OutputImageType = itk::wasm::OutputImage<TOutputImage>;
  OutputImageType outputImage;
  pipeline.add_option("output-image", outputImage, "The output image")->required()->type_name("OUTPUT_IMAGE");

  ITK_WASM_PARSE(pipeline);

  using CastFilterType = itk::CastImageFilter<TInputImage, TOutputImage>;
  auto castFilter = CastFilterType::New();
  castFilter->SetInput(inputImage.Get());
  castFilter->InPlaceOff();
  castFilter->UpdateLargestPossibleRegion();

  outputImage.Set(castFilter->GetOutput());

  return EXIT_SUCCESS;
}

template<typename TInputImage>
class PipelineFunctor
{
public:
  int operator()(itk::wasm::Pipeline & pipeline)
  {
    using InputImageType = TInputImage;

    std::string componentType("");
    pipeline.add_option("-c,--component-type", componentType, "String component type, from itk-wasm IntTypes, FloatTypes, for the output pixel components. Defaults to the input component type.");

    std::string pixelType("");
    pipeline.add_option("-p,--pixel-type", pixelType, "String pixel type, from itk-wasm PixelTypes, for the output pixels. Defaults to the input pixel type.");

    const auto iwpArgc = pipeline.get_argc();
    const auto iwpArgv = pipeline.get_argv();
    bool passThrough = false;
    for (int ii = 0; ii < iwpArgc; ++ii)
      {
        const std::string arg(iwpArgv[ii]);
        if (arg == "-h" || arg == "--help")
        {
          passThrough = true;
        }
      }
    if (passThrough)
    {
      return IterateOutputPixelTypes<float>(pipeline, componentType, pixelType, passThrough);
    }

    using InputWASMImageType = itk::wasm::InputImage<InputImageType>;
    InputWASMImageType inputImage;
    auto tempOption = pipeline.add_option("input-image", inputImage, "The input image");

    ITK_WASM_PRE_PARSE(pipeline);

    pipeline.remove_option(tempOption);

    using InputConvertPixelTraits = itk::DefaultConvertPixelTraits<typename InputImageType::PixelType>;

    if (componentType.empty())
    {
      componentType = itk::wasm::MapComponentType<typename InputConvertPixelTraits::ComponentType>::ComponentString;
    }

    if (pixelType.empty())
    {
      pixelType = itk::wasm::MapPixelType<typename InputImageType::PixelType>::PixelString;
    }

    return IterateOutputPixelTypes<
      uint8_t,
      int8_t,
      uint16_t,
      int16_t,
      uint32_t,
      int32_t,
      uint64_t,
      int64_t,
      float,
      double
      >(pipeline, componentType, pixelType);
  }

private:
  template<typename TPixel, typename ...TPixelsRest>
  static int
  IterateOutputPixelTypes(itk::wasm::Pipeline & pipeline, const std::string & componentType, const std::string & pixelType, bool passThrough=false)
  {
    using InputImageType = TInputImage;
    constexpr unsigned int Dimension = InputImageType::ImageDimension;
    using PixelType = TPixel;
    using ConvertPixelTraits = itk::DefaultConvertPixelTraits<PixelType>;

    if (passThrough || componentType == itk::wasm::MapComponentType<typename ConvertPixelTraits::ComponentType>::ComponentString && pixelType == itk::wasm::MapPixelType<PixelType>::PixelString)
    {
      using OutputImageType = itk::Image<PixelType, Dimension>;

      return CastImage<InputImageType, OutputImageType>(pipeline);
    }

    if constexpr (sizeof...(TPixelsRest) > 0) {
      return IterateOutputPixelTypes<TPixelsRest...>(pipeline, componentType, pixelType, passThrough);
    }

    std::ostringstream ostrm;
    ostrm << "Unsupported pixel type: " << pixelType << " with component type: " << componentType;
    CLI::Error err("Runtime error", ostrm.str(), 1);
    return pipeline.exit(err);
  }
};

template<unsigned int VDimension, typename TComponent>
class PipelineFunctor<itk::VectorImage<TComponent, VDimension>>
{
public:
  int operator()(itk::wasm::Pipeline & pipeline)
  {
    using InputImageType = itk::VectorImage<TComponent, VDimension>;

    std::string componentType("");
    pipeline.add_option("-c,--component-type", componentType, "String component type, from itk-wasm IntTypes, FloatTypes, for the output pixel components. Defaults to the input component type.");

    std::string pixelType("");
    pipeline.add_option("-p,--pixel-type", pixelType, "String pixel type, from itk-wasm PixelTypes, for the output pixels. Defaults to the input pixel type.");

    const auto iwpArgc = pipeline.get_argc();
    const auto iwpArgv = pipeline.get_argv();
    bool passThrough = false;
    for (int ii = 0; ii < iwpArgc; ++ii)
      {
        const std::string arg(iwpArgv[ii]);
        if (arg == "-h" || arg == "--help")
        {
          passThrough = true;
        }
      }
    if (passThrough)
    {
      return IterateOutputPixelTypes<float>(pipeline, componentType, pixelType, passThrough);
    }

    using InputWASMImageType = itk::wasm::InputImage<InputImageType>;
    InputWASMImageType inputImage;
    auto tempOption = pipeline.add_option("input-image", inputImage, "The input image");

    ITK_WASM_PRE_PARSE(pipeline);

    pipeline.remove_option(tempOption);

    using InputConvertPixelTraits = itk::DefaultConvertPixelTraits<typename InputImageType::PixelType>;

    if (componentType.empty())
    {
      componentType = itk::wasm::MapComponentType<typename InputConvertPixelTraits::ComponentType>::ComponentString;
    }

    if (pixelType.empty())
    {
      pixelType = itk::wasm::MapPixelType<typename InputImageType::PixelType>::PixelString;
    }

    return IterateOutputPixelTypes<float>(pipeline, componentType, pixelType);
  }

private:
  template<typename TPixel, typename ...TPixelsRest>
  static int
  IterateOutputPixelTypes(itk::wasm::Pipeline & pipeline, const std::string & componentType, const std::string & pixelType, bool passThrough=false)
  {
    using InputImageType = itk::VectorImage<TComponent, VDimension>;
    constexpr unsigned int Dimension = InputImageType::ImageDimension;
    using PixelType = TPixel;
    using ConvertPixelTraits = itk::DefaultConvertPixelTraits<PixelType>;

    if (passThrough || componentType == itk::wasm::MapComponentType<typename ConvertPixelTraits::ComponentType>::ComponentString && pixelType == itk::wasm::MapPixelType<PixelType>::PixelString)
    {
      using OutputImageType = itk::VectorImage<typename ConvertPixelTraits::ComponentType, Dimension>;

      return CastImage<InputImageType, OutputImageType>(pipeline);
    }

    if constexpr (sizeof...(TPixelsRest) > 0) {
      return IterateOutputPixelTypes<TPixelsRest...>(pipeline, componentType, pixelType, passThrough);
    }

    std::ostringstream ostrm;
    ostrm << "Unsupported pixel type: " << pixelType << " with component type: " << componentType;
    CLI::Error err("Runtime error", ostrm.str(), 1);
    return pipeline.exit(err);
  }
};

int main (int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("cast-image", "Cast an image from one image type to another", argc, argv);

  return itk::wasm::SupportInputImageTypes<PipelineFunctor,
    uint8_t,
    int8_t,
    uint16_t,
    int16_t,
    uint32_t,
    int32_t,
    uint64_t,
    int64_t,
    float,
    double
  >::Dimensions<2U,3U>("input-image", pipeline);
}
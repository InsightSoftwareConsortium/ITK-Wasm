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
#ifndef itkSupportInputImageTypes_h
#define itkSupportInputImageTypes_h
#include "itkPipeline.h"
#include "itkWasmPixelTypeFromIOPixelEnum.h"
#include "itkWasmComponentTypeFromIOComponentEnum.h"
#include "itkDefaultConvertPixelTraits.h"
#include "itkWasmMapComponentType.h"
#include "itkWasmMapPixelType.h"

#include "itkImage.h"
#include "itkVectorImage.h"
#include "itkImageIOBase.h"
#include "itkImageIOFactory.h"
#include "itkSpecializedImagePipelineFunctor.h"
#include "WebAssemblyInterfaceExport.h"

#include "itkImageJSON.h"

namespace itk
{

WebAssemblyInterface_EXPORT bool
lexical_cast(const std::string & input, ImageTypeJSON & imageType);

namespace wasm
{

/** \class SupportInputImageTypes
 *
 * \brief Instantiatiate a Pipeline functor over multiple pixel types and dimensions and match to the input image type.
 *
 * Instantiate the PipelineFunctor (function object) over multiple pixel types and image dimensions.
 *  If the input image matches these pixel types or dimensions, use the compile-time optimized pipeline for that image
type.
 *  Otherwise, exit the pipeline with an error identifying the unsupported image type.
 *
 * Example usage:
 *
```
template<typename TImage>
class PipelineFunctor
{
public:
  int operator()(itk::wasm::Pipeline & pipeline)
  {
    using ImageType = TImage;

    using InputImageType = itk::wasm::InputImage<ImageType>;
    InputImageType inputImage;
    pipeline.add_option("input-image", inputImage, "The input image")->required();
```
[...]

```
int
main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("support-multiple", "Test supporting multiple input image types", argc, argv);

  // Supports the pixels types uint8_t, float for itk::Image, itk::VectorImage
  // Supports the image dimensions 2, 3
  return itk::wasm::SupportInputImageTypes<PipelineFunctor,
   uint8_t,
   float>
  ::Dimensions<2U,3U>("input-image", pipeline);
}
```
 *
 * \ingroup WebAssemblyInterface
 */
template <template <typename TImage> class TPipelineFunctor, typename... TPixels>
class SupportInputImageTypes
{
public:
  template <unsigned int... VDimensions>
  static int
  Dimensions(const std::string & inputImageOptionName, Pipeline & pipeline)
  {
    ImageTypeJSON imageType;

    const auto iwpArgc = pipeline.get_argc();
    const auto iwpArgv = pipeline.get_argv();
    bool       passThrough = false;
    for (int ii = 0; ii < iwpArgc; ++ii)
    {
      const std::string arg(iwpArgv[ii]);
      if (arg == "-h" || arg == "--help" || arg == "--interface-json" || arg == "--version")
      {
        passThrough = true;
      }
    }
    if (passThrough)
    {
      return IterateDimensions<VDimensions...>(pipeline, imageType, passThrough);
    }

    auto tempOption = pipeline.add_option(inputImageOptionName, imageType, "Read image type.");

    ITK_WASM_PRE_PARSE(pipeline);

    pipeline.remove_option(tempOption);

    return IterateDimensions<VDimensions...>(pipeline, imageType);
  }

private:
  template <unsigned int VDimension, typename TPixel, typename... TPixelsRest>
  static int
  IteratePixelTypes(Pipeline & pipeline, const ImageTypeJSON & imageType, bool passThrough = false)
  {
    constexpr unsigned int Dimension = VDimension;
    using PixelType = TPixel;
    using ConvertPixelTraits = DefaultConvertPixelTraits<PixelType>;

    if (passThrough ||
        imageType.componentType == MapComponentType<typename ConvertPixelTraits::ComponentType>::JSONComponentEnum &&
          imageType.pixelType == MapPixelType<PixelType>::JSONPixelEnum)
    {
      if (passThrough || imageType.pixelType == JSONPixelTypesEnum::VariableLengthVector ||
          imageType.pixelType == JSONPixelTypesEnum::VariableSizeMatrix ||
          imageType.components == ConvertPixelTraits::GetNumberOfComponents())
      {
        return SpecializedImagePipelineFunctor<TPipelineFunctor, Dimension, PixelType>()(pipeline);
      }
    }

    if constexpr (sizeof...(TPixelsRest) > 0)
    {
      return IteratePixelTypes<VDimension, TPixelsRest...>(pipeline, imageType);
    }

    std::ostringstream ostrm;
    std::string        imageTypeString = glz::write_json(imageType).value_or("error");
    ostrm << "Unsupported image type: " << imageTypeString << std::endl;
    CLI::Error err("Runtime error", ostrm.str(), 1);
    return pipeline.exit(err);
  }

  template <unsigned int VDimension, unsigned int... VDimensions>
  static int
  IterateDimensions(Pipeline & pipeline, const ImageTypeJSON & imageType, bool passThrough = false)
  {
    if (passThrough || VDimension == imageType.dimension)
    {
      return IteratePixelTypes<VDimension, TPixels...>(pipeline, imageType, passThrough);
    }

    if constexpr (sizeof...(VDimensions) > 0)
    {
      return IterateDimensions<VDimensions...>(pipeline, imageType);
    }

    std::ostringstream ostrm;
    ostrm << "Unsupported image dimension: " << imageType.dimension;
    CLI::Error err("Runtime error", ostrm.str(), 1);
    return pipeline.exit(err);
  }
};

} // end namespace wasm
} // end namespace itk

#endif

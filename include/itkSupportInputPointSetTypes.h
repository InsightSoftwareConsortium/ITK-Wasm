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
#ifndef itkSupportInputPointSetTypes_h
#define itkSupportInputPointSetTypes_h
#include "itkPipeline.h"
#include "itkWasmPixelTypeFromIOPixelEnum.h"
#include "itkWasmComponentTypeFromIOComponentEnum.h"
#include "itkMeshConvertPixelTraits.h"
#include "itkWasmMapComponentType.h"
#include "itkWasmMapPixelType.h"

#include "itkPointSet.h"
#include "itkMeshIOBase.h"
#include "itkMeshIOFactory.h"
#include "WebAssemblyInterfaceExport.h"

#include "itkPointSetJSON.h"

namespace itk
{

WebAssemblyInterface_EXPORT bool lexical_cast(const std::string &input, PointSetTypeJSON & pointSetType);

namespace wasm
{

/** \class SupportInputPointSetTypes
 *
 * \brief Instantiatiate a Pipeline functor over multiple pixel types and dimensions and match to the input pointSet type.
 *
 * Instantiate the PipelineFunctor (function object) over multiple pixel types and pointSet dimensions.
 *  If the input pointSet matches these pixel types or dimensions, use the compile-time optimized pipeline for that pointSet type.
 *  Otherwise, exit the pipeline with an error identifying the unsupported pointSet type.
 *
 * Example usage:
 *
```
template<typename TPointSet>
class PipelineFunctor
{
public:
  int operator()(itk::wasm::Pipeline & pipeline)
  {
    using PointSetType = TPointSet;

    using InputPointSetType = itk::wasm::InputPointSet<PointSetType>;
    InputPointSetType inputPointSet;
    pipeline.add_option("input-pointSet", inputPointSet, "The input pointSet")->required();
```
[...]

```
int
main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("support-multiple", "Test supporting multiple input pointSet types", argc, argv);

  // Supports the pixels types uint8_t, float
  // Supports the pointSet dimensions 2, 3
  return itk::wasm::SupportInputPointSetTypes<PipelineFunctor,
   uint8_t,
   float>
  ::Dimensions<2U,3U>("input-pointSet", pipeline);
}
```
 * It is assumed that the point data will have the same pixel type.
 *
 * The number of pixel components is taken from the point pixel data.
 *
 * \ingroup WebAssemblyInterface
 */
template<template <typename TPointSet> class TPipelineFunctor, typename ...TPixels>
class
SupportInputPointSetTypes
{
public:
  template<unsigned int ...VDimensions>
  static int
  Dimensions(const std::string & inputPointSetOptionName, Pipeline & pipeline)
  {
    PointSetTypeJSON pointSetType;

    const auto iwpArgc = pipeline.get_argc();
    const auto iwpArgv = pipeline.get_argv();
    bool passThrough = false;
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
      return IterateDimensions<VDimensions...>(pipeline, pointSetType, passThrough);
    }

    auto tempOption = pipeline.add_option(inputPointSetOptionName, pointSetType, "Read pointSet type.");

    ITK_WASM_PRE_PARSE(pipeline);

    pipeline.remove_option(tempOption);

    return IterateDimensions<VDimensions...>(pipeline, pointSetType);
  }

private:
  template<unsigned int VDimension, typename TPixel, typename ...TPixelsRest>
  static int
  IteratePixelTypes(Pipeline & pipeline, const PointSetTypeJSON & pointSetType, bool passThrough = false)
  {
    constexpr unsigned int Dimension = VDimension;
    using PixelType = TPixel;
    using ConvertPixelTraits = MeshConvertPixelTraits<PixelType>;

    const auto components = pointSetType.pointPixelComponents;

    if (passThrough || components == 0
     || pointSetType.pointPixelComponentType == MapComponentType<typename ConvertPixelTraits::ComponentType>::JSONComponentEnum
     && pointSetType.pointPixelType == MapPixelType<PixelType>::JSONPixelEnum)
    {
      if (pointSetType.pointPixelType == JSONPixelTypesEnum::VariableLengthVector || pointSetType.pointPixelType == JSONPixelTypesEnum::VariableSizeMatrix)
      {
        // todo: VectorPointSet support for ImportPointSetFilter?
        // using PointSetType = itk::VectorPointSet<typename ConvertPixelTraits::ComponentType, Dimension>;

        // using PipelineType = TPipelineFunctor<PointSetType>;
        // return PipelineType()(pipeline);
      }
      else if(passThrough || components == ConvertPixelTraits::GetNumberOfComponents() || components == 0 )
      {
        using PointSetType = PointSet<PixelType, Dimension>;

        using PipelineType = TPipelineFunctor<PointSetType>;
        return PipelineType()(pipeline);
      }
    }

    if constexpr (sizeof...(TPixelsRest) > 0) {
      return IteratePixelTypes<VDimension, TPixelsRest...>(pipeline, pointSetType);
    }

    std::ostringstream ostrm;
    std::string pointSetTypeString = glz::write_json(pointSetType).value_or("error");
    ostrm << "Unsupported pointSet type: " << pointSetTypeString << std::endl;
    CLI::Error err("Runtime error", ostrm.str(), 1);
    return pipeline.exit(err);
  }

  template<unsigned int VDimension, unsigned int ...VDimensions>
  static int
  IterateDimensions(Pipeline & pipeline, const PointSetTypeJSON & pointSetType, bool passThrough = false)
  {
    if (passThrough || VDimension == pointSetType.dimension)
    {
      return IteratePixelTypes<VDimension, TPixels...>(pipeline, pointSetType);
    }

    if constexpr (sizeof...(VDimensions) > 0) {
      return IterateDimensions<VDimensions...>(pipeline, pointSetType);
    }

    std::ostringstream ostrm;
    ostrm << "Unsupported pointSet dimension: " << pointSetType.dimension;
    CLI::Error err("Runtime error", ostrm.str(), 1);
    return pipeline.exit(err);
  }
};

} // end namespace wasm
} // end namespace itk

#endif

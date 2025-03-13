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
#ifndef itkSupportInputMeshTypes_h
#define itkSupportInputMeshTypes_h
#include "itkPipeline.h"
#include "itkWasmPixelTypeFromIOPixelEnum.h"
#include "itkWasmComponentTypeFromIOComponentEnum.h"
#include "itkMeshConvertPixelTraits.h"
#include "itkWasmMapComponentType.h"
#include "itkWasmMapPixelType.h"

#include "itkMesh.h"
#include "itkMeshIOBase.h"
#include "itkMeshIOFactory.h"
#include "WebAssemblyInterfaceExport.h"

#include "itkMeshJSON.h"

namespace itk
{

WebAssemblyInterface_EXPORT bool
lexical_cast(const std::string & input, MeshTypeJSON & meshType);

namespace wasm
{

/** \class SupportInputMeshTypes
 *
 * \brief Instantiatiate a Pipeline functor over multiple pixel types and dimensions and match to the input mesh type.
 *
 * Instantiate the PipelineFunctor (function object) over multiple pixel types and mesh dimensions.
 *  If the input mesh matches these pixel types or dimensions, use the compile-time optimized pipeline for that mesh
type.
 *  Otherwise, exit the pipeline with an error identifying the unsupported mesh type.
 *
 * Example usage:
 *
```
template<typename TMesh>
class PipelineFunctor
{
public:
  int operator()(itk::wasm::Pipeline & pipeline)
  {
    using MeshType = TMesh;

    using InputMeshType = itk::wasm::InputMesh<MeshType>;
    InputMeshType inputMesh;
    pipeline.add_option("input-mesh", inputMesh, "The input mesh")->required();
```
[...]

```
int
main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("support-multiple", "Test supporting multiple input mesh types", argc, argv);

  // Supports the pixels types uint8_t, float
  // Supports the mesh dimensions 2, 3
  return itk::wasm::SupportInputMeshTypes<PipelineFunctor,
   uint8_t,
   float>
  ::Dimensions<2U,3U>("input-mesh", pipeline);
}
```
 * It is assumed that the cell and point data will have the same pixel type.
 *
 * The number of pixel components is taken from the point pixel data. If there are 0 point pixel data components,
 * the cell pixel data components are queried.
 *
 * \ingroup WebAssemblyInterface
 */
template <template <typename TMesh> class TPipelineFunctor, typename... TPixels>
class SupportInputMeshTypes
{
public:
  template <unsigned int... VDimensions>
  static int
  Dimensions(const std::string & inputMeshOptionName, Pipeline & pipeline)
  {
    MeshTypeJSON meshType;

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
      return IterateDimensions<VDimensions...>(pipeline, meshType, passThrough);
    }

    auto tempOption = pipeline.add_option(inputMeshOptionName, meshType, "Read mesh type.");

    ITK_WASM_PRE_PARSE(pipeline);

    pipeline.remove_option(tempOption);

    return IterateDimensions<VDimensions...>(pipeline, meshType);
  }

private:
  template <unsigned int VDimension, typename TPixel, typename... TPixelsRest>
  static int
  IteratePixelTypes(Pipeline & pipeline, const MeshTypeJSON & meshType, bool passThrough = false)
  {
    constexpr unsigned int Dimension = VDimension;
    using PixelType = TPixel;
    using ConvertPixelTraits = MeshConvertPixelTraits<PixelType>;

    const auto components =
      meshType.pointPixelComponents ? meshType.pointPixelComponents : meshType.cellPixelComponents;

    if (passThrough || components == 0 ||
        meshType.pointPixelComponentType ==
            MapComponentType<typename ConvertPixelTraits::ComponentType>::JSONComponentEnum &&
          meshType.pointPixelType == MapPixelType<PixelType>::JSONPixelEnum)
    {
      if (meshType.pointPixelType == JSONPixelTypesEnum::VariableLengthVector ||
          meshType.pointPixelType == JSONPixelTypesEnum::VariableSizeMatrix)
      {
        // todo: VectorMesh support for ImportMeshFilter?
        // using MeshType = itk::VectorMesh<typename ConvertPixelTraits::ComponentType, Dimension>;

        // using PipelineType = TPipelineFunctor<MeshType>;
        // return PipelineType()(pipeline);
      }
      else if (passThrough || components == ConvertPixelTraits::GetNumberOfComponents() || components == 0)
      {
        using MeshType = Mesh<PixelType, Dimension>;

        using PipelineType = TPipelineFunctor<MeshType>;
        return PipelineType()(pipeline);
      }
    }

    if constexpr (sizeof...(TPixelsRest) > 0)
    {
      return IteratePixelTypes<VDimension, TPixelsRest...>(pipeline, meshType);
    }

    std::ostringstream ostrm;
    std::string        meshTypeString = glz::write_json(meshType).value_or("error");
    ostrm << "Unsupported mesh type: " << meshTypeString << std::endl;
    CLI::Error err("Runtime error", ostrm.str(), 1);
    return pipeline.exit(err);
  }

  template <unsigned int VDimension, unsigned int... VDimensions>
  static int
  IterateDimensions(Pipeline & pipeline, const MeshTypeJSON & meshType, bool passThrough = false)
  {
    if (passThrough || VDimension == meshType.dimension)
    {
      return IteratePixelTypes<VDimension, TPixels...>(pipeline, meshType);
    }

    if constexpr (sizeof...(VDimensions) > 0)
    {
      return IterateDimensions<VDimensions...>(pipeline, meshType);
    }

    std::ostringstream ostrm;
    ostrm << "Unsupported mesh dimension: " << meshType.dimension;
    CLI::Error err("Runtime error", ostrm.str(), 1);
    return pipeline.exit(err);
  }
};

} // end namespace wasm
} // end namespace itk

#endif

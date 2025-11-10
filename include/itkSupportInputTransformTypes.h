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
#ifndef itkSupportInputTransformTypes_h
#define itkSupportInputTransformTypes_h
#include "itkPipeline.h"
#include "itkWasmPixelTypeFromIOPixelEnum.h"
#include "itkWasmComponentTypeFromIOComponentEnum.h"
#include "itkWasmMapComponentType.h"

#include "itkTransform.h"
#include "itkTransformIOBase.h"
#include "itkTransformIOFactory.h"
#include "WebAssemblyInterfaceExport.h"

#include "itkTransformJSON.h"

namespace itk
{

WebAssemblyInterface_EXPORT bool
lexical_cast(const std::string & input, TransformTypeJSON & transformType);

namespace wasm
{

/** \class SupportInputTransformTypes
 *
 * \brief Instantiatiate a Pipeline functor over multiple transform parameter types and dimensions and match to the
input transform type.
 *
 *  Instantiate the PipelineFunctor (function object) over multiple transform types.
 *  If the input transform matches these parameter types and dimensions, use the compile-time optimized pipeline for
that transform type.
 *  Otherwise, exit the pipeline with an error identifying the unsupported transform type.
 *
 * Example usage:
 *
```
template<typename TTransform>
class PipelineFunctor
{
public:
  int operator()(itk::wasm::Pipeline & pipeline)
  {
    using TransformType = TTransform;

    using InputTransformType = itk::wasm::InputTransform<TransformType>;
    InputTransformType inputTransform;
    pipeline.add_option("input-transform", inputTransform, "The input polydata")->required();
```
[...]

```
int
main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("support-multiple", "Test supporting multiple input transform types", argc, argv);

  // Supports the parameters types float, double, and dimensions 2 and 3
  return itk::wasm::SupportInputTransformTypes<PipelineFunctor, float, double>
  ::Dimensions<2U, 3U>("input-transform", pipeline);
}
```
 * It is assumed that the input dimension and output dimension will be the same.
 *
 * \ingroup WebAssemblyInterface
 */
template <template <typename TTransform> class TPipelineFunctor, typename... TParameterValuesSupported>
class SupportInputTransformTypes
{
public:
  template <unsigned int... VDimensions>
  static int
  Dimensions(const std::string & inputTransformOptionName, Pipeline & pipeline)
  {
    TransformTypeJSON transformType;

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
      return IterateDimensions<VDimensions...>(pipeline, transformType, passThrough);
    }

    auto tempOption = pipeline.add_option(inputTransformOptionName, transformType, "Read Transform type.");

    ITK_WASM_PRE_PARSE(pipeline);

    pipeline.remove_option(tempOption);

    return IterateDimensions<VDimensions...>(pipeline, transformType);
  }

private:
  template <unsigned int VDimension, typename TParameterValues, typename... TParameterValuesRest>
  static int
  IterateParameterValueTypes(Pipeline & pipeline, const TransformTypeJSON & transformType, bool passThrough = false)
  {
    using ParameterValueType = TParameterValues;

    if (passThrough || transformType.parametersValueType == MapComponentType<ParameterValueType>::JSONFloatTypeEnum)
    {
      using TransformType = Transform<ParameterValueType, VDimension, VDimension>;

      using PipelineType = TPipelineFunctor<TransformType>;
      return PipelineType()(pipeline);
    }

    if constexpr (sizeof...(TParameterValuesRest) > 0)
    {
      return IterateParameterValueTypes<VDimension, TParameterValuesRest...>(pipeline, transformType);
    }

    std::ostringstream ostrm;
    std::string        transformTypeString = glz::write_json(transformType).value_or("error");
    ostrm << "Unsupported transform type: " << transformTypeString << std::endl;
    CLI::Error err("Runtime error", ostrm.str(), 1);
    return pipeline.exit(err);
  }

  template <unsigned int VDimension, unsigned int... VDimensions>
  static int
  IterateDimensions(Pipeline & pipeline, const TransformTypeJSON & transformType, bool passThrough = false)
  {
    if (passThrough || VDimension == transformType.inputDimension)
    {
      return IterateParameterValueTypes<VDimension, TParameterValuesSupported...>(pipeline, transformType);
    }

    if constexpr (sizeof...(VDimensions) > 0)
    {
      return IterateDimensions<VDimensions...>(pipeline, transformType);
    }

    std::ostringstream ostrm;
    ostrm << "Unsupported transform dimension: " << transformType.inputDimension;
    CLI::Error err("Runtime error", ostrm.str(), 1);
    return pipeline.exit(err);
  }
};

} // end namespace wasm
} // end namespace itk

#endif

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
#include "itkInputTransform.h"
#include "itkOutputTransform.h"
#include "itkSupportInputTransformTypes.h"
#include "itkWasmTransformIOFactory.h"
#include "itkAffineTransform.h"

template <typename TTransform>
class PipelineFunctor
{
public:
  int
  operator()(itk::wasm::Pipeline & pipeline)
  {
    using TransformType = itk::AffineTransform<typename TTransform::ParametersValueType, TTransform::InputSpaceDimension>;

    using InputTransformType = itk::wasm::InputTransform<TransformType>;
    InputTransformType inputTransform;
    pipeline.add_option("input-transform", inputTransform, "The input transform")->required()->type_name("INPUT_TRANSFORM");

    using OutputTransformType = itk::wasm::OutputTransform<TransformType>;
    OutputTransformType outputTransform;
    pipeline.add_option("output-transform", outputTransform, "The output transform")
      ->required()
      ->type_name("OUTPUT_TRANSFORM");

    ITK_WASM_PARSE(pipeline);

    outputTransform.Set(inputTransform.Get());

    return EXIT_SUCCESS;
  }
};

int
itkSupportInputTransformTypesTest(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline(
    "support-input-transform-types-test", "Test supporting multiple input transform types", argc, argv);

  itk::WasmTransformIOFactory::RegisterOneFactory();

  return itk::wasm::SupportInputTransformTypes<PipelineFunctor, float, double>::Dimensions<2U, 3U>("input-transform", pipeline);
}

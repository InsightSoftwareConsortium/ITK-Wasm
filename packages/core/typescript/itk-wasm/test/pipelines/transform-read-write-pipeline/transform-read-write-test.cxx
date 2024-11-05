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
#include "itkAffineTransform.h"
#include "itkInputTransform.h"
#include "itkOutputTransform.h"
#include "itkPipeline.h"

int main( int argc, char * argv[] )
{
  itk::wasm::Pipeline pipeline("transform-read-write-test", "A test for reading and writing transforms", argc, argv);

  using ParametersValueType = double;
  constexpr unsigned int Dimension = 3;
  using TransformType = itk::AffineTransform< ParametersValueType, Dimension >;

  using InputTransformType = itk::wasm::InputTransform<TransformType>;
  InputTransformType inputTransform;
  pipeline.add_option("input-transform", inputTransform, "The input transform")->required()->type_name("INPUT_TRANSFORM");

  using OutputTransformType = itk::wasm::OutputTransform<TransformType>;
  OutputTransformType outputTransform;
  pipeline.add_option("output-transform", outputTransform, "The output transform")->required()->type_name("OUTPUT_TRANSFORM");

  ITK_WASM_PARSE(pipeline);

  outputTransform.Set(inputTransform.Get());

  return EXIT_SUCCESS;
}

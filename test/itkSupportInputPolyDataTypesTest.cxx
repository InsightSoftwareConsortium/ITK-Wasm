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
#include "itkInputPolyData.h"
#include "itkOutputPolyData.h"
#include "itkSupportInputPolyDataTypes.h"
#include "itkWASMMeshIOFactory.h"

template<typename TPolyData>
class PipelineFunctor
{
public:
  int operator()(itk::wasm::Pipeline & pipeline)
  {
    using PolyDataType = TPolyData;

    using InputPolyDataType = itk::wasm::InputPolyData<PolyDataType>;
    InputPolyDataType inputPolyData;
    pipeline.add_option("input-polydata", inputPolyData, "The input polydata")->required()->type_name("INPUT_POLYDATA");

    using OutputPolyDataType = itk::wasm::OutputPolyData<PolyDataType>;
    OutputPolyDataType outputPolyData;
    pipeline.add_option("output-polydata", outputPolyData, "The output polydata")->required()->type_name("OUTPUT_POLYDATA");

    ITK_WASM_PARSE(pipeline);

    outputPolyData.Set(inputPolyData.Get());

    return EXIT_SUCCESS;
  }
};

int
itkSupportInputPolyDataTypesTest(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("support-input-polydata-types-test", "Test supporting multiple input mesh types", argc, argv);

  itk::WASMMeshIOFactory::RegisterOneFactory();

  return itk::wasm::SupportInputPolyDataTypes<PipelineFunctor>
  ::PixelTypes<uint8_t, float>("input-polydata", pipeline);
}

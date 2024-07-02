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
#include "itkTransformFileReader.h"
#include "itkTransformFileWriter.h"
#include "itkTestingMacros.h"
#include "itkHDF5TransformIOFactory.h"

#include "itkTransformToWasmTransformFilter.h"
#include "itkWasmTransformToTransformFilter.h"

int
itkWasmTransformInterfaceTest(int argc, char * argv[])
{
  if (argc < 3)
  {
    std::cerr << "Missing parameters" << std::endl;
    std::cerr << "Usage: " << itkNameOfTestExecutableMacro(argv) << " InputTransform OutputTransform" << std::endl;
    return EXIT_FAILURE;
  }
  const char * inputTransformFile = argv[1];
  const char * outputTransformFile = argv[2];

  itk::HDF5TransformIOFactory::RegisterOneFactory();

  constexpr unsigned int Dimension = 3;
  using ParametersValueType = double;
  using TransformType = itk::AffineTransform<ParametersValueType, Dimension>;
  using TransformPointer = TransformType::Pointer;

  using ReaderType = itk::TransformFileReaderTemplate<ParametersValueType>;
  auto reader = ReaderType::New();
  reader->SetFileName(inputTransformFile);
  ITK_TRY_EXPECT_NO_EXCEPTION(reader->Update());
  auto inputTransforms = reader->GetTransformList();
  std::cout << "inputTransform: " << inputTransforms->front() << std::endl;

  using TransformToWasmTransformFilterType = itk::TransformToWasmTransformFilter<TransformType>;
  auto transformToJSONFilter = TransformToWasmTransformFilterType::New();
  transformToJSONFilter->SetTransform(static_cast<const TransformType *>(inputTransforms->front().GetPointer()));
  ITK_TRY_EXPECT_NO_EXCEPTION(transformToJSONFilter->Update());
  auto transformJSON = transformToJSONFilter->GetOutput();
  std::cout << "Transform JSON: " << transformJSON->GetJSON() << std::endl;

  using WasmTransformToTransformFilterType = itk::WasmTransformToTransformFilter<TransformType>;
  auto jsonToTransformFilter = WasmTransformToTransformFilterType::New();
  jsonToTransformFilter->SetInput(transformJSON);
  ITK_TRY_EXPECT_NO_EXCEPTION(jsonToTransformFilter->Update());
  TransformType::Pointer convertedTransform = jsonToTransformFilter->GetOutput();
  std::cout << "convertedTransform: " << convertedTransform << std::endl;

  using WriterType = itk::TransformFileWriterTemplate<ParametersValueType>;
  auto writer = WriterType::New();
  writer->SetFileName(outputTransformFile);
  writer->SetInput(convertedTransform);
  ITK_TRY_EXPECT_NO_EXCEPTION(writer->Update());

  const auto numFixedParams = convertedTransform->GetFixedParameters().Size();
  const auto numParams = convertedTransform->GetParameters().Size();
  const auto numFixedParamsInput = inputTransforms->front()->GetFixedParameters().Size();
  const auto numParamsInput = inputTransforms->front()->GetParameters().Size();
  ITK_TEST_EXPECT_EQUAL(numFixedParams, numFixedParamsInput);
  ITK_TEST_EXPECT_EQUAL(numParams, numParamsInput);
  for (unsigned int i = 0; i < numFixedParams; ++i)
  {
    ITK_TEST_EXPECT_EQUAL(convertedTransform->GetFixedParameters()[i], inputTransforms->front()->GetFixedParameters()[i]);
  }
  for (unsigned int i = 0; i < numParams; ++i)
  {
    ITK_TEST_EXPECT_EQUAL(convertedTransform->GetParameters()[i], inputTransforms->front()->GetParameters()[i]);
  }

  return EXIT_SUCCESS;
}

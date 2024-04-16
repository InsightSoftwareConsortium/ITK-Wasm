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
#include "itkWasmTransformIOFactory.h"
#include "itkWasmTransformIO.h"
#include "itkTransformFileReader.h"
#include "itkTransformFileWriter.h"
#include "itkTestingMacros.h"
#include "itkTransform.h"
#include "itkHDF5TransformIOFactory.h"

int itkWasmTransformIOTest(int argc, char *argv[])
{
  if (argc < 6)
  {
    std::cerr << "Missing parameters" << std::endl;
    std::cerr << "Usage: " << itkNameOfTestExecutableMacro(argv) << " InputTransform TransformDirectory ConvertedDirectory TransformZip ConvertedZip" << std::endl;
    return EXIT_FAILURE;
  }
  const char *inputTransformFile = argv[1];
  const char *transformDirectory = argv[2];
  const char *convertedDirectoryFile = argv[3];
  const char *transformCbor = argv[4];
  const char *convertedCbor = argv[5];

  itk::WasmTransformIOFactory::RegisterOneFactory();
  itk::HDF5TransformIOFactory::RegisterOneFactory();

  constexpr unsigned int Dimension = 3;
  using ParametersValueType = double;
  using TransformType = itk::Transform<ParametersValueType, Dimension>;
  using TransformPointer = TransformType::Pointer;

  using ReaderType = itk::TransformFileReaderTemplate<ParametersValueType>;
  auto transformReader = ReaderType::New();
  // LinearTransform.h5
  transformReader->SetFileName(inputTransformFile);
  ITK_TRY_EXPECT_NO_EXCEPTION(transformReader->Update());
  auto inputTransforms = transformReader->GetTransformList();

  using WasmTransformIOType = itk::WasmTransformIOTemplate<ParametersValueType>;
  auto transformIO = WasmTransformIOType::New();

  using WriterType = itk::TransformFileWriterTemplate<ParametersValueType>;
  auto wasmWriter = WriterType::New();
  // wasmWriter->SetTransformIO( transformIO );
  // itkWasmTransformIOTest.iwt
  wasmWriter->SetFileName(transformDirectory);
  for (auto transform : *inputTransforms)
  {
    std::cout << "Input back transform:" << std::endl;
    transform->Print(std::cout);
    wasmWriter->AddTransform(transform);
  }

  ITK_TRY_EXPECT_NO_EXCEPTION(wasmWriter->Update());

  auto wasmReader = ReaderType::New();
  // wasmReader->SetTransformIO( transformIO );
  // itkWasmTransformIOTest.iwt
  wasmReader->SetFileName(transformDirectory);
  ITK_TRY_EXPECT_NO_EXCEPTION(wasmReader->Update());
  auto inputTransformsBack = wasmReader->GetTransformList();

  auto transformWriter = WriterType::New();
  for (auto [transformIt, inputTransformIt] = std::tuple{ inputTransformsBack->begin(), inputTransforms->begin() };
       transformIt != inputTransformsBack->end();
       ++transformIt, ++inputTransformIt)
  {
    std::cout << "Read back transform:" << std::endl;
    (*transformIt)->Print(std::cout);

    const auto numFixedParams = (*transformIt)->GetFixedParameters().Size();
    const auto numParams = (*transformIt)->GetParameters().Size();
    const auto numFixedParamsInput = (*inputTransformIt)->GetFixedParameters().Size();
    const auto numParamsInput = (*inputTransformIt)->GetParameters().Size();
    ITK_TEST_EXPECT_EQUAL(numFixedParams, numFixedParamsInput);
    ITK_TEST_EXPECT_EQUAL(numParams, numParamsInput);
    for (unsigned int i = 0; i < numFixedParams; ++i)
    {
      ITK_TEST_EXPECT_EQUAL((*transformIt)->GetFixedParameters()[i], (*inputTransformIt)->GetFixedParameters()[i]);
    }
    for (unsigned int i = 0; i < numParams; ++i)
    {
      ITK_TEST_EXPECT_EQUAL((*transformIt)->GetParameters()[i], (*inputTransformIt)->GetParameters()[i]);
    }

    transformWriter->AddTransform(*transformIt);
  }
  // itkWasmTransformIOTest.h5
  transformWriter->SetFileName(convertedDirectoryFile);
  ITK_TRY_EXPECT_NO_EXCEPTION(transformWriter->Update());

  wasmWriter->SetFileName(transformCbor);
  ITK_TRY_EXPECT_NO_EXCEPTION(wasmWriter->Update());

  wasmReader->SetFileName(transformCbor);
  ITK_TRY_EXPECT_NO_EXCEPTION(wasmReader->Update());

  auto inputTransformsBackCbor = wasmReader->GetTransformList();
  auto transformWriterBack = WriterType::New();
  for (auto [transformIt, inputTransformIt] = std::tuple{ inputTransformsBackCbor->begin(), inputTransforms->begin() };
       transformIt != inputTransformsBackCbor->end();
       ++transformIt, ++inputTransformIt)
  {
    std::cout << "Read back cbor transform:" << std::endl;
    (*transformIt)->Print(std::cout);

    const auto numFixedParams = (*transformIt)->GetFixedParameters().Size();
    const auto numParams = (*transformIt)->GetParameters().Size();
    const auto numFixedParamsInput = (*inputTransformIt)->GetFixedParameters().Size();
    const auto numParamsInput = (*inputTransformIt)->GetParameters().Size();
    ITK_TEST_EXPECT_EQUAL(numFixedParams, numFixedParamsInput);
    ITK_TEST_EXPECT_EQUAL(numParams, numParamsInput);
    for (unsigned int i = 0; i < numFixedParams; ++i)
    {
      ITK_TEST_EXPECT_EQUAL((*transformIt)->GetFixedParameters()[i], (*inputTransformIt)->GetFixedParameters()[i]);
    }
    for (unsigned int i = 0; i < numParams; ++i)
    {
      ITK_TEST_EXPECT_EQUAL((*transformIt)->GetParameters()[i], (*inputTransformIt)->GetParameters()[i]);
    }

    transformWriterBack->AddTransform(*transformIt);
  }

  transformWriterBack->SetFileName(convertedCbor);
  ITK_TRY_EXPECT_NO_EXCEPTION(transformWriterBack->Update());

  return EXIT_SUCCESS;
}

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
#include "itkTestingMacros.h"
#include "itkPipeline.h"
#include <vector>
#include "itkImage.h"
#include "itkInputImage.h"
#include "itkOutputImage.h"
#include "itkInputTextStream.h"
#include "itkOutputTextStream.h"
#include "itkInputBinaryStream.h"
#include "itkOutputBinaryStream.h"
#include "itkInputMesh.h"
#include "itkOutputMesh.h"
#include "itkMesh.h"
#include "itkPolyData.h"
#include "itkInputPolyData.h"
#include "itkOutputPolyData.h"
#include "itkInputTransform.h"
#include "itkAffineTransform.h"
#include "itkHDF5TransformIOFactory.h"
#include "itkOutputTransform.h"
#include "itkCompositeTransform.h"
#include "itkInputPointSet.h"
#include "itkOutputPointSet.h"
#include "itkPointSet.h"

int
itkPipelineTest(int argc, char * argv[])
{
  itk::HDF5TransformIOFactory::RegisterOneFactory();

  itk::wasm::Pipeline pipeline("pipeline-test", "A test ITK Wasm Pipeline", argc, argv);
  pipeline.set_version("10.8.1");

  std::string example_string_option = "default";
  pipeline.add_option("-s,--string", example_string_option, "A help string");

  int example_int_option = 3;
  pipeline.add_option("-i,--int", example_int_option, "Example int option");

  double example_double_option = 3.5;
  pipeline.add_option("-d,--double", example_double_option, "Example double option");

  std::vector<double> example_vector_double_option = {3.5, 8.8};
  pipeline.add_option("-v,--vector", example_vector_double_option, "Example double vector option");

  bool flag = false;
  pipeline.add_flag("-f,--flag", flag, "A flag");

  constexpr unsigned int Dimension = 2;
  using PixelType = float;
  using ImageType = itk::Image<PixelType, Dimension>;
  using MeshType = itk::Mesh<PixelType, 3>;
  using PointSetType = itk::PointSet<PixelType, 3>;
  using PolyDataType = itk::PolyData<PixelType>;
  using TransformType = itk::AffineTransform<double, 3>;
  using CompositeTransformType = itk::CompositeTransform<double, 2>;

  using InputImageType = itk::wasm::InputImage<ImageType>;
  InputImageType inputImage;
  pipeline.add_option("input-image", inputImage, "The input image")->required()->type_name("INPUT_IMAGE");

  using OutputImageType = itk::wasm::OutputImage<ImageType>;
  OutputImageType outputImage;
  pipeline.add_option("output-image", outputImage, "The output image")->required()->type_name("OUTPUT_IMAGE");

  itk::wasm::InputTextStream inputTextStream;
  pipeline.add_option("input-text", inputTextStream, "The input text")->required()->type_name("INPUT_TEXT_STREAM");

  itk::wasm::OutputTextStream outputTextStream;
  pipeline.add_option("output-text", outputTextStream, "The output text")->required()->type_name("OUTPUT_TEXT_STREAM");

  itk::wasm::InputBinaryStream inputBinaryStream;
  pipeline.add_option("input-binary", inputBinaryStream, "The input text")->required()->type_name("INPUT_BINARY_STREAM");

  using InputImageType = itk::wasm::InputImage<ImageType>;
  itk::wasm::OutputBinaryStream outputBinaryStream;
  pipeline.add_option("output-binary", outputBinaryStream, "The output binary")->required()->type_name("OUTPUT_BINARY_STREAM");

  using InputMeshType = itk::wasm::InputMesh<MeshType>;
  InputMeshType inputMesh;
  pipeline.add_option("input-mesh", inputMesh, "The input mesh")->required()->type_name("INPUT_MESH");

  using OutputMeshType = itk::wasm::OutputMesh<MeshType>;
  OutputMeshType outputMesh;
  pipeline.add_option("output-mesh", outputMesh, "The output mesh")->required()->type_name("OUTPUT_MESH");

  using InputPolyDataType = itk::wasm::InputPolyData<PolyDataType>;
  InputPolyDataType inputPolyData;
  pipeline.add_option("input-polydata", inputPolyData, "The input polydata")->required()->type_name("INPUT_POLYDATA");

  using OutputPolyDataType = itk::wasm::OutputPolyData<PolyDataType>;
  OutputPolyDataType outputPolyData;
  pipeline.add_option("output-polydata", outputPolyData, "The output polydata")->required()->type_name("OUTPUT_POLYDATA");

  using InputTransformType = itk::wasm::InputTransform<TransformType>;
  InputTransformType inputTransform;
  pipeline.add_option("input-transform", inputTransform, "The input transform")->required()->type_name("INPUT_TRANSFORM");

  using OutputTransformType = itk::wasm::OutputTransform<TransformType>;
  OutputTransformType outputTransform;
  pipeline.add_option("output-transform", outputTransform, "The output transform")->required()->type_name("OUTPUT_TRANSFORM");

  using InputCompositeTransformType = itk::wasm::InputTransform<CompositeTransformType>;
  InputCompositeTransformType inputCompositeTransform;
  pipeline.add_option("input-composite-transform", inputCompositeTransform, "The input composite transform")->required()->type_name("INPUT_TRANSFORM");

  using OutputCompositeTransformType = itk::wasm::OutputTransform<CompositeTransformType>;
  OutputCompositeTransformType outputCompositeTransform;
  pipeline.add_option("output-composite-transform", outputCompositeTransform, "The output composite transform")->required()->type_name("OUTPUT_TRANSFORM");

  using InputPointSetType = itk::wasm::InputPointSet<PointSetType>;
  InputPointSetType inputPointSet;
  pipeline.add_option("input-point-set", inputPointSet, "The input point-set")->required()->type_name("INPUT_POINTSET");

  using OutputPointSetType = itk::wasm::OutputPointSet<PointSetType>;
  OutputPointSetType outputPointSet;
  pipeline.add_option("output-point-set", outputPointSet, "The output point-set")->required()->type_name("OUTPUT_POINTSET");

  ITK_WASM_PARSE(pipeline);

  outputImage.Set(inputImage.Get());

  const std::string inputTextStreamContent{ std::istreambuf_iterator<char>(inputTextStream.Get()),
                                            std::istreambuf_iterator<char>() };
  ITK_TEST_EXPECT_TRUE(inputTextStreamContent == "test 123\n");

  outputTextStream.Get() << inputTextStreamContent;

  const std::string inputBinaryStreamContent{ std::istreambuf_iterator<char>(inputBinaryStream.Get()),
                                            std::istreambuf_iterator<char>() };
  ITK_TEST_EXPECT_TRUE(inputBinaryStreamContent == "test 123\n");

  outputBinaryStream.Get() << inputBinaryStreamContent;

  outputMesh.Set(inputMesh.Get());
  outputPointSet.Set(inputPointSet.Get());

  outputPolyData.Set(inputPolyData.Get());

  outputTransform.Set(inputTransform.Get());
  outputCompositeTransform.Set(inputCompositeTransform.Get());

  return EXIT_SUCCESS;
}

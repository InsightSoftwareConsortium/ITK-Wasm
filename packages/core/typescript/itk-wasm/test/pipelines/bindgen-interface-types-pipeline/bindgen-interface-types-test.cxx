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
#include "itkInputTextStream.h"
#include "itkOutputTextStream.h"
#include "itkInputBinaryStream.h"
#include "itkOutputBinaryStream.h"
#include "itkMesh.h"
#include "itkInputMesh.h"
#include "itkOutputMesh.h"
#include "itkInputImage.h"
#include "itkOutputImage.h"

int main( int argc, char * argv[] )
{
  itk::wasm::Pipeline pipeline("bindgen-interface-types-test", "A test to exercise interface types for bindgen", argc, argv);

  using PixelType = unsigned char;
  constexpr unsigned int Dimension = 3;

  std::string inputTextFile;
  pipeline.add_option("input-text-file", inputTextFile, "The input text file")->required()->group("Files")->type_name("INPUT_TEXT_FILE");

  std::string inputBinaryFile;
  pipeline.add_option("input-binary-file", inputBinaryFile, "The input binary file")->required()->group("Files")->type_name("INPUT_BINARY_FILE");

  itk::wasm::InputTextStream inputTextStream;
  pipeline.add_option("input-text-stream", inputTextStream, "The input text stream")->group("Streams")->type_name("INPUT_TEXT_STREAM");

  itk::wasm::InputBinaryStream inputBinaryStream;
  pipeline.add_option("input-binary-stream", inputBinaryStream, "The input binary stream")->group("Streams")->type_name("INPUT_BINARY_STREAM");

  itk::wasm::InputTextStream inputJson;
  pipeline.add_option("input-json", inputJson, "The input json")->type_name("INPUT_JSON");

  using ImageType = itk::Image< PixelType, 2 >;

  using InputImageType = itk::wasm::InputImage<ImageType>;
  InputImageType inputImage;
  pipeline.add_option("input-image", inputImage, "The input image")->required()->group("Images")->type_name("INPUT_IMAGE");

  using MeshType = itk::Mesh< PixelType, Dimension >;

  using InputMeshType = itk::wasm::InputMesh<MeshType>;
  InputMeshType inputMesh;
  pipeline.add_option("input-mesh", inputMesh, "The input mesh")->required()->group("Meshes")->type_name("INPUT_MESH");

  int integerType = 3;
  pipeline.add_option("-i,--integer-type", integerType, "An integer type.");

  double floatingType = 2.0;
  pipeline.add_option("-f,--floating-type", floatingType, "A floating type.");

  double floatingRange = 2.0;
  pipeline.add_option("--floating-range", floatingRange, "A floating type with a range check.")->check(CLI::Range(1.0, 3.0));

  std::vector<double> floatingVector = { 7.0 };
  pipeline.add_option("--floating-vector", floatingVector, "A floating vector.");

  std::vector<double> floatingTypeSize = { 7.0, 8.0 };
  pipeline.add_option("--floating-type-size", floatingTypeSize, "A floating vector with a type size constraint.")->type_size(2);

  std::vector<double> floatingTypeSizeRange = { 7.0, 8.0, 9.0 };
  pipeline.add_option("--floating-type-size-range", floatingTypeSizeRange, "A floating vector with a type size range constraint.")->type_size(2, 3);

  std::string outputTextFile;
  pipeline.add_option("output-text-file", outputTextFile, "The output text file")->required()->group("Files")->type_name("OUTPUT_TEXT_FILE");

  std::string outputBinaryFile;
  pipeline.add_option("output-binary-file", outputBinaryFile, "The output binary file")->required()->group("Files")->type_name("OUTPUT_BINARY_FILE");

  itk::wasm::OutputTextStream outputTextStream;
  pipeline.add_option("output-text-stream", outputTextStream, "The output text stream")->group("Streams")->type_name("OUTPUT_TEXT_STREAM");

  itk::wasm::OutputBinaryStream outputBinaryStream;
  pipeline.add_option("output-binary-stream", outputBinaryStream, "The output binary stream")->group("Streams")->type_name("OUTPUT_BINARY_STREAM");

  itk::wasm::OutputTextStream outputJson;
  pipeline.add_option("output-json", outputJson, "The output json")->type_name("OUTPUT_JSON");

  using OutputImageType = itk::wasm::OutputImage<ImageType>;
  OutputImageType outputImage;
  pipeline.add_option("output-image", outputImage, "The output image")->required()->group("Images")->type_name("OUTPUT_IMAGE");

  using OutputMeshType = itk::wasm::OutputMesh<MeshType>;
  OutputMeshType outputMesh;
  pipeline.add_option("output-mesh", outputMesh, "The output mesh")->required()->group("Meshes")->type_name("OUTPUT_MESH");

  ITK_WASM_PARSE(pipeline);

  const size_t bufferLength = 2048;
  char * buffer = new char[bufferLength];
  size_t readLength = 0;

  std::ifstream inputTxtFile( inputTextFile, std::ifstream::in );
  if(!inputTxtFile.is_open())
    {
    std::cerr << "Could not open inputTextFile." << std::endl;
    delete[] buffer;
    return EXIT_FAILURE;
    }
  inputTxtFile.read( buffer, bufferLength );
  readLength = inputTxtFile.gcount();
  inputTxtFile.close();
  buffer[readLength] = '\0';

  std::ofstream outputFileTxt( outputTextFile, std::ofstream::out );
  if( !outputFileTxt.is_open() )
    {
    std::cerr << "Could not open outputTxtFile." << std::endl;
    delete[] buffer;
    return EXIT_FAILURE;
    }
  outputFileTxt.write( buffer, readLength );
  outputFileTxt.close();

  std::ifstream inputBinFile( inputBinaryFile, std::ifstream::in | std::ifstream::binary );
  if( !inputBinFile.is_open() )
    {
    std::cerr << "Could not open inputBinFile." << std::endl;
    delete[] buffer;
    return EXIT_FAILURE;
    }
  inputBinFile.read( buffer, bufferLength );
  readLength = inputBinFile.gcount();
  inputBinFile.close();

  std::ofstream outputBinFile( outputBinaryFile, std::ofstream::out | std::ofstream::binary );
  if( !outputBinFile.is_open() )
    {
    std::cerr << "Could not open outputBinFile." << std::endl;
    delete[] buffer;
    return EXIT_FAILURE;
    }
  outputBinFile.write( buffer, readLength );
  outputBinFile.close();

  std::istream & inputTxtStream = inputTextStream.Get();
  inputTxtStream.read( buffer, bufferLength );
  readLength = inputTxtStream.gcount();
  buffer[readLength] = '\0';

  outputTextStream.Get().write( buffer, readLength );

  inputBinaryStream.Get().read( buffer, bufferLength );
  readLength = inputBinaryStream.Get().gcount();

  outputBinaryStream.Get().write( buffer, readLength );

  std::istream & inputTxtJson = inputJson.Get();
  inputTxtJson.read( buffer, bufferLength );
  readLength = inputTxtJson.gcount();
  buffer[readLength] = '\0';

  outputJson.Get().write( buffer, readLength );

  outputImage.Set(inputImage.Get());

  outputMesh.Set(inputMesh.Get());

  delete[] buffer;

  return EXIT_SUCCESS;
}

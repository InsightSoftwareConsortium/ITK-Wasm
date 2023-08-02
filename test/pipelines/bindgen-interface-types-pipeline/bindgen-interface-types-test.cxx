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

int main( int argc, char * argv[] )
{
  itk::wasm::Pipeline pipeline("bindgen-interface-types-test", "A test to exercise interface types for bindgen", argc, argv);

  using PixelType = float;
  constexpr unsigned int Dimension = 3;

  std::string inputTextFile;
  pipeline.add_option("input-text-file", inputTextFile, "The input text file")->required()->group("Files")->type_name("INPUT_TEXT_FILE");

  std::string inputBinaryFile;
  pipeline.add_option("input-binary-file", inputBinaryFile, "The input binary file")->required()->group("Files")->type_name("INPUT_BINARY_FILE");

  using MeshType = itk::Mesh< PixelType, Dimension >;

  using InputMeshType = itk::wasm::InputMesh<MeshType>;
  InputMeshType inputMesh;
  pipeline.add_option("input-mesh", inputMesh, "The input mesh")->required()->group("Meshes")->type_name("INPUT_MESH");

  std::string outputTextFile;
  pipeline.add_option("output-text-file", outputTextFile, "The output text file")->required()->group("Files")->type_name("OUTPUT_TEXT_FILE");

  std::string outputBinaryFile;
  pipeline.add_option("output-binary-file", outputBinaryFile, "The output binary file")->required()->group("Files")->type_name("OUTPUT_BINARY_FILE");

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

  outputMesh.Set(inputMesh.Get());

  delete[] buffer;

  return EXIT_SUCCESS;
}

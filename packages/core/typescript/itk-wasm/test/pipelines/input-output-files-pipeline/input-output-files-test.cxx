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
#include <fstream>
#include <iostream>
#include <iomanip>

int main( int argc, char * argv[] )
{
  itk::wasm::Pipeline pipeline("input-output-files-test", "A pipeline to test general binary and text IO", argc, argv);

  bool useFiles = false;
  pipeline.add_flag("-f,--use-files", useFiles, "Use files -- otherwise use stream objects");


  itk::wasm::InputTextStream inputTextStream;
  pipeline.add_option("--input-text-stream", inputTextStream, "The input text stream")->group("Streams")->type_name("INPUT_TEXT_STREAM");

  itk::wasm::OutputTextStream outputTextStream;
  pipeline.add_option("output-text-stream", outputTextStream, "The output text stream")->group("Streams")->type_name("OUTPUT_TEXT_STREAM");

  itk::wasm::InputBinaryStream inputBinaryStream;
  pipeline.add_option("--input-binary-stream", inputBinaryStream, "The input binary stream")->group("Streams")->type_name("INPUT_BINARY_STREAM");

  itk::wasm::OutputBinaryStream outputBinaryStream;
  pipeline.add_option("output-binary-stream", outputBinaryStream, "The output binary stream")->group("Streams")->type_name("OUTPUT_BINARY_STREAM");


  std::string inputTextFile;
  pipeline.add_option("--input-text-file", inputTextFile, "The input text file")->group("Files")->type_name("INPUT_TEXT_FILE");

  std::string outputTextFile;
  pipeline.add_option("output-text-file", outputTextFile, "The output text file")->group("Files")->type_name("OUTPUT_TEXT_FILE");

  std::string inputBinaryFile;
  pipeline.add_option("--input-binary-file", inputBinaryFile, "The input binary file")->group("Files")->type_name("INPUT_BINARY_FILE");

  std::string outputBinaryFile;
  pipeline.add_option("output-binary-file", outputBinaryFile, "The output binary file")->group("Files")->type_name("OUTPUT_BINARY_FILE");


  ITK_WASM_PARSE(pipeline);

  const size_t bufferLength = 2048;
  char * buffer = new char[bufferLength];
  size_t readLength = 0;

  if (useFiles)
  {
    std::ifstream inputTxt( inputTextFile, std::ifstream::in );
    if( !inputTxt.is_open() )
      {
      std::cerr << "Could not open inputTextFile." << std::endl;
      delete[] buffer;
      return EXIT_FAILURE;
      }
    inputTxt.read( buffer, bufferLength );
    readLength = inputTxt.gcount();
    inputTxt.close();
    buffer[readLength] = '\0';
  }
  else
  {
    std::istream & inputTxt = inputTextStream.Get();
    inputTxt.read( buffer, bufferLength );
    readLength = inputTxt.gcount();
    buffer[readLength] = '\0';
  }

  std::cout << "Input text: " << buffer << std::endl;


  if (useFiles)
  {
    std::ofstream outputTxt( outputTextFile, std::ofstream::out );
    if( !outputTxt.is_open() )
      {
      std::cerr << "Could not open outputTxtFile." << std::endl;
      delete[] buffer;
      return EXIT_FAILURE;
      }
    outputTxt.write( buffer, readLength );
    outputTxt.close();
  }
  else
  {
    outputTextStream.Get().write( buffer, readLength );
  }


  if (useFiles)
  {
    std::ifstream inputBin( inputBinaryFile, std::ifstream::in | std::ifstream::binary );
    if( !inputBin.is_open() )
      {
      std::cerr << "Could not open inputBinFile." << std::endl;
      delete[] buffer;
      return EXIT_FAILURE;
      }
    inputBin.read( buffer, bufferLength );
    readLength = inputBin.gcount();
    inputBin.close();
  }
  else
  {
    inputBinaryStream.Get().read( buffer, bufferLength );
    readLength = inputBinaryStream.Get().gcount();
  }

  std::cerr << "Input binary: ";
  for( size_t ii = 0; ii < readLength; ++ii )
    {
    std::cerr << std::hex << std::setfill('0') << std::setw(2) << int(buffer[ii]);
    }
  std::cerr << std::endl;


  if (useFiles)
  {
    std::ofstream outputBin( outputBinaryFile, std::ofstream::out | std::ofstream::binary );
    if( !outputBin.is_open() )
      {
      std::cerr << "Could not open outputBinFile." << std::endl;
      delete[] buffer;
      return EXIT_FAILURE;
      }
    outputBin.write( buffer, readLength );
    outputBin.close();
  }
  else
  {
    outputBinaryStream.Get().write( buffer, readLength );
  }

  delete[] buffer;
  return EXIT_SUCCESS;
}

#include <fstream>
#include <iostream>
#include <iomanip>

int main( int argc, char * argv[] )
{
  if( argc < 5 )
    {
    std::cerr << argv[0] << " <input.txt> <input.bin> <output.txt> <output.bin>" << std::endl;
    return 1;
    }
  const char * inputTxtFile = argv[1];
  const char * inputBinFile = argv[2];
  const char * outputTxtFile = argv[3];
  const char * outputBinFile = argv[4];


  const size_t bufferLength = 2048;
  char * buffer = new char[bufferLength];


  std::ifstream inputTxt( inputTxtFile, std::ifstream::in );
  if( !inputTxt.is_open() )
    {
    std::cerr << "Could not open inputTxtFile." << std::endl;
    delete[] buffer;
    return 1;
    }
  inputTxt.read( buffer, bufferLength );
  size_t readLength = inputTxt.gcount();
  inputTxt.close();
  buffer[readLength] = '\0';


  std::cout << "Input text: " << buffer << std::endl;


  std::ofstream outputTxt( outputTxtFile, std::ofstream::out );
  if( !outputTxt.is_open() )
    {
    std::cerr << "Could not open outputTxtFile." << std::endl;
    delete[] buffer;
    return 1;
    }
  outputTxt.write( buffer, readLength );
  outputTxt.close();


  std::ifstream inputBin( inputBinFile, std::ifstream::in | std::ifstream::binary );
  if( !inputBin.is_open() )
    {
    std::cerr << "Could not open inputBinFile." << std::endl;
    delete[] buffer;
    return 1;
    }
  inputBin.read( buffer, bufferLength );
  readLength = inputBin.gcount();
  inputBin.close();

  std::cerr << "Input binary: ";
  for( size_t ii = 0; ii < readLength; ++ii )
    {
    std::cerr << std::hex << std::setfill('0') << std::setw(2) << int(buffer[ii]);
    }
  std::cerr << std::endl;

  std::ofstream outputBin( outputBinFile, std::ofstream::out | std::ofstream::binary );
  if( !outputBin.is_open() )
    {
    std::cerr << "Could not open outputBinFile." << std::endl;
    delete[] buffer;
    return 1;
    }
  outputBin.write( buffer, readLength );
  outputBin.close();


  delete[] buffer;
  return 0;
}

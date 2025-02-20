#include <iostream>

#include "itkPipeline.h"

int main(int argc, char* argv[]) {
  itk::wasm::Pipeline pipeline("hello-world", "Hello world example", argc, argv);

  std::cout << "Hello Wasm world!" << std::endl;
  return 0;
}

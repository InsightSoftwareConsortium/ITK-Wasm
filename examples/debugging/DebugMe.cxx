#include <iostream>

int main() {
  std::cout << "Hello debugger world!" << std::endl;

  const char * wasmDetails = "are no longer hidden";

  const int a = 1;
  const int b = 2;
  const auto c = a + b;

  // Simulate a crash.
  abort();
  return 0;
}
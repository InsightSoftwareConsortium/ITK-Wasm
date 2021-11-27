cmake_minimum_required(VERSION 3.10)
project(StdoutStderrTest)

find_package(ITK REQUIRED
  COMPONENTS WebAssemblyInterface)
add_executable(StdoutStderrTest StdoutStderrTest.cxx)
target_link_libraries(StdoutStderrTest PUBLIC WebAssemblyInterface)

enable_testing()
add_test(NAME StdoutStderrTest
  COMMAND StdoutStderrTest
  )

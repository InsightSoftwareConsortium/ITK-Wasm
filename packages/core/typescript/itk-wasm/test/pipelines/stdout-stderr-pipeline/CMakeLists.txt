cmake_minimum_required(VERSION 3.10)
project(stdout-stderr-test)

find_package(ITK REQUIRED
  COMPONENTS WebAssemblyInterface)
include(${ITK_USE_FILE})
add_executable(stdout-stderr-test stdout-stderr-test.cxx)
target_link_libraries(stdout-stderr-test PUBLIC WebAssemblyInterface)

enable_testing()
add_test(NAME stdout-stderr-test
  COMMAND stdout-stderr-test
  )

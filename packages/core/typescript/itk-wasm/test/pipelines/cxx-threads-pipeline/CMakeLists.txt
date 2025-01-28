cmake_minimum_required(VERSION 3.16)
project(cxx-threads-test)

set(CMAKE_CXX_STANDARD 20)

find_package(ITK REQUIRED
  COMPONENTS WebAssemblyInterface)
include(${ITK_USE_FILE})
add_executable(cxx-threads-test cxx-threads-test.cxx)
target_link_libraries(cxx-threads-test PUBLIC WebAssemblyInterface)

enable_testing()
add_test(NAME CjXThreadsTest
  COMMAND cxx-threads-test
    ${CMAKE_CURRENT_BINARY_DIR}/cxx-threads-test-output.json
  )

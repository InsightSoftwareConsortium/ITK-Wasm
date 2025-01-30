cmake_minimum_required(VERSION 3.16)
project(pthreads-test)

set(CMAKE_CXX_STANDARD 20)

find_package(ITK REQUIRED
  COMPONENTS WebAssemblyInterface)
include(${ITK_USE_FILE})
add_executable(pthreads-test pthreads-test.cxx)
target_link_libraries(pthreads-test PUBLIC WebAssemblyInterface)

enable_testing()
add_test(NAME PThreadsTest
  COMMAND pthreads-test
    ${CMAKE_CURRENT_BINARY_DIR}/pthreads-test-output.json
  )

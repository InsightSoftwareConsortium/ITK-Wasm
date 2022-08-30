cmake_minimum_required(VERSION 3.10)
project(mesh-read-write-test)

set(CMAKE_CXX_STANDARD 17)

set(io_components)
if(NOT EMSCRIPTEN)
  set(io_components ITKMeshIO)
endif()
find_package(ITK REQUIRED
  COMPONENTS
    ${io_components}
    WebAssemblyInterface
  )
include(${ITK_USE_FILE})

add_executable(mesh-read-write-test mesh-read-write-test.cxx)
target_link_libraries(mesh-read-write-test PUBLIC ${ITK_LIBRARIES})

enable_testing()
add_test(NAME mesh-read-write-test
  COMMAND mesh-read-write-test ${CMAKE_CURRENT_SOURCE_DIR}/cow.vtk
  ${CMAKE_CURRENT_BINARY_DIR}/cow.written.vtk
  )

add_test(NAME MeshReadWriteWASMTest
  COMMAND mesh-read-write-test ${CMAKE_CURRENT_SOURCE_DIR}/cow.vtk
  ${CMAKE_CURRENT_BINARY_DIR}/cow.iwm
  )

add_test(NAME MeshReadWriteWASMCBORTest
  COMMAND mesh-read-write-test ${CMAKE_CURRENT_SOURCE_DIR}/cow.vtk
  ${CMAKE_CURRENT_BINARY_DIR}/cow.iwm.cbor
  )

add_test(NAME MeshReadWriteWASMInputTest
  COMMAND mesh-read-write-test ${CMAKE_CURRENT_BINARY_DIR}/cow.iwm
  ${CMAKE_CURRENT_BINARY_DIR}/cow.out.iwm
  )

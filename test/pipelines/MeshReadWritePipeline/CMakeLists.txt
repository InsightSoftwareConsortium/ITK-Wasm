cmake_minimum_required(VERSION 3.10)
project(MeshReadWriteTest)

find_package(ITK REQUIRED
  COMPONENTS ITKMeshIO
    ITKIOMeshBase
    WebAssemblyInterface
  )
include(${ITK_USE_FILE})

add_executable(MeshReadWriteTest MeshReadWriteTest.cxx)
target_link_libraries(MeshReadWriteTest PUBLIC ${ITK_LIBRARIES})

enable_testing()
add_test(NAME MeshReadWriteTest
  COMMAND MeshReadWriteTest ${CMAKE_CURRENT_SOURCE_DIR}/cow.vtk
  ${CMAKE_CURRENT_BINARY_DIR}/cow.written.vtk
  )

add_test(NAME MeshReadWriteWASMTest
  COMMAND MeshReadWriteTest ${CMAKE_CURRENT_SOURCE_DIR}/cow.vtk
  ${CMAKE_CURRENT_BINARY_DIR}/cow.iwm
  )

add_test(NAME MeshReadWriteWASMZipTest
  COMMAND MeshReadWriteTest ${CMAKE_CURRENT_SOURCE_DIR}/cow.vtk
  ${CMAKE_CURRENT_BINARY_DIR}/cow.iwm.zip
  )

add_test(NAME MeshReadWriteWASMInputTest
  COMMAND MeshReadWriteTest ${CMAKE_CURRENT_BINARY_DIR}/cow.iwm
  ${CMAKE_CURRENT_BINARY_DIR}/cow.out.iwm
  )

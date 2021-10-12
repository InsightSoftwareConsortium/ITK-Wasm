cmake_minimum_required(VERSION 3.10)
project(MeshReadWriteTest)

find_package(ITK REQUIRED
  COMPONENTS ITKMeshIO
    ITKIOMeshBase
    BridgeJavaScript
  )
include(${ITK_USE_FILE})

add_executable(MeshReadWriteTest MeshReadWriteTest.cxx)
target_link_libraries(MeshReadWriteTest PUBLIC ${ITK_LIBRARIES})

enable_testing()
add_test(NAME MeshReadWriteTest
  COMMAND MeshReadWriteTest ${CMAKE_CURRENT_SOURCE_DIR}/cow.vtk
  ${CMAKE_CURRENT_BINARY_DIR}/cow.written.vtk
  )

add_test(NAME MeshReadWriteJSONTest
  COMMAND MeshReadWriteTest ${CMAKE_CURRENT_SOURCE_DIR}/cow.vtk
  ${CMAKE_CURRENT_BINARY_DIR}/cow.written.vtk.json
  )

add_test(NAME MeshReadWriteJSONInputTest
  COMMAND MeshReadWriteTest ${CMAKE_CURRENT_BINARY_DIR}/cow.written.vtk.json
  ${CMAKE_CURRENT_BINARY_DIR}/cow.written.out.vtk.json
  )

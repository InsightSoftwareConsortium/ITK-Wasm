cmake_minimum_required(VERSION 3.10)
project(MeshReadWrite)

set(io_components ITKMeshIO)
if(EMSCRIPTEN)
  set(io_components BridgeJavaScript)
endif()
find_package(ITK REQUIRED
  COMPONENTS ${io_components}
    ITKIOMeshBase
  )
include(${ITK_USE_FILE})

if(EMSCRIPTEN)
  include(ITKBridgeJavaScript)
  web_add_executable(MeshReadWrite MeshReadWrite.cxx)
  web_target_link_libraries(MeshReadWrite ${ITK_LIBRARIES})
else()
  add_executable(MeshReadWrite MeshReadWrite.cxx)
  target_link_libraries(MeshReadWrite ${ITK_LIBRARIES})
endif()

enable_testing()
add_test(NAME MeshReadWriteTest
  COMMAND MeshReadWrite ${CMAKE_CURRENT_SOURCE_DIR}/cow.vtk
  ${CMAKE_CURRENT_BINARY_DIR}/cow.written.vtk
  )

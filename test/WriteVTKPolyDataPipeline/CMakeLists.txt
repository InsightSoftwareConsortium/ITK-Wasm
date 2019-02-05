cmake_minimum_required(VERSION 3.10)
project(WriteVTKPolyData)

find_package(VTK REQUIRED
  COMPONENTS vtkIOLegacy
    vtkIOExport
  )
include(${VTK_USE_FILE})

if(EMSCRIPTEN)
  include(ITKBridgeJavaScript)
  web_add_executable(WriteVTKPolyData WriteVTKPolyData.cxx)
  web_target_link_libraries(WriteVTKPolyData ${VTK_LIBRARIES})
else()
  add_executable(WriteVTKPolyData WriteVTKPolyData.cxx)
  target_link_libraries(WriteVTKPolyData ${VTK_LIBRARIES})
endif()

enable_testing()
add_test(NAME WriteVTKPolyDataTest
  COMMAND WriteVTKPolyData ${CMAKE_CURRENT_BINARY_DIR}/cow.vtk
  ${CMAKE_CURRENT_BINARY_DIR}/cow.written.vtk.json
  )

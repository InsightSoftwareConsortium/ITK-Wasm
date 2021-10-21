cmake_minimum_required(VERSION 3.10)
project(WriteVTKPolyDataTest)

find_package(VTK REQUIRED
  COMPONENTS IOLegacy
    IOExport
  )

add_executable(WriteVTKPolyDataTest WriteVTKPolyDataTest.cxx)
target_link_libraries(WriteVTKPolyDataTest PUBLIC ${VTK_LIBRARIES})

enable_testing()
add_test(NAME WriteVTKPolyDataTest
  COMMAND WriteVTKPolyDataTest ${CMAKE_CURRENT_BINARY_DIR}/cow.vtk
  ${CMAKE_CURRENT_BINARY_DIR}/cow.written.vtk.json
  )

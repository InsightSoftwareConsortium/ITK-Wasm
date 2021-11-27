cmake_minimum_required(VERSION 3.10)
project(WriteVTKPolyDataTest)

find_package(VTK REQUIRED
  COMPONENTS IOLegacy
    IOExport
  )
find_package(ITK REQUIRED
  COMPONENTS WebAssemblyInterface
  )

add_executable(WriteVTKPolyDataTest WriteVTKPolyDataTest.cxx)
target_link_libraries(WriteVTKPolyDataTest PUBLIC ${VTK_LIBRARIES} WebAssemblyInterface)

enable_testing()
add_test(NAME WriteVTKPolyDataTest
  COMMAND WriteVTKPolyDataTest ${CMAKE_CURRENT_BINARY_DIR}/cow.vtk
  ${CMAKE_CURRENT_BINARY_DIR}/cow.written.vtk.json
  )

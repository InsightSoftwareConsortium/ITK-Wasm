cmake_minimum_required(VERSION 3.10)
project(MeshToPolyData)

find_package(VTK REQUIRED
  COMPONENTS
    vtkIOExport
    vtkFiltersGeometry
  )
include(${VTK_USE_FILE})

set(io_components ITKMeshIO)
if(EMSCRIPTEN)
  set(io_components BridgeJavaScript)
endif()
find_package(ITK REQUIRED
  COMPONENTS
    ITKIOMeshBase
    ITKVtkGlue
    ${io_components}
  )
include(${ITK_USE_FILE})

add_executable(MeshToPolyData MeshToPolyData.cxx)
target_link_libraries(MeshToPolyData ${VTK_LIBRARIES} ${ITK_LIBRARIES})

enable_testing()
add_test(NAME MeshToPolyData
  COMMAND MeshToPolyData ${CMAKE_CURRENT_BINARY_DIR}/cow.vtk
  ${CMAKE_CURRENT_BINARY_DIR}/cow.written.vtk.json
  )

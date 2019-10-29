cmake_minimum_required(VERSION 3.10)
# For testing the VTK pipelines with native binary builds
project(VTKNative)

find_package(VTK REQUIRED
  COMPONENTS vtkIOExport
    vtkIOLegacy
    )
include(${VTK_USE_FILE})

add_executable(VTKLegacyFileReader VTKLegacyFileReader.cxx)
target_link_libraries(VTKLegacyFileReader ${VTK_LIBRARIES})


find_package(VTK REQUIRED
  COMPONENTS vtkIOExport
    vtkIOXML
    )
include(${VTK_USE_FILE})

add_executable(VTKXMLFileReader VTKXMLFileReader.cxx)
target_link_libraries(VTKXMLFileReader ${VTK_LIBRARIES})

cmake_minimum_required(VERSION 2.8.9)
project(BridgeJavaScript)

set(BridgeJavaScript_IOModules
  "ITKIOGDCM"
  "ITKIOMeta"
  "ITKIONRRD"
  "ITKIOPNG"
  "ITKIOTIFF"
  "ITKIOVTK"
  CACHE STRING
  "String delimited list of ITK IO modules to support.")
set(imageio_ITKIOPNG itkPNGImageIO)
set(imageio_ITKIOMeta itkMetaImageIO)
set(imageio_ITKIONRRD itkNrrdImageIO)
set(imageio_ITKIOGDCM itkGDCMImageIO)
set(imageio_ITKIOTIFF itkTIFFImageIO)
set(imageio_ITKIOVTK itkVTKImageIO)


if(NOT ITK_SOURCE_DIR)
  find_package(ITK 4.9 REQUIRED)
  list(APPEND CMAKE_MODULE_PATH ${ITK_CMAKE_DIR})
  set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)
  include(ITKModuleExternal)
else()
  itk_module_impl()
endif()

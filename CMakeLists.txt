cmake_minimum_required(VERSION 3.16.3)
project(WebAssemblyInterface)

set(CMAKE_CXX_STANDARD 17)

set(WebAssemblyInterface_LIBRARIES WebAssemblyInterface)

option(BUILD_ITK_JS_IO_MODULES "Build the itk-wasm ImageIO's and MeshIO's" OFF)
if(BUILD_ITK_JS_IO_MODULES)
  # This list should be ordered from approximately most commonly to least
  # commonly used modules.
  set(WebAssemblyInterface_ImageIOModules
    "ITKIOPNG"
    "ITKIOMeta"
    "ITKIOTIFF"
    "ITKIONIFTI"
    "ITKIOJPEG"
    "ITKIONRRD"
    "ITKIOVTK"
    "ITKIOBMP"
    "ITKIOHDF5"
    "ITKIOMINC"
    "ITKIOMRC"
    "ITKIOLSM"
    "MGHIO"
    "ITKIOBioRad"
    "ITKIOGIPL"
    "ITKIOGE"
    "ITKIOGDCM"
    "IOScanco"
    "IOFDF"
    CACHE STRING
    "String delimited list of ITK image IO modules to support.")
  set(imageios_ITKIOBioRad itkBioRadImageIO)
  set(imageios_ITKIOBMP itkBMPImageIO)
  set(imageios_ITKIOHDF5 itkHDF5ImageIO)
  set(imageios_ITKIOGE itkGEAdwImageIO itkGE4ImageIO itkGE5ImageIO)
  set(imageios_ITKIOGIPL itkGiplImageIO)
  set(imageios_ITKIOPNG itkPNGImageIO)
  set(imageios_ITKIOLSM itkLSMImageIO)
  set(imageios_ITKIOMeta itkMetaImageIO)
  set(imageios_ITKIOMINC itkMINCImageIO)
  set(imageios_MGHIO itkMGHImageIO)
  set(imageios_ITKIOMRC itkMRCImageIO)
  set(imageios_ITKIONIFTI itkNiftiImageIO)
  set(imageios_ITKIONRRD itkNrrdImageIO)
  set(imageios_ITKIOGDCM itkGDCMImageIO)
  set(imageios_ITKIOJPEG itkJPEGImageIO)
  set(imageios_ITKIOTIFF itkTIFFImageIO)
  set(imageios_ITKIOVTK itkVTKImageIO)
  set(imageios_IOScanco itkScancoImageIO)
  set(imageios_IOFDF itkFDFImageIO)
  set(imageios_WebAssemblyInterface itkJSONImageIO)

  set(WebAssemblyInterface_MeshIOModules
    "ITKIOMeshBYU"
    "ITKIOMeshFreeSurfer"
    "ITKIOMeshOBJ"
    "ITKIOMeshOFF"
    "IOMeshSTL"
    "ITKIOMeshVTK"
    CACHE STRING
    "String delimited list of ITK mesh IO modules to support.")
  set(meshios_ITKIOMeshBYU itkBYUMeshIO)
  set(meshios_ITKIOMeshFreeSurfer itkFreeSurferAsciiMeshIO itkFreeSurferBinaryMeshIO)
  set(meshios_ITKIOMeshVTK itkVTKPolyDataMeshIO)
  set(meshios_ITKIOMeshOBJ itkOBJMeshIO)
  set(meshios_ITKIOMeshOFF itkOFFMeshIO)
  set(meshios_IOMeshSTL itkSTLMeshIO)

  set(PolyDataIOPipelines
    "VTKLegacyFileReader"
    "VTKXMLFileReader"
    "VTKExodusFileReader"
    "VTKPLYFileReader"
    CACHE STRING
    "String delimited list of VTK PolyData IO pipelines to support.")
  set(polydataios_VTKExodusFileReader VTK::IOExodus VTK::CommonDataModel
    VTK::FiltersCore VTK::FiltersGeometry)
  set(polydataios_VTKLegacyFileReader VTK::IOLegacy VTK::FiltersGeometry)
  set(polydataios_VTKXMLFileReader VTK::IOXML VTK::FiltersGeometry VTK::IOLegacy)
  set(polydataios_VTKPLYFileReader VTK::IOPLY)
endif()

find_path(RapidJSON_INCLUDE_DIR
 NAMES rapidjson/document.h
  )
set(WebAssemblyInterface_INCLUDE_DIRS ${RapidJSON_INCLUDE_DIR})

get_filename_component(_module_dir "${CMAKE_CURRENT_LIST_FILE}" PATH)
set(CMAKE_MODULE_PATH "${_module_dir}/CMake/" ${CMAKE_MODULE_PATH})

if(NOT ITK_SOURCE_DIR)
  find_package(ITK 5.0 REQUIRED)
  list(APPEND CMAKE_MODULE_PATH ${ITK_CMAKE_DIR})
  set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)
  include(ITKModuleExternal)
else()
  itk_module_impl()
endif()

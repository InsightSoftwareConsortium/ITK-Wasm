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
  set(imageios_WebAssemblyInterface itkWASMImageIO)

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

include(FetchContent)
set(_itk_build_testing ${BUILD_TESTING})
set(_itk_build_shared ${BUILD_SHARED_LIBS})
# Uses newer CMake
set(RapidJSON_GIT_REPOSITORY "https://github.com/thewtex/rapidjson.git")
set(RapidJSON_GIT_TAG        "67eb4fec88204714f6d0f63573569788135e41a5")
set(RAPIDJSON_BUILD_CXX17 ON)
set(RAPIDJSON_BUILD_DOC OFF)
set(RAPIDJSON_BUILD_EXAMPLES OFF)
set(RAPIDJSON_BUILD_TESTS OFF)
set(RAPIDJSON_ENABLE_INSTRUMENTATION_OPT OFF)
FetchContent_Declare(
  rapidjson_lib
  GIT_REPOSITORY ${RapidJSON_GIT_REPOSITORY}
  GIT_TAG ${RapidJSON_GIT_TAG}
  )
set(zip_lib_GIT_REPOSITORY https://github.com/kuba--/zip.git)
set(zip_lib_GIT_TAG d85a6e5ec124b3a084eab11e4fea9973330d664d)
set(CMAKE_DISABLE_TESTING ON CACHE BOOL "Disable zip tests")
option(CMAKE_DISABLE_TESTING ON "Disable zip tests")
FetchContent_Declare(
  zip_lib
  GIT_REPOSITORY ${zip_lib_GIT_REPOSITORY}
  GIT_TAG ${zip_lib_GIT_TAG}
  )
FetchContent_MakeAvailable(rapidjson_lib zip_lib)
option(CMAKE_DISABLE_TESTING ON "Disable zip tests")
set(RapidJSON_INCLUDE_DIR "${rapidjson_lib_SOURCE_DIR}/include")
set(BUILD_TESTING ${_itk_build_testing})
set(BUILD_SHARED_LIBS ${_itk_build_shared})

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

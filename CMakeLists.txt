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

set(minizip-ng_GIT_REPOSITORY https://github.com/zlib-ng/minizip-ng.git)
# 3.0.3
set(minizip-ng_GIT_TAG 0930f1aebebb3554570a94357464f0a67b387c6d)
option(MZ_COMPAT OFF "Enables compatibility layer")
option(MZ_ZLIB OFF "Enables ZLIB compression")
option(MZ_BZIP2 OFF "Enables BZIP2 compression")
option(MZ_LZMA OFF "Enables LZMA & XZ compression")
option(MZ_ZSTD OFF "Enables ZSTD compression")
option(MZ_PKCRYPT OFF "Enables PKWARE traditional encryption")
option(MZ_WZAES OFF "Enables WinZIP AES encryption")
option(MZ_OPENSSL OFF "Enables OpenSSL encryption")
option(MZ_LIBBSD OFF "Build with libbsd for crypto random")
option(MZ_SIGNING OFF "Enables zip signing support")
option(MZ_ICONV OFF "Enables iconv string encoding conversion library")
set(MZ_PROJECT_SUFFIX "-itk" CACHE STRING "Minizip name suffix")
FetchContent_Declare(
  minizip-ng
  GIT_REPOSITORY ${minizip-ng_GIT_REPOSITORY}
  GIT_TAG ${minizip-ng_GIT_TAG}
  )

set(CLI11_GIT_REPOSITORY "https://github.com/CLIUtils/CLI11")
# v2.1.2
set(CLI11_GIT_TAG "70f8072f9dd2292fd0b9f9e5f58e279f60483ed3")
FetchContent_Declare(
  cli11
  GIT_REPOSITORY ${CLI11_GIT_REPOSITORY}
  GIT_TAG        ${CLI11_GIT_TAG}
)


FetchContent_MakeAvailable(rapidjson_lib minizip-ng cli11)
set(RapidJSON_INCLUDE_DIR "${rapidjson_lib_SOURCE_DIR}/include")
set(minizip-ng_INCLUDE_DIR "${minizip-ng_SOURCE_DIR}")
set(cli11_INCLUDE_DIR "${cli11_SOURCE_DIR}/include")

set(BUILD_TESTING ${_itk_build_testing})
set(BUILD_SHARED_LIBS ${_itk_build_shared})

find_path(RapidJSON_INCLUDE_DIR
 NAMES rapidjson/document.h
 )
set(WebAssemblyInterface_INCLUDE_DIRS
  ${RapidJSON_INCLUDE_DIR}
  ${minizip-ng_INCLUDE_DIR}
  ${cli11_INCLUDE_DIR}
  )
list(APPEND WebAssemblyInterface_LIBRARIES minizip-itk)

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
itk_module_target_label(minizip-itk)
itk_module_target_export(minizip-itk)
itk_module_target_install(minizip-itk)

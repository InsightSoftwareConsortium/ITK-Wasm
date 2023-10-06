cmake_minimum_required(VERSION 3.16)
project(itkwasm-image-io)

set(CMAKE_CXX_STANDARD 17)

if (NOT TARGET libzstd_static)
  include(${CMAKE_CURRENT_SOURCE_DIR}/BuildZstd.cmake)
endif()

if(WASI)
  set(WebAssemblyInterface_ImageIOModules
    "ITKIOPNG"
    "ITKIOMeta"
    "ITKIOTIFF"
    "ITKIONIFTI"
    "ITKIOJPEG"
    "ITKIONRRD"
    "ITKIOVTK"
    "ITKIOBMP"
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
else()
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
endif()
set(imageios_ITKIOPNG itkPNGImageIO)
set(imageio_id_itkPNGImageIO 0)
set(imageio_kebab_itkPNGImageIO "png")

set(imageios_ITKIOMeta itkMetaImageIO)
set(imageio_id_itkMetaImageIO 1)
set(imageio_kebab_itkMetaImageIO "meta")

set(imageios_ITKIOTIFF itkTIFFImageIO)
set(imageio_id_itkTIFFImageIO 2)
set(imageio_kebab_itkTIFFImageIO "tiff")

set(imageios_ITKIONIFTI itkNiftiImageIO)
set(imageio_id_itkNiftiImageIO 3)
set(imageio_kebab_itkNiftiImageIO "nifti")

set(imageios_ITKIOJPEG itkJPEGImageIO)
set(imageio_id_itkJPEGImageIO 4)
set(imageio_kebab_itkJPEGImageIO "jpeg")

set(imageios_ITKIONRRD itkNrrdImageIO)
set(imageio_id_itkNrrdImageIO 5)
set(imageio_kebab_itkNrrdImageIO "nrrd")

set(imageios_ITKIOVTK itkVTKImageIO)
set(imageio_id_itkVTKImageIO 6)
set(imageio_kebab_itkVTKImageIO "vtk")

set(imageios_ITKIOBMP itkBMPImageIO)
set(imageio_id_itkBMPImageIO 7)
set(imageio_kebab_itkBMPImageIO "bmp")

set(imageios_ITKIOHDF5 itkHDF5ImageIO)
set(imageio_id_itkHDF5ImageIO 8)
set(imageio_kebab_itkHDF5ImageIO "hdf5")

set(imageios_ITKIOMINC itkMINCImageIO)
set(imageio_id_itkMINCImageIO 9)
set(imageio_kebab_itkMINCImageIO "minc")

set(imageios_ITKIOMRC itkMRCImageIO)
set(imageio_id_itkMRCImageIO 10)
set(imageio_kebab_itkMRCImageIO "mrc")

set(imageios_ITKIOLSM itkLSMImageIO)
set(imageio_id_itkLSMImageIO 11)
set(imageio_kebab_itkLSMImageIO "lsm")

set(imageios_MGHIO itkMGHImageIO)
set(imageio_id_itkMGHImageIO 12)
set(imageio_kebab_itkMGHImageIO "mgh")

set(imageios_ITKIOBioRad itkBioRadImageIO)
set(imageio_id_itkBioRadImageIO 13)
set(imageio_kebab_itkBioRadImageIO "bio-rad")

set(imageios_ITKIOGIPL itkGiplImageIO)
set(imageio_id_itkGiplImageIO 14)
set(imageio_kebab_itkGiplImageIO "gipl")

set(imageios_ITKIOGE itkGEAdwImageIO itkGE4ImageIO itkGE5ImageIO)
set(imageio_id_itkGE4ImageIO 15)
set(imageio_kebab_itkGE4ImageIO "ge4")
set(imageio_id_itkGE5ImageIO 16)
set(imageio_kebab_itkGE5ImageIO "ge5")
set(imageio_id_itkGEAdwImageIO 17)
set(imageio_kebab_itkGEAdwImageIO "ge-adw")

set(imageios_ITKIOGDCM itkGDCMImageIO)
set(imageio_id_itkGDCMImageIO 18)
set(imageio_kebab_itkGDCMImageIO "gdcm")

set(imageios_IOScanco itkScancoImageIO)
set(imageio_id_itkScancoImageIO 19)
set(imageio_kebab_itkScancoImageIO "scanco")

set(imageios_IOFDF itkFDFImageIO)
set(imageio_id_itkFDFImageIO 20)
set(imageio_kebab_itkFDFImageIO "fdf")

set(imageios_WebAssemblyInterface itkWasmImageIO itkWasmZstdImageIO)
set(imageio_id_itkWasmImageIO 21)
set(imageio_kebab_itkWasmImageIO "wasm")
set(imageio_id_itkWasmZstdImageIO 22)
set(imageio_kebab_itkWasmZstdImageIO "wasm-zstd")

set(imageios_no_write
  IOFDF
)

set(ITK_NO_IMAGEIO_FACTORY_REGISTER_MANAGER 1)
set(ImageIOIndex_ARRAY "")
foreach(io_module ${WebAssemblyInterface_ImageIOModules} WebAssemblyInterface)
  if (DEFINED WebAssemblyInterface_INCLUDE_DIRS)
    if(${io_module} STREQUAL "WebAssemblyInterface")
      find_package(ITK REQUIRED COMPONENTS ITKIOImageBase)
      include(${ITK_USE_FILE})
      include_directories(${WebAssemblyInterface_INCLUDE_DIRS})
      include_directories(${CMAKE_CURRENT_SOURCE_DIR})
      list(APPEND ITK_LIBRARIES ${WebAssemblyInterface_LIBRARIES})
    else()
      find_package(ITK REQUIRED COMPONENTS ${io_module} WebAssemblyInterface)
      include(${ITK_USE_FILE})
    endif()
  else()
    find_package(ITK REQUIRED COMPONENTS ${io_module} WebAssemblyInterface)
    include(${ITK_USE_FILE})
  endif()

  if(NOT DEFINED imageios_${io_module})
    message(FATAL_ERROR "Unknown ImageIOBase classes for module ${io_module}")
  endif()
  foreach(imageio ${imageios_${io_module}})
    string(SUBSTRING "${imageio}" 3 -1 ioname)
    if(NOT DEFINED imageio_kebab_${imageio})
      message(FATAL_ERROR "Unknown kebab name for imageio ${imageio}")
    endif()
    set(ioname ${imageio_kebab_${imageio}})
    set(read_binary "${ioname}-read-image")
    set(write_binary "${ioname}-write-image")
    set(ImageIOIndex_ARRAY "${ImageIOIndex_ARRAY}'${ioname}', ")
    set(extra_srcs)
    if(${imageio} STREQUAL "itkWasmZstdImageIO")
      list(APPEND ITK_LIBRARIES libzstd_static)
      list(APPEND extra_srcs itkWasmZstdImageIO.cxx)
    endif()

    add_executable(${read_binary} read-image.cxx ${extra_srcs})
    target_link_libraries(${read_binary} PUBLIC ${ITK_LIBRARIES})
    target_compile_definitions(${read_binary} PUBLIC -DIMAGE_IO_CLASS=${imageio_id_${imageio}} -DIMAGE_IO_KEBAB_NAME=${ioname})
    if (NOT ${imageio} IN_LIST imageios_no_write)
      add_executable(${write_binary} write-image.cxx ${extra_srcs})
      target_link_libraries(${write_binary} PUBLIC ${ITK_LIBRARIES})
      target_compile_definitions(${write_binary} PUBLIC -DIMAGE_IO_CLASS=${imageio_id_${imageio}} -DIMAGE_IO_KEBAB_NAME=${ioname})
    endif()
    if (EMSCRIPTEN)
      set(target_esm_read "${read_binary}")
      set(target_umd_read "${read_binary}.umd")
      target_compile_definitions(${target_umd_read} PUBLIC -DIMAGE_IO_CLASS=${imageio_id_${imageio}} -DIMAGE_IO_KEBAB_NAME=${ioname})
      if (NOT ${imageio} IN_LIST imageios_no_write)
        set(target_esm_write "${write_binary}")
        set(target_umd_write "${write_binary}.umd")
        target_compile_definitions(${target_umd_write} PUBLIC -DIMAGE_IO_CLASS=${imageio_id_${imageio}} -DIMAGE_IO_KEBAB_NAME=${ioname})
      endif()
      foreach(target ${target_esm_read} ${target_umd_read} ${target_esm_write} ${target_umd_write})
        set(exception_catching )
        if(${io_module} STREQUAL "ITKIOGE")
          set(exception_catching " -s DISABLE_EXCEPTION_CATCHING=0") 
        endif()
        set(imageio_common_link_flags " -s ERROR_ON_UNDEFINED_SYMBOLS=0 -s SUPPORT_LONGJMP=1")
        get_property(link_flags TARGET ${target} PROPERTY LINK_FLAGS)
        set_property(TARGET ${target} APPEND_STRING PROPERTY LINK_FLAGS " ${imageio_common_link_flags} ${link_flags}")
      endforeach()
    endif()
  endforeach()
endforeach()
if(EMSCRIPTEN)
  configure_file(${CMAKE_CURRENT_SOURCE_DIR}/image-io-index.ts.in
    ${CMAKE_CURRENT_SOURCE_DIR}/typescript/src/image-io-index.ts @ONLY)
endif()

enable_testing()

set(input_dir ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input)
set(baseline_dir ${CMAKE_CURRENT_SOURCE_DIR}/test/data/baseline)
set(output_dir ${CMAKE_CURRENT_BINARY_DIR})

add_test(NAME bio-rad-read-image-test
  COMMAND bio-rad-read-image
  ${input_dir}/biorad.pic
  ${output_dir}/bio-rad-read-image-test.could-read.json
  ${output_dir}/bio-rad-read-image-test.iwi.cbor)

add_test(NAME bio-rad-write-image-test
  COMMAND bio-rad-write-image
  ${baseline_dir}/bio-rad-read-image-test.iwi.cbor
  ${output_dir}/bio-rad-write-image-test.could-write.json
  ${output_dir}/bio-rad-write-image-test.pic)
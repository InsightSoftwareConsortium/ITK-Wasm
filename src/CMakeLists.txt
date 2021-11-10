# include iconv for reading dicom tags
include(ExternalProject)
set(Iconv iconv)
set(Iconv_LIBRARY libiconv)
set(Iconv_DIR ${CMAKE_BINARY_DIR}/libiconv)
set(Iconv_INCLUDE_DIRS ${Iconv_DIR}/include)
file(MAKE_DIRECTORY ${Iconv_DIR} ${Iconv_INCLUDE_DIRS})

set(WebAssemblyInterface_SRCS
  itkWASMImageIOFactory.cxx
  itkWASMImageIO.cxx
  itkJSONMeshIOFactory.cxx
  itkJSONMeshIO.cxx
  )
itk_module_add_library(WebAssemblyInterface ${WebAssemblyInterface_SRCS})

if(BUILD_ITK_JS_IO_MODULES)
include_directories(${WebAssemblyInterface_INCLUDE_DIRS})

# -s WASM_ASYNC_COMPILATION=0
# -flto
set(common_link_flags " -s ALLOW_MEMORY_GROWTH=1 -s FORCE_FILESYSTEM=1 -s MODULARIZE=1 -s WASM=1 -lnodefs.js -s EXIT_RUNTIME=0 -s INVOKE_RUN=1 --post-js ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPost.js")
set(esm_link_flags " -s EXPORT_ES6=1 -s USE_ES6_IMPORT_META=0")

set(ImageIOIndex_ARRAY "")
foreach(io_module ${WebAssemblyInterface_ImageIOModules} WebAssemblyInterface)
  if(${io_module} STREQUAL "WebAssemblyInterface")
    find_package(ITK REQUIRED COMPONENTS ITKIOImageBase)
    include(${ITK_USE_FILE})
    list(APPEND ITK_LIBRARIES ${WebAssemblyInterface_LIBRARIES})
  else()
    find_package(ITK REQUIRED COMPONENTS ${io_module})
    include(${ITK_USE_FILE})
  endif()

  if(NOT DEFINED imageios_${io_module})
    message(FATAL_ERROR "Unknown ImageIOBase classes for module ${io_module}")
  endif()
  foreach(imageio ${imageios_${io_module}})
    set(ImageIOIndex_ARRAY "${ImageIOIndex_ARRAY}'${imageio}JSBinding', ")
    set(target ${imageio}JSBinding)
    set(target_umd ${imageio}JSBinding.umd)

    _add_executable(${target} io/internal/bindings/${target}.cxx)
    itk_module_target_label(${target})
    itk_module_target_export(${target})
    itk_module_target_install(${target})

    _add_executable(${target_umd} io/internal/bindings/${target}.cxx)
    itk_module_target_label(${target_umd})
    itk_module_target_export(${target_umd})
    itk_module_target_install(${target_umd})

    # For embind
    set_property(TARGET ${target} APPEND_STRING
      PROPERTY LINK_FLAGS " --bind"
      )
    set_property(TARGET ${target_umd} APPEND_STRING
      PROPERTY LINK_FLAGS " --bind"
      )

    set(exception_catching )
    if(${io_module} STREQUAL "ITKIOGE")
      set(exception_catching " -s DISABLE_EXCEPTION_CATCHING=0")
    endif()
    set(imageio_common_link_flags " ${common_link_flags} -s ERROR_ON_UNDEFINED_SYMBOLS=0 -s SUPPORT_LONGJMP=1 --no-entry -s EXPORT_NAME=${imageio}JSBinding ${exception_catching}")
    set_property(TARGET ${target} APPEND_STRING
      PROPERTY LINK_FLAGS " ${imageio_common_link_flags} ${esm_link_flags} "
      )
    set_property(TARGET ${target_umd} APPEND_STRING
      PROPERTY LINK_FLAGS " ${imageio_common_link_flags} "
      )

    set_property(TARGET ${target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${WebAssemblyInterface_BINARY_DIR}/image-io
      )
    set_property(SOURCE io/internal/bindings/${target}.cxx APPEND
      PROPERTY OBJECT_DEPENDS
      ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPost.js
      )
    _target_link_libraries(${target} LINK_PUBLIC ${ITK_LIBRARIES})
    set_property(TARGET ${target_umd}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${WebAssemblyInterface_BINARY_DIR}/image-io
      )
    _target_link_libraries(${target_umd} LINK_PUBLIC ${ITK_LIBRARIES})
  endforeach()
endforeach()
configure_file(${CMAKE_CURRENT_SOURCE_DIR}/io/internal/ImageIOIndex.ts.in
  ${CMAKE_CURRENT_SOURCE_DIR}/io/internal/ImageIOIndex.ts @ONLY)

# DICOM tag reading needs Iconv, and the docker image (currently)
# used for building does not have iconv installed
set(Iconv_CONFIGURE_COMMAND
  emconfigure
  ${Iconv_DIR}/src/libiconv/configure
  --srcdir=${Iconv_DIR}/src/libiconv
  --prefix=${Iconv_DIR}
  --host=wasm32
  --enable-static)
set(Iconv_BUILD_COMMAND emmake make)

ExternalProject_Add(${Iconv_LIBRARY}
  PREFIX ${Iconv_DIR}
  URL "https://ftp.gnu.org/pub/gnu/libiconv/libiconv-1.16.tar.gz"
  URL_HASH SHA256=e6a1b1b589654277ee790cce3734f07876ac4ccfaecbee8afa0b649cf529cc04
  CONFIGURE_COMMAND ${Iconv_CONFIGURE_COMMAND}
  BUILD_COMMAND ${Iconv_BUILD_COMMAND}
  # needed for ninja generator
  BUILD_BYPRODUCTS ${Iconv_DIR}/lib/${CMAKE_STATIC_LIBRARY_PREFIX}iconv${CMAKE_STATIC_LIBRARY_SUFFIX}
)

add_library(${Iconv} STATIC IMPORTED)
set_target_properties(${Iconv} PROPERTIES
  IMPORTED_LOCATION ${Iconv_DIR}/lib/${CMAKE_STATIC_LIBRARY_PREFIX}iconv${CMAKE_STATIC_LIBRARY_SUFFIX}
  INTERFACE_INCLUDE_DIRECTORIES ${Iconv_INCLUDE_DIRS})

add_dependencies(${Iconv} ${Iconv_LIBRARY})

# DICOM-based readers
find_package(ITK REQUIRED COMPONENTS ITKIOGDCM)
include(${ITK_USE_FILE})
foreach(dicom_io_module
    itkDICOMImageSeriesReader
    itkDICOMTagReader
)
  set(target "${dicom_io_module}JSBinding")
  set(target_umd "${dicom_io_module}JSBinding.umd")

  _add_executable(${target} io/internal/bindings/${target}.cxx)
  itk_module_target_label(${target})
  itk_module_target_export(${target})
  itk_module_target_install(${target})

  _add_executable(${target_umd} io/internal/bindings/${target}.cxx)
  itk_module_target_label(${target_umd})
  itk_module_target_export(${target_umd})
  itk_module_target_install(${target_umd})

  # For embind
  set_property(TARGET ${target} APPEND_STRING
    PROPERTY LINK_FLAGS " --bind"
    )
  set_property(TARGET ${target_umd} APPEND_STRING
    PROPERTY LINK_FLAGS " --bind"
    )

  set(dicom_common_link_flags " ${common_link_flags} -s SUPPORT_LONGJMP=1 -s DISABLE_EXCEPTION_CATCHING=0 -s EXPORT_NAME=${target}")
  set_property(TARGET ${target} APPEND_STRING
    PROPERTY LINK_FLAGS " ${dicom_common_link_flags} ${esm_link_flags} "
    )
  set_property(TARGET ${target_umd} APPEND_STRING
    PROPERTY LINK_FLAGS " ${dicom_common_link_flags}"
    )

  set_property(TARGET ${target}
    PROPERTY RUNTIME_OUTPUT_DIRECTORY
    ${WebAssemblyInterface_BINARY_DIR}/image-io
    )
  set_property(TARGET ${target_umd}
    PROPERTY RUNTIME_OUTPUT_DIRECTORY
    ${WebAssemblyInterface_BINARY_DIR}/image-io
    )
  set_property(SOURCE io/internal/bindings/${target}.cxx APPEND
    PROPERTY OBJECT_DEPENDS
    ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPost.js
    )
  set_property(SOURCE io/internal/bindings/${target_umd}.cxx APPEND
    PROPERTY OBJECT_DEPENDS
    ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPost.js
    )
  _target_link_libraries(${target} LINK_PUBLIC ${ITK_LIBRARIES})
  _target_link_libraries(${target_umd} LINK_PUBLIC ${ITK_LIBRARIES})

  # libiconv for DICOMTagReader
  if(${dicom_io_module} STREQUAL "itkDICOMTagReader")
    include_directories(${Iconv_INCLUDE_DIRS})
    _target_link_libraries(${target} LINK_PUBLIC ${Iconv_LIBRARIES} ${Iconv})
    _target_link_libraries(${target_umd} LINK_PUBLIC ${Iconv_LIBRARIES} ${Iconv})
  endif()
endforeach()

set(MeshIOIndex_ARRAY "")
foreach(io_module ${WebAssemblyInterface_MeshIOModules})
  find_package(ITK REQUIRED COMPONENTS ${io_module})
  include(${ITK_USE_FILE})

  if(NOT DEFINED meshios_${io_module})
    message(FATAL_ERROR "Unknown MeshIOBase classes for module ${io_module}")
  endif()
  foreach(meshio ${meshios_${io_module}})
    set(MeshIOIndex_ARRAY "${MeshIOIndex_ARRAY}'${meshio}JSBinding', ")
    set(target ${meshio}JSBinding)
    set(target_umd ${meshio}JSBinding.umd)

    _add_executable(${target} io/internal/bindings/${target}.cxx)
    itk_module_target_label(${target})
    itk_module_target_export(${target})
    itk_module_target_install(${target})

    _add_executable(${target_umd} io/internal/bindings/${target}.cxx)
    itk_module_target_label(${target_umd})
    itk_module_target_export(${target_umd})
    itk_module_target_install(${target_umd})

    # For embind
    set_property(TARGET ${target} APPEND_STRING
      PROPERTY LINK_FLAGS " --bind"
      )
    set_property(TARGET ${target_umd} APPEND_STRING
      PROPERTY LINK_FLAGS " --bind"
      )

    set(meshio_common_link_flags " ${common_link_flags} -s EXPORT_NAME=${meshio}JSBinding --no-entry")
    set_property(TARGET ${target} APPEND_STRING
      PROPERTY LINK_FLAGS " ${meshio_common_link_flags} ${esm_link_flags}"
      )
    set_property(TARGET ${target_umd} APPEND_STRING
      PROPERTY LINK_FLAGS " ${meshio_common_link_flags} "
      )

    set_property(TARGET ${target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${WebAssemblyInterface_BINARY_DIR}/mesh-io
      )
    set_property(TARGET ${target_umd}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${WebAssemblyInterface_BINARY_DIR}/mesh-io
      )
    set_property(SOURCE io/internal/bindings/${target}.cxx APPEND
      PROPERTY OBJECT_DEPENDS
      ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPost.js
      )
    _target_link_libraries(${target} LINK_PUBLIC ${ITK_LIBRARIES})
    _target_link_libraries(${target_umd} LINK_PUBLIC ${ITK_LIBRARIES})
  endforeach()
endforeach()
configure_file(${CMAKE_CURRENT_SOURCE_DIR}/io/internal/MeshIOIndex.ts.in
  ${CMAKE_CURRENT_SOURCE_DIR}/io/internal/MeshIOIndex.ts @ONLY)

# Pipelines for readPolyData
find_package(VTK QUIET)
if(VTK_FOUND)
  foreach(io_pipeline ${PolyDataIOPipelines})

    # Workaround Threads issue
    find_package(Threads)

    set(target ${io_pipeline})
    set(target_umd ${io_pipeline}.umd)

    _add_executable(${target} io/internal/bindings/${target}.cxx)
    _add_executable(${target_umd} io/internal/bindings/${target}.cxx)

    set(polydata_common_link_flags " ${common_link_flags} -s INVOKE_RUN=0 -s ERROR_ON_UNDEFINED_SYMBOLS=0 -s EXPORT_NAME=${io_pipeline} -s EXPORTED_RUNTIME_METHODS='[\"callMain\", \"print\", \"printErr\"]' -s EXPORTED_FUNCTIONS='[\"_main\"]' --pre-js ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPipelinePre.js")
    set_property(TARGET ${target} APPEND_STRING
      PROPERTY LINK_FLAGS " ${polydata_common_link_flags} ${esm_link_flags}"
      )
    set_property(TARGET ${target_umd} APPEND_STRING
      PROPERTY LINK_FLAGS " ${polydata_common_link_flags}"
      )

    set_property(TARGET ${target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${WebAssemblyInterface_BINARY_DIR}/polydata-io
      )
    set_property(TARGET ${target_umd}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${WebAssemblyInterface_BINARY_DIR}/polydata-io
      )
    set_property(SOURCE io/internal/bindings/${target}.cxx APPEND
      PROPERTY OBJECT_DEPENDS
      ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPost.js
      )

      _target_link_libraries(${target} LINK_PUBLIC VTK::IOExport ${polydataios_${io_pipeline}})
      _target_link_libraries(${target_umd} LINK_PUBLIC VTK::IOExport ${polydataios_${io_pipeline}})
  endforeach()
endif()

endif() # BUILD_ITK_JS_IO_MODULES

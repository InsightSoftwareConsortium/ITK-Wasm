find_path(RapidJSON_INCLUDE_DIR
 NAMES rapidjson/document.h
  )
include_directories(${RapidJSON_INCLUDE_DIR})

# include iconv for reading dicom tags
include(ExternalProject)
set(Iconv iconv)
set(Iconv_LIBRARY libiconv)
set(Iconv_DIR ${CMAKE_BINARY_DIR}/libiconv)
set(Iconv_INCLUDE_DIRS ${Iconv_DIR}/include)
file(MAKE_DIRECTORY ${Iconv_DIR} ${Iconv_INCLUDE_DIRS})

set(BridgeJavaScript_SRCS
  itkJSONImageIOFactory.cxx
  itkJSONImageIO.cxx
  itkJSONMeshIOFactory.cxx
  itkJSONMeshIO.cxx
  )
itk_module_add_library(BridgeJavaScript ${BridgeJavaScript_SRCS})

if(BUILD_ITK_JS_IO_MODULES)

set(ImageIOIndex_ARRAY "")
foreach(io_module ${BridgeJavaScript_ImageIOModules} BridgeJavaScript)
  if(${io_module} STREQUAL "BridgeJavaScript")
    find_package(ITK REQUIRED COMPONENTS ITKIOImageBase)
    include(${ITK_USE_FILE})
    list(APPEND ITK_LIBRARIES ${BridgeJavaScript_LIBRARIES})
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
    set(wasm_target ${imageio}JSBindingWasm)
    _add_executable(${target} io/internal/bindings/${target}.cxx)
    itk_module_target_label(${target})
    itk_module_target_export(${target})
    itk_module_target_install(${target})
    _add_executable(${wasm_target} io/internal/bindings/${target}.cxx)
    itk_module_target_label(${wasm_target})
    itk_module_target_export(${wasm_target})
    itk_module_target_install(${wasm_target})
    # For embind
    set_property(TARGET ${target} APPEND_STRING
      PROPERTY LINK_FLAGS " --bind"
      )
    set_property(TARGET ${wasm_target} APPEND_STRING
      PROPERTY LINK_FLAGS " --bind"
      )
    set(exception_catching )
    if(${io_module} STREQUAL "ITKIOGE")
      set(exception_catching " -s DISABLE_EXCEPTION_CATCHING=0")
    endif()
    set_property(TARGET ${target} APPEND_STRING
      PROPERTY LINK_FLAGS " -s WASM=0 -lnodefs.js ${exception_catching} -s EXIT_RUNTIME=0 -s INVOKE_RUN=0 --pre-js ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSImageIOPre.js --post-js ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPost.js"
      )
    set(pre_js ${CMAKE_CURRENT_BINARY_DIR}/itkJSImageIOPre${imageio}.js)
    configure_file(${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSImageIOPre.js.in
      ${pre_js} @ONLY)
    set_property(TARGET ${wasm_target} APPEND_STRING
      PROPERTY LINK_FLAGS " -s EXPORT_NAME=${imageio}JSBinding -s WASM_ASYNC_COMPILATION=0 -s MODULARIZE=1 -s WASM=1 -lworkerfs.js ${exception_catching} -s EXIT_RUNTIME=0 -s INVOKE_RUN=1 --pre-js ${pre_js} --post-js ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPost.js"
      )
    set_property(TARGET ${target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${BridgeJavaScript_BINARY_DIR}/image-io
      )
    set_property(TARGET ${wasm_target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${BridgeJavaScript_BINARY_DIR}/image-io
      )
    set_property(SOURCE io/internal/bindings/${target}.cxx APPEND
      PROPERTY OBJECT_DEPENDS
      ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPost.js
      )
    _target_link_libraries(${target} LINK_PUBLIC ${ITK_LIBRARIES})
    _target_link_libraries(${wasm_target} LINK_PUBLIC ${ITK_LIBRARIES})
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
  set(wasm_target "${dicom_io_module}JSBindingWasm")
  _add_executable(${target} io/internal/bindings/${target}.cxx)
  itk_module_target_label(${target})
  itk_module_target_export(${target})
  itk_module_target_install(${target})
  _add_executable(${wasm_target} io/internal/bindings/${target}.cxx)
  itk_module_target_label(${wasm_target})
  itk_module_target_export(${wasm_target})
  itk_module_target_install(${wasm_target})

  # For embind
  set_property(TARGET ${target} APPEND_STRING
    PROPERTY LINK_FLAGS " --bind"
    )
  set_property(TARGET ${wasm_target} APPEND_STRING
    PROPERTY LINK_FLAGS " --bind"
    )
  set_property(TARGET ${target} APPEND_STRING
    PROPERTY LINK_FLAGS " -s DISABLE_EXCEPTION_CATCHING=0 -s WASM=0 -lnodefs.js -s FORCE_FILESYSTEM=1 -s EXIT_RUNTIME=0 -s INVOKE_RUN=0 --pre-js ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSImageIOPre.js --post-js ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPost.js"
    )
  set(pre_js "${CMAKE_CURRENT_BINARY_DIR}/itkJSImageIOPre${dicom_io_module}.js")
  configure_file(${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSImageIOPre.js.in
    ${pre_js} @ONLY)
  set_property(TARGET ${wasm_target} APPEND_STRING
    PROPERTY LINK_FLAGS " -s DISABLE_EXCEPTION_CATCHING=0 -s FORCE_FILESYSTEM=1 -s EXPORT_NAME=${target} -s WASM_ASYNC_COMPILATION=0 -s MODULARIZE=1 -s WASM=1 -lworkerfs.js -s EXIT_RUNTIME=0 -s INVOKE_RUN=0 --pre-js ${pre_js} --post-js ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPost.js"
    )
  set_property(TARGET ${target}
    PROPERTY RUNTIME_OUTPUT_DIRECTORY
    ${BridgeJavaScript_BINARY_DIR}/image-io
    )
  set_property(TARGET ${wasm_target}
    PROPERTY RUNTIME_OUTPUT_DIRECTORY
    ${BridgeJavaScript_BINARY_DIR}/image-io
    )
  set_property(SOURCE io/internal/bindings/${target}.cxx APPEND
    PROPERTY OBJECT_DEPENDS
    ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPost.js
    )
  _target_link_libraries(${target} LINK_PUBLIC ${ITK_LIBRARIES})
  _target_link_libraries(${wasm_target} LINK_PUBLIC ${ITK_LIBRARIES})

  # libiconv for DICOMTagReader
  if(${dicom_io_module} STREQUAL "itkDICOMTagReader")
    include_directories(${Iconv_INCLUDE_DIRS})
    _target_link_libraries(${target} LINK_PUBLIC ${Iconv_LIBRARIES} ${Iconv})
    _target_link_libraries(${wasm_target} LINK_PUBLIC ${Iconv_LIBRARIES} ${Iconv})
  endif()
endforeach()

set(MeshIOIndex_ARRAY "")
foreach(io_module ${BridgeJavaScript_MeshIOModules})
  find_package(ITK REQUIRED COMPONENTS ${io_module})
  include(${ITK_USE_FILE})

  if(NOT DEFINED meshios_${io_module})
    message(FATAL_ERROR "Unknown MeshIOBase classes for module ${io_module}")
  endif()
  foreach(meshio ${meshios_${io_module}})
    set(MeshIOIndex_ARRAY "${MeshIOIndex_ARRAY}'${meshio}JSBinding', ")
    set(target ${meshio}JSBinding)
    set(wasm_target ${meshio}JSBindingWasm)
    _add_executable(${target} io/internal/bindings/${target}.cxx)
    itk_module_target_label(${target})
    itk_module_target_export(${target})
    itk_module_target_install(${target})
    _add_executable(${wasm_target} io/internal/bindings/${target}.cxx)
    itk_module_target_label(${wasm_target})
    itk_module_target_export(${wasm_target})
    itk_module_target_install(${wasm_target})
    # For embind
    set_property(TARGET ${target} APPEND_STRING
      PROPERTY LINK_FLAGS " --bind"
      )
    set_property(TARGET ${wasm_target} APPEND_STRING
      PROPERTY LINK_FLAGS " --bind"
      )
    set_property(TARGET ${target} APPEND_STRING
      PROPERTY LINK_FLAGS " -s WASM=0 -lnodefs.js -s EXIT_RUNTIME=0 -s INVOKE_RUN=1 --pre-js ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSMeshIOPre.js --post-js ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPost.js"
      )
    set(pre_js ${CMAKE_CURRENT_BINARY_DIR}/itkJSMeshIOPre${meshio}.js)
    configure_file(${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSMeshIOPre.js.in
      ${pre_js} @ONLY)
    set_property(TARGET ${wasm_target} APPEND_STRING
      PROPERTY LINK_FLAGS " -s EXPORT_NAME=${meshio}JSBinding -s MODULARIZE=1 -s WASM=1 -lworkerfs.js -s WASM_ASYNC_COMPILATION=0 -s EXIT_RUNTIME=0 -s INVOKE_RUN=1 --pre-js ${pre_js} --post-js ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPost.js"
      )
    set_property(TARGET ${target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${BridgeJavaScript_BINARY_DIR}/mesh-io
      )
    set_property(TARGET ${wasm_target}
      PROPERTY RUNTIME_OUTPUT_DIRECTORY
      ${BridgeJavaScript_BINARY_DIR}/mesh-io
      )
    set_property(SOURCE io/internal/bindings/${target}.cxx APPEND
      PROPERTY OBJECT_DEPENDS
      ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPost.js
      )
    _target_link_libraries(${target} LINK_PUBLIC ${ITK_LIBRARIES})
    _target_link_libraries(${wasm_target} LINK_PUBLIC ${ITK_LIBRARIES})
  endforeach()
endforeach()
configure_file(${CMAKE_CURRENT_SOURCE_DIR}/io/internal/MeshIOIndex.ts.in
  ${CMAKE_CURRENT_SOURCE_DIR}/io/internal/MeshIOIndex.ts @ONLY)

# Pipelines for readPolyData
find_package(VTK QUIET)
if(VTK_FOUND)
  foreach(io_pipeline ${PolyDataIOPipelines})

  find_package(VTK REQUIRED COMPONENTS IOExport ${polydataios_${io_pipeline}})

  set(target ${io_pipeline})
  set(wasm_target ${io_pipeline}Wasm)
  _add_executable(${target} io/internal/bindings/${target}.cxx)
  _add_executable(${wasm_target} io/internal/bindings/${target}.cxx)
  set_property(TARGET ${target} APPEND_STRING
    PROPERTY LINK_FLAGS " -s EXTRA_EXPORTED_RUNTIME_METHODS='[\"callMain\", \"print\", \"printErr\"]' -s EXPORTED_FUNCTIONS='[\"_main\"]' -s WASM=0 -lnodefs.js -s EXIT_RUNTIME=0 -s INVOKE_RUN=0 --pre-js ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPipelinePre.js --post-js ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPost.js"
    )
  set(pre_js ${CMAKE_CURRENT_BINARY_DIR}/itkJSPolyDataIOPre${io_pipeline}.js)
  configure_file(${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPolyDataIOPre.js.in
    ${pre_js} @ONLY)
  set_property(TARGET ${wasm_target} APPEND_STRING
    PROPERTY LINK_FLAGS " -s EXTRA_EXPORTED_RUNTIME_METHODS='[\"callMain\", \"print\", \"printErr\"]' -s EXPORT_NAME=${io_pipeline} -s EXPORTED_FUNCTIONS='[\"_main\"]' -s MODULARIZE=1 -s WASM=1 -lworkerfs.js -s WASM_ASYNC_COMPILATION=0 -s EXIT_RUNTIME=0 -s INVOKE_RUN=0 --pre-js ${pre_js} --post-js ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPost.js"
    )
  set_property(TARGET ${target}
    PROPERTY RUNTIME_OUTPUT_DIRECTORY
    ${BridgeJavaScript_BINARY_DIR}/polydata-io
    )
  set_property(TARGET ${wasm_target}
    PROPERTY RUNTIME_OUTPUT_DIRECTORY
    ${BridgeJavaScript_BINARY_DIR}/polydata-io
    )
  set_property(SOURCE io/internal/bindings/${target}.cxx APPEND
    PROPERTY OBJECT_DEPENDS
    ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPost.js
    )
  _target_link_libraries(${target} LINK_PUBLIC ${VTK_LIBRARIES})
  _target_link_libraries(${wasm_target} LINK_PUBLIC ${VTK_LIBRARIES})
  endforeach()
endif()

endif() # BUILD_ITK_JS_IO_MODULES

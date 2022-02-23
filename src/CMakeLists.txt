include_directories(${WebAssemblyInterface_INCLUDE_DIRS})

set(WebAssemblyInterface_SRCS
  itkPipeline.cxx
  itkWASMExports.cxx
  itkWASMDataObject.cxx
  itkWASMImageIOBase.cxx
  itkWASMImageIOFactory.cxx
  itkWASMImageIO.cxx
  itkWASMMeshIOFactory.cxx
  itkWASMMeshIO.cxx
  itkWASMStringStream.cxx
  itkInputTextStream.cxx
  itkOutputTextStream.cxx
  itkInputBinaryStream.cxx
  itkOutputBinaryStream.cxx
  itkIOComponentEnumFromWASMComponentType.cxx
  itkIOPixelEnumFromWASMPixelType.cxx
  itkWASMComponentTypeFromIOComponentEnum.cxx
  itkWASMPixelTypeFromIOPixelEnum.cxx
  itkSupportInputImageTypes.cxx
  )
itk_module_add_library(WebAssemblyInterface ${WebAssemblyInterface_SRCS})

if(BUILD_ITK_WASM_IO_MODULES)

# -s WASM_ASYNC_COMPILATION=0
# -flto
set(common_link_flags " -s ALLOW_MEMORY_GROWTH=1 -s FORCE_FILESYSTEM=1 -s MODULARIZE=1 -s WASM=1 -lnodefs.js -s EXIT_RUNTIME=0 -s INVOKE_RUN=1 --post-js ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPost.js")
set(esm_link_flags " -s EXPORT_ES6=1 -s USE_ES6_IMPORT_META=0")

add_subdirectory(io/internal/pipelines/image/ConvertImage)
add_subdirectory(io/internal/pipelines/image/ReadDICOM)

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
configure_file(${CMAKE_CURRENT_SOURCE_DIR}/io/internal/MeshIOIndex.ts.in
  ${CMAKE_CURRENT_SOURCE_DIR}/../dist/mesh-io/index.js @ONLY)

endif() # BUILD_ITK_WASM_IO_MODULES

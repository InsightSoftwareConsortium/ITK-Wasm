include_directories(${WebAssemblyInterface_INCLUDE_DIRS})

set(WebAssemblyInterface_SRCS
  itkPipeline.cxx
  itkMetaDataDictionaryJSON.cxx
  itkWasmExports.cxx
  itkWasmDataObject.cxx
  itkWasmImageIOBase.cxx
  itkWasmImageIOFactory.cxx
  itkWasmImageIO.cxx
  itkWasmMeshIOBase.cxx
  itkWasmMeshIOFactory.cxx
  itkWasmMeshIO.cxx
  itkWasmStringStream.cxx
  itkInputTextStream.cxx
  itkOutputTextStream.cxx
  itkInputBinaryStream.cxx
  itkOutputBinaryStream.cxx
  itkIOComponentEnumFromWasmComponentType.cxx
  itkIOPixelEnumFromWasmPixelType.cxx
  itkWasmComponentTypeFromIOComponentEnum.cxx
  itkWasmPixelTypeFromIOPixelEnum.cxx
  itkSupportInputImageTypes.cxx
  itkSupportInputMeshTypes.cxx
  itkSupportInputPolyDataTypes.cxx
  )
itk_module_add_library(WebAssemblyInterface ${WebAssemblyInterface_SRCS})
target_link_libraries(WebAssemblyInterface LINK_PUBLIC cbor cpp-base64)

if(BUILD_ITK_WASM_IO_MODULES)

if(EMSCRIPTEN)
# -s WASM_ASYNC_COMPILATION=0
# -flto
  set(common_link_flags " -s ALLOW_MEMORY_GROWTH=1 -s FORCE_FILESYSTEM=1 -s MODULARIZE=1 -s WASM=1 -lnodefs.js -s EXIT_RUNTIME=0 -s INVOKE_RUN=1 --post-js ${CMAKE_CURRENT_SOURCE_DIR}/emscripten-module/itkJSPost.js")
  set(esm_link_flags " -s EXPORT_ES6=1 -s USE_ES6_IMPORT_META=1")
endif()

include(${CMAKE_CURRENT_SOURCE_DIR}/../CMake/BuildZstd.cmake)
add_subdirectory(io/internal/pipelines/image/convert-image)
add_subdirectory(io/internal/pipelines/image/read-dicom)
add_subdirectory(io/internal/pipelines/mesh/convert-mesh)
add_subdirectory(io/internal/pipelines/mesh/mesh-to-polydata)

endif() # BUILD_ITK_WASM_IO_MODULES

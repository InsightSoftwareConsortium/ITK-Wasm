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
if(CMAKE_CXX_COMPILER_ID MATCHES "GNU|Clang")
  target_compile_options(WebAssemblyInterface PRIVATE "-Wno-unused-result")
endif()

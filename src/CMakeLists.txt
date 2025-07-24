include_directories(${WebAssemblyInterface_INCLUDE_DIRS})

set(WebAssemblyInterface_SRCS
  itkPipeline.cxx
  itkMetaDataDictionaryJSON.cxx
  itkMetaDataDictionaryCBOR.cxx
  itkWasmExports.cxx
  itkWasmIOCommon.cxx
  itkWasmDataObject.cxx
  itkWasmImageIOFactory.cxx
  itkWasmImageIO.cxx
  itkWasmMeshIOFactory.cxx
  itkWasmMeshIO.cxx
  itkWasmTransformIOFactory.cxx
  itkWasmTransformIO.cxx
  itkWasmStringStream.cxx
  itkInputStreamBase.cxx
  itkOutputStreamBase.cxx
  itkIOComponentEnumFromWasmComponentType.cxx
  itkIOPixelEnumFromWasmPixelType.cxx
  itkWasmComponentTypeFromIOComponentEnum.cxx
  itkWasmPixelTypeFromIOPixelEnum.cxx
  itkSupportInputImageTypes.cxx
  itkSupportInputMeshTypes.cxx
  itkSupportInputPolyDataTypes.cxx
  itkSupportInputTransformTypes.cxx
  itktransformParameterizationString.cxx
  itkioComponentEnumFromJSON.cxx
  itkioPixelEnumFromJSON.cxx
  itkjsonFromIOComponentEnum.cxx
  itkjsonFromIOPixelEnum.cxx
  itkSupportInputPointSetTypes.cxx
  )
itk_module_add_library(WebAssemblyInterface ${WebAssemblyInterface_SRCS})
target_link_libraries(WebAssemblyInterface LINK_PUBLIC cbor cpp-base64)
if(CMAKE_CXX_COMPILER_ID MATCHES "GNU|Clang")
  target_compile_options(WebAssemblyInterface PRIVATE "-Wno-unused-result")
endif()

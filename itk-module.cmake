set(DOCUMENTATION "This module provides a wrapper to an itk::Image in
JavaScript when working with ITK and Emscripten. It is also used to generate a
library of Emscription modules that provides IO for different ITK-supported
file formats.
")

itk_module(WebAssemblyInterface
  DEPENDS
    ITKCommon
    ITKIOImageBase
  COMPILE_DEPENDS
    MeshToPolyData
    ITKImageFunction
    ITKIOMeshBase
    ${WebAssemblyInterface_ImageIOModules}
    ${WebAssemblyInterface_MeshIOModules}
  TEST_DEPENDS
    ITKTestKernel
    ITKMesh
  FACTORY_NAMES
    ImageIO::WASM
    MeshIO::WASM
  EXCLUDE_FROM_DEFAULT
  DESCRIPTION
    "${DOCUMENTATION}"
  ENABLE_SHARED
)

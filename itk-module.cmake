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
    ${WebAssemblyInterface_ImageIOModules}
    ${WebAssemblyInterface_MeshIOModules}
  PRIVATE_DEPENDS
    # Todo  change to ITKIOMeshBase
    ITKIOMesh
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

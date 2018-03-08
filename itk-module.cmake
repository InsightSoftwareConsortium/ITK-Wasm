set(DOCUMENTATION "This module provides a wrapper to an itk::Image in
JavaScript when working with ITK and Emscripten. It is also used to generate a
library of Emscription modules that provides IO for different ITK-supported
file formats.
")

itk_module(BridgeJavaScript
  DEPENDS
    ITKCommon
    ITKIOImageBase
  COMPILE_DEPENDS
    ITKImageFunction
    ${BridgeJavaScript_ImageIOModules}
    ${BridgeJavaScript_MeshIOModules}
  TEST_DEPENDS
    ITKTestKernel
  EXCLUDE_FROM_DEFAULT
  DESCRIPTION
    "${DOCUMENTATION}"
)

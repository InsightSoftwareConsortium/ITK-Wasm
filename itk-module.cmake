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
  PRIVATE_DEPENDS
    # Todo  change to ITKIOMeshBase
    ITKIOMesh
  TEST_DEPENDS
    ITKTestKernel
  FACTORY_NAMES
    ImageIO::JSON
  EXCLUDE_FROM_DEFAULT
  DESCRIPTION
    "${DOCUMENTATION}"
  ENABLE_SHARED
)

set(DOCUMENTATION "itk-wasm combines ITK and WebAssembly to enable high-performance
spatial analysis in a web browser, Node.js, and reproducible execution across
programming languages and hardware architectures.
The WebAssemblyInterface ITK module from itk-wasm provides IO file formats,
web-friendly in-memory ABI's, and a pipeline execution system.")

itk_module(WebAssemblyInterface
  DEPENDS
    ITKCommon
    ITKIOImageBase
    ITKIOMeshBase
    ITKIOTransformBase
  COMPILE_DEPENDS
    MeshToPolyData
    ITKImageFunction
  TEST_DEPENDS
    ITKTestKernel
    ITKMesh
    ITKImageGrid
    ITKIOTransformHDF5
  FACTORY_NAMES
    ImageIO::Wasm
    MeshIO::Wasm
    TransformIO::Wasm
  EXCLUDE_FROM_DEFAULT
  DESCRIPTION
    "${DOCUMENTATION}"
  ENABLE_SHARED
)

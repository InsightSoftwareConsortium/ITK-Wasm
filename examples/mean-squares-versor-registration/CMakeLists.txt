cmake_minimum_required(VERSION 3.16)
project(mean-squares-versor-registration)

# Use C++17 or newer with itk-wasm
set(CMAKE_CXX_STANDARD 17)

# We always want to build against the WebAssemblyInterface module.
set(itk_components
  WebAssemblyInterface
  ITKCommon
  ITKImageFilterBase
  ITKImageGrid
  ITKImageIntensity
  ITKMetricsv4
  ITKOptimizersv4
  ITKRegistrationCommon
  ITKRegistrationMethodsv4
  ITKTransform
  )
# WASI or native binaries
if (NOT EMSCRIPTEN)
  # WebAssemblyInterface supports the .iwi, .iwi.cbor itk-wasm format.
  # We can list other ITK IO modules to build against to support other
  # formats when building native executable or WASI WebAssembly.
  # However, this will bloat the size of the WASI WebAssembly binary, so
  # add them judiciously.
  set(itk_components
    ${itk_components}
    ITKIOMeta
    # ITKImageIO # Adds support for all available image IO modules
    )
endif()

find_package(ITK REQUIRED
  COMPONENTS ${itk_components}
  )
include(${ITK_USE_FILE})

# This is modified ITK/Examples/RegistrationITKv4/ImageRegistration8.cxx
add_executable(mean-squares-versor-registration
  mean-squares-versor-registration.cxx)
target_link_libraries(mean-squares-versor-registration
  PUBLIC ${ITK_LIBRARIES})


enable_testing()

set(fixed_image ${CMAKE_CURRENT_BINARY_DIR}/brainweb1e1a10f20.mha)
if(NOT EXISTS ${fixed_image})
  message(STATUS "Downloading test fixed image...")
  file(DOWNLOAD "https://w3s.link/ipfs/bafybeigdv4jgy3zt5d7vdzq5qzmpofh6fubhnp5qqgkfvr25lozgskzzcq/brainweb1e1a10f20.mha"
    ${fixed_image}
    )
endif()
set(moving_image ${CMAKE_CURRENT_BINARY_DIR}/brainweb1e1a10f20Rot10Tx15.mha)
if(NOT EXISTS ${moving_image})
  message(STATUS "Downloading test moving image...")
  file(DOWNLOAD
    "https://w3s.link/ipfs/bafybeialjushstijsk7rk45sm2i5sfxyc7uqmtwpeabakqrcrokhlx34tu/brainweb1e1a10f20Rot10Tx15.mha"
    ${moving_image}
    )
endif()
add_test(NAME mean-squares-versor-registration-test
  COMMAND mean-squares-versor-registration
    ${fixed_image}
    ${moving_image}
    ${CMAKE_CURRENT_BINARY_DIR}/output_image.mha
  )

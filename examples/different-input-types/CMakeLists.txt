cmake_minimum_required(VERSION 3.16)
project(different-input-types)

# Use C++17 or newer with itk-wasm
set(CMAKE_CXX_STANDARD 20)

# We always want to build against the WebAssemblyInterface module.
set(itk_components
  WebAssemblyInterface
  ITKImageFusion
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
    ITKIOPNG
    # ITKImageIO # Adds support for all available image IO modules
    )
endif()
find_package(ITK REQUIRED
  COMPONENTS ${itk_components}
  )
include(${ITK_USE_FILE})

add_executable(different-input-types different-input-types.cxx)
target_link_libraries(different-input-types PUBLIC ${ITK_LIBRARIES})
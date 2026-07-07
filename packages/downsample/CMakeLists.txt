cmake_minimum_required(VERSION 3.16)
project(itkwasm-downsample LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)

if(EMSCRIPTEN)
  set(io_components
    )
elseif(WASI)
  set(io_components
    ITKIOPNG
    )
else()
  set(io_components
    ITKImageIO
    ITKTransformIO
    )
endif()

find_package(ITK REQUIRED
 COMPONENTS
   WebAssemblyInterface
   ITKSmoothing
   ITKImageGrid
   ITKTransform
   GenericLabelInterpolator
   ${io_components}
 )
include(${ITK_USE_FILE})

set(pipelines
  downsample
  downsample-sigma
  gaussian-kernel-radius
  downsample-bin-shrink
  downsample-label-image
  resample-bounding-box
  )

# resample-bounding-box-generate-inputs fabricates the self-contained inputs (fixed image, moving image,
# transform) for the resample-bounding-box C++ CTests, and resample-bounding-box-test is an in-process unit
# test that asserts the computed regions directly. Both run under the WASI/native toolchains and are
# deliberately NOT built for Emscripten so they never leak into the browser/Node bindings (TypeScript bindgen
# scans the Emscripten build). They ARE present in the WASI build, however, which the Python bindgen scans --
# neither is an itk-wasm pipeline, so both MUST also be listed under "itk-wasm.bindgen-exclude" in package.json
# or Python bindgen crashes trying to read their (empty) interface JSON. The real, public pipeline is
# resample-bounding-box.
if(NOT EMSCRIPTEN)
  list(APPEND pipelines resample-bounding-box-generate-inputs resample-bounding-box-test)
endif()

foreach(pipeline ${pipelines})
  add_executable(${pipeline} ${pipeline}.cxx)
  target_link_libraries(${pipeline} PUBLIC ${ITK_LIBRARIES})
  target_include_directories(${pipeline} PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
endforeach()

enable_testing()
# Interesting backtrace on exit
if (NOT CMAKE_BUILD_TYPE STREQUAL "Debug")
  add_test(NAME downsample
    COMMAND downsample
      ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
      ${CMAKE_CURRENT_BINARY_DIR}/cthead1_downsampled.png
      --shrink-factors 2 2
      )
endif()

add_test(NAME downsample-sigma
  COMMAND downsample-sigma
    ${CMAKE_CURRENT_BINARY_DIR}/downsample-sigma.json
    --shrink-factors 2 4
    )

add_test(NAME gaussian-kernel-radius
  COMMAND gaussian-kernel-radius
    ${CMAKE_CURRENT_BINARY_DIR}/gaussian-kernel-radius.json
    --size 64 64 32
    --sigma 2.0 4.0 2.0
    )

add_test(NAME downsample-bin-shrink
  COMMAND downsample-bin-shrink
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_BINARY_DIR}/cthead1_downsampled_bin_shrink.png
    --shrink-factors 2 2
    )

add_test(NAME downsample-label-image
  COMMAND downsample-label-image
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/2th_cthead1.png
    ${CMAKE_CURRENT_BINARY_DIR}/cthead1_downsampled_label_image.png
    --shrink-factors 2 2
    )

# Generate the resample-bounding-box inputs (fixed image, moving image, transform), then feed them
# to the pipeline. The pipeline's positional argument order (transform, fixed, moving, output) matches
# the option declaration order in resample-bounding-box.cxx. The generator is only built for the
# WASI/native toolchains (see above), so these tests are scoped to those toolchains as well; the
# in-memory Node/Python bindings exercise the pipeline for the Emscripten target instead.
if(NOT EMSCRIPTEN)
  add_test(NAME resample-bounding-box-generate-inputs
    COMMAND resample-bounding-box-generate-inputs
      ${CMAKE_CURRENT_BINARY_DIR}/rbb-fixed.iwi
      ${CMAKE_CURRENT_BINARY_DIR}/rbb-moving.iwi
      ${CMAKE_CURRENT_BINARY_DIR}/rbb-transform.iwt
      )

  add_test(NAME resample-bounding-box
    COMMAND resample-bounding-box
      ${CMAKE_CURRENT_BINARY_DIR}/rbb-transform.iwt
      ${CMAKE_CURRENT_BINARY_DIR}/rbb-fixed.iwi
      ${CMAKE_CURRENT_BINARY_DIR}/rbb-moving.iwi
      ${CMAKE_CURRENT_BINARY_DIR}/rbb-output.json
      --padding 1
      )

  set_tests_properties(resample-bounding-box PROPERTIES DEPENDS resample-bounding-box-generate-inputs)

  # 3D translation: generate the 3D inputs, then run the pipeline end-to-end through the dimension dispatch.
  add_test(NAME resample-bounding-box-generate-inputs-3d
    COMMAND resample-bounding-box-generate-inputs
      --case 3d-translation
      ${CMAKE_CURRENT_BINARY_DIR}/rbb-3d-fixed.iwi
      ${CMAKE_CURRENT_BINARY_DIR}/rbb-3d-moving.iwi
      ${CMAKE_CURRENT_BINARY_DIR}/rbb-3d-transform.iwt
      )

  add_test(NAME resample-bounding-box-3d
    COMMAND resample-bounding-box
      ${CMAKE_CURRENT_BINARY_DIR}/rbb-3d-transform.iwt
      ${CMAKE_CURRENT_BINARY_DIR}/rbb-3d-fixed.iwi
      ${CMAKE_CURRENT_BINARY_DIR}/rbb-3d-moving.iwi
      ${CMAKE_CURRENT_BINARY_DIR}/rbb-3d-output.json
      --padding 1
      )

  set_tests_properties(resample-bounding-box-3d PROPERTIES DEPENDS resample-bounding-box-generate-inputs-3d)

  # 2D affine rotation: transformed grid corners are non-axis-aligned, stressing full-boundary sampling.
  add_test(NAME resample-bounding-box-generate-inputs-rotation
    COMMAND resample-bounding-box-generate-inputs
      --case 2d-rotation
      ${CMAKE_CURRENT_BINARY_DIR}/rbb-rot-fixed.iwi
      ${CMAKE_CURRENT_BINARY_DIR}/rbb-rot-moving.iwi
      ${CMAKE_CURRENT_BINARY_DIR}/rbb-rot-transform.iwt
      )

  add_test(NAME resample-bounding-box-rotation
    COMMAND resample-bounding-box
      ${CMAKE_CURRENT_BINARY_DIR}/rbb-rot-transform.iwt
      ${CMAKE_CURRENT_BINARY_DIR}/rbb-rot-fixed.iwi
      ${CMAKE_CURRENT_BINARY_DIR}/rbb-rot-moving.iwi
      ${CMAKE_CURRENT_BINARY_DIR}/rbb-rot-output.json
      --padding 1
      )

  set_tests_properties(resample-bounding-box-rotation PROPERTIES DEPENDS resample-bounding-box-generate-inputs-rotation)

  # In-process unit test: asserts the exact regions for the 2D/3D/rotation cases and the Phase-04 hardening
  # (full-boundary sampling, symmetric padding, padding-independent corners, degenerate axis, instance reuse).
  add_test(NAME resample-bounding-box-test
    COMMAND resample-bounding-box-test
      )
endif()

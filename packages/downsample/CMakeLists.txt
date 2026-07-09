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
    ITKIOTransformInsightLegacy
    ITKIOTransformHDF5
    )
endif()

find_package(ITK REQUIRED
 COMPONENTS
   WebAssemblyInterface
   ITKSmoothing
   ITKImageGrid
   ITKImageFunction
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
  resample-to-reference
  resample
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

# Interpolator coverage: one self-contained test per interpolator, using
# cthead1.png as both the moving image and the reference geometry (identity
# transform), so every interpolator selection is exercised. Needs no new data.
# The linear case doubles as the pipeline smoke test.
add_test(NAME resample-to-reference-linear
  COMMAND resample-to-reference
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_BINARY_DIR}/cthead1_resampled_linear.png
    --interpolator linear
    )

add_test(NAME resample-to-reference-nearest-neighbor
  COMMAND resample-to-reference
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_BINARY_DIR}/cthead1_resampled_nearest_neighbor.png
    --interpolator nearest_neighbor
    )

add_test(NAME resample-to-reference-b-spline
  COMMAND resample-to-reference
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_BINARY_DIR}/cthead1_resampled_b_spline.png
    --interpolator b_spline
    )

add_test(NAME resample-to-reference-windowed-sinc
  COMMAND resample-to-reference
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_BINARY_DIR}/cthead1_resampled_windowed_sinc.png
    --interpolator windowed_sinc
    )

add_test(NAME resample-to-reference-gaussian
  COMMAND resample-to-reference
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_BINARY_DIR}/cthead1_resampled_gaussian.png
    --interpolator gaussian
    )

# Label-image interpolator on the existing multi-label test image.
add_test(NAME resample-to-reference-label-image
  COMMAND resample-to-reference
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/2th_cthead1.png
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/2th_cthead1.png
    ${CMAKE_CURRENT_BINARY_DIR}/2th_cthead1_resampled_label_image.png
    --interpolator label_image
    )

# Background value: exercise the --default-value flag on the filesystem/CLI path (the memory-IO
# pixel-value assertions live in the Node and Python suites). Identity resample onto the same grid.
add_test(NAME resample-to-reference-default-value
  COMMAND resample-to-reference
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_BINARY_DIR}/cthead1_resampled_default_value.png
    --interpolator linear
    --default-value 128
    )

# Parameter-driven resample onto an explicitly parameterized output grid. Each test exercises one
# grid-defaulting branch of resample.cxx using the already-present cthead1.png (256x256). The names are
# distinct from the resample-to-reference-* / resample-bounding-box-* tests so they can be run in
# isolation with an anchored -R regex.

# Auto-size branch: only --output-spacing is given, so the size is auto-computed to preserve the input's
# physical extent (256 * 1 / 2 = 128, so 128x128).
add_test(NAME resample-spacing-only
  COMMAND resample
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_BINARY_DIR}/cthead1_resample_spacing_only.png
    --output-spacing 2 2
    )

# Fully explicit grid: all four grid parameters provided (identity direction, origin at zero, 128x128).
add_test(NAME resample-explicit-grid
  COMMAND resample
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_BINARY_DIR}/cthead1_resample_explicit_grid.png
    --size 128 128
    --output-spacing 2 2
    --output-origin 0 0
    --output-direction 1 0 0 1
    )

# Full input-geometry fallback: no grid options, so the output reproduces the input grid (identity).
add_test(NAME resample-defaults
  COMMAND resample
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_BINARY_DIR}/cthead1_resample_defaults.png
    )

# Nearest-neighbor interpolator on the auto-size branch.
add_test(NAME resample-nearest-neighbor
  COMMAND resample
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_BINARY_DIR}/cthead1_resample_nearest_neighbor.png
    --output-spacing 2 2
    --interpolator nearest_neighbor
    )

# Background value on the CLI/filesystem path; spacing 1 1 keeps the input size.
add_test(NAME resample-default-value
  COMMAND resample
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/cthead1.png
    ${CMAKE_CURRENT_BINARY_DIR}/cthead1_resample_default_value.png
    --output-spacing 1 1
    --default-value 128
    )

# Label-image interpolator on the existing multi-label test image (full input-geometry fallback).
add_test(NAME resample-label-image
  COMMAND resample
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/2th_cthead1.png
    ${CMAKE_CURRENT_BINARY_DIR}/2th_cthead1_resample_label_image.png
    --interpolator label_image
    )

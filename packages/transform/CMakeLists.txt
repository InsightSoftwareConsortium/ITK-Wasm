cmake_minimum_required(VERSION 3.16)
project(itkwasm-downsample LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)

if(EMSCRIPTEN)
  set(io_components
    )
elseif(WASI)
  set(io_components
    )
else()
  set(io_components
    ITKTransformIO
    )
endif()

find_package(ITK REQUIRED
 COMPONENTS
   WebAssemblyInterface
   ${io_components}
 )
include(${ITK_USE_FILE})

foreach(transform
 "composite"
 "identity"
 "translation"
 "euler2d"
 "euler3d"
 "rigid2d"
 "rigid3d"
 "rigid3d-perspective"
 "versor-rigid3d"
 "versor"
 "scale"
 "scale-logarithmic"
 "scale-skew-versor3d"
 "similarity2d"
 "similarity3d"
 "quaternion-rigid"
 "affine"
 "scalable-affine"
 "azimuth-elevation-to-cartesian"
 "bspline"
 "bspline-smoothing-on-update-displacement-field"
 "constant-velocity-field"
 "displacement-field"
 "gaussian-smoothing-on-update-displacement-field"
 "gaussian-exponential-diffeomorphic"
 "velocity-field"
 "time-varying-velocity-field"
 "gaussian-smoothing-on-update-time-varying-velocity-field"
 )
  set(pipeline create-${transform}-transform)
  add_executable(${pipeline} create-transform.cxx)
  target_link_libraries(${pipeline} PUBLIC ${ITK_LIBRARIES})
  target_include_directories(${pipeline} PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

  # Convert transform name to a valid macro name by replacing hyphens with underscores
  string(REPLACE "-" "_" transform_macro ${transform})
  string(TOUPPER ${transform_macro} transform_macro)

  target_compile_definitions(${pipeline} PUBLIC
    -DTRANSFORM_NAME=${transform}
    -DTRANSFORM_${transform_macro}=1
    )
endforeach()

# Add affine-ops pipeline
add_executable(affine-ops affine-ops.cxx)
target_link_libraries(affine-ops PUBLIC ${ITK_LIBRARIES})
target_include_directories(affine-ops PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

enable_testing()
add_test(NAME create-translation-transform
  COMMAND create-translation-transform
    ${CMAKE_CURRENT_BINARY_DIR}/create-translation.iwt
    --dimension 2
    --parameters-type float32
    )

add_test(NAME create-affine-transform
  COMMAND create-affine-transform
    ${CMAKE_CURRENT_BINARY_DIR}/create-affine.iwt
    --dimension 3
    --parameters-type float64
    )

add_test(NAME create-affine-defaults
  COMMAND create-affine-transform
    ${CMAKE_CURRENT_BINARY_DIR}/create-affine-defaults.iwt
    )

add_test(NAME affine-ops-test
  COMMAND affine-ops
    ${CMAKE_CURRENT_BINARY_DIR}/create-affine.iwt
    ${CMAKE_CURRENT_SOURCE_DIR}/test/data/input/affine-ops-input.json
    ${CMAKE_CURRENT_BINARY_DIR}/affine-ops-output.iwt
  )

set_tests_properties(affine-ops-test PROPERTIES DEPENDS create-affine-transform)
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
 "euler-2d"
 "euler-3d"
 "rigid-2d"
 "rigid-3d"
 "rigid-3d-perspective"
 "versor-rigid-3d"
 "versor"
 "scale"
 "scale-logarithmic"
 "scale-skew-versor-3d"
 "similarity-2d"
 "similarity-3d"
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
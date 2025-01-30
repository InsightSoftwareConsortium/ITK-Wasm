#!/usr/bin/env bash

function die() {
    echo "$1"
    exit 1
}

if test "$OSTYPE" = "cygwin" || test "$OSTYPE" = "msys" || test "$OSTYPE" = "win32"; then
    echo "Windows platform detected ... adding \"/Zc:__cplusplus /DNOMINMAX\" to \$CXXFLAGS"
    export CXXFLAGS="/Zc:__cplusplus /Zc:preprocessor /DNOMINMAX"
fi

export ITK_WASM_DEV_DOCKER_TAG=${ITK_WASM_DEV_DOCKER_TAG:-$(echo $(date '+%Y%m%d')-$(git rev-parse --short HEAD))}

export ITK_WASM_DCMTK_REPOSITORY=${ITK_WASM_DCMTK_REPOSITORY:-"https://github.com/InsightSoftwareConsortium/DCMTK"}
# 20240311_DCMTK_PATCHES_FOR_ITK-wasm-3
export ITK_WASM_DCMTK_GIT_TAG=${ITK_WASM_DCMTK_GIT_TAG:-"2fe4dacbe9c343dba350fcff6eab365241636623"}

export ITK_WASM_ITK_REPOSITORY=${ITK_WASM_ITK_REPOSITORY:-"https://github.com/thewtex/ITK"}
export ITK_WASM_ITK_BRANCH=${ITK_WASM_ITK_BRANCH:-"itkwasm-2024-05-20-5db055d7ad3b-6"}

export ITK_WASM_NATIVE_WORKSPACE=${ITK_WASM_NATIVE_WORKSPACE:-$(pwd)/native}

export ITK_WASM_ITK_SOURCE_DIR=${ITK_WASM_ITK_SOURCE_DIR:-${ITK_WASM_NATIVE_WORKSPACE}/ITK}
export ITK_WASM_ITK_BUILD_DIR=${ITK_WASM_ITK_BUILD_DIR:-${ITK_WASM_NATIVE_WORKSPACE}/ITK-build}
mkdir -p ${ITK_WASM_ITK_BUILD_DIR} || die "Could not create ITK build directory"


export ITK_WASM_COMPARE_IMAGES_TEST_DATA_HASH=${ITK_WASM_COMPARE_IMAGES_TEST_DATA_HASH:-$(cat packages/compare-images/package.json | jq -e -r '."itk-wasm"."test-data-hash"')}
export ITK_WASM_COMPARE_IMAGES_TEST_DATA_URLS=${ITK_WASM_COMPARE_IMAGES_TEST_DATA_URLS:-$(cat packages/compare-images/package.json | jq -e -r '."itk-wasm"."test-data-urls" | join(" ")')}

export ITK_WASM_COMPARE_MESHES_TEST_DATA_HASH=${ITK_WASM_COMPARE_MESHES_TEST_DATA_HASH:-$(cat packages/compare-meshes/package.json | jq -e -r '."itk-wasm"."test-data-hash"')}
export ITK_WASM_COMPARE_MESHES_TEST_DATA_URLS=${ITK_WASM_COMPARE_MESHES_TEST_DATA_URLS:-$(cat packages/compare-meshes/package.json | jq -e -r '."itk-wasm"."test-data-urls" | join(" ")')}

export ITK_WASM_COMPRESS_STRINGIFY_TEST_DATA_HASH=${ITK_WASM_COMPRESS_STRINGIFY_TEST_DATA_HASH:-$(cat packages/compress-stringify/package.json | jq -e -r '."itk-wasm"."test-data-hash"')}
export ITK_WASM_COMPRESS_STRINGIFY_TEST_DATA_URLS=${ITK_WASM_COMPRESS_STRINGIFY_TEST_DATA_URLS:-$(cat packages/compress-stringify/package.json | jq -e -r '."itk-wasm"."test-data-urls" | join(" ")')}

export ITK_WASM_DICOM_TEST_DATA_HASH=${ITK_WASM_DICOM_TEST_DATA_HASH:-$(cat packages/dicom/package.json | jq -e -r '."itk-wasm"."test-data-hash"')}
export ITK_WASM_DICOM_TEST_DATA_URLS=${ITK_WASM_DICOM_TEST_DATA_URLS:-$(cat packages/dicom/package.json | jq -e -r '."itk-wasm"."test-data-urls" | join(" ")')}

export ITK_WASM_DOWNSAMPLE_TEST_DATA_HASH=${ITK_WASM_DOWNSAMPLE_TEST_DATA_HASH:-$(cat packages/downsample/package.json | jq -e -r '."itk-wasm"."test-data-hash"')}
export ITK_WASM_DOWNSAMPLE_TEST_DATA_URLS=${ITK_WASM_DOWNSAMPLE_TEST_DATA_URLS:-$(cat packages/downsample/package.json | jq -e -r '."itk-wasm"."test-data-urls" | join(" ")')}

export ITK_WASM_MESH_FILTERS_TEST_DATA_HASH=${ITK_WASM_MESH_FILTERS_TEST_DATA_HASH:-$(cat packages/mesh-filters/package.json | jq -e -r '."itk-wasm"."test-data-hash"')}
export ITK_WASM_MESH_FILTERS_TEST_DATA_URLS=${ITK_WASM_MESH_FILTERS_TEST_DATA_URLS:-$(cat packages/mesh-filters/package.json | jq -e -r '."itk-wasm"."test-data-urls" | join(" ")')}

export ITK_WASM_IMAGE_IO_TEST_DATA_HASH=${ITK_WASM_IMAGE_IO_TEST_DATA_HASH:-$(cat packages/image-io/package.json | jq -e -r '."itk-wasm"."test-data-hash"')}
export ITK_WASM_IMAGE_IO_TEST_DATA_URLS=${ITK_WASM_IMAGE_IO_TEST_DATA_URLS:-$(cat packages/image-io/package.json | jq -e -r '."itk-wasm"."test-data-urls" | join(" ")')}

export ITK_WASM_MESH_IO_TEST_DATA_HASH=${ITK_WASM_MESH_IO_TEST_DATA_HASH:-$(cat packages/mesh-io/package.json | jq -e -r '."itk-wasm"."test-data-hash"')}
export ITK_WASM_MESH_IO_TEST_DATA_URLS=${ITK_WASM_MESH_IO_TEST_DATA_URLS:-$(cat packages/mesh-io/package.json | jq -e -r '."itk-wasm"."test-data-urls" | join(" ")')}

export ITK_WASM_TRANSFORM_IO_TEST_DATA_HASH=${ITK_WASM_TRANSFORM_IO_TEST_DATA_HASH:-$(cat packages/transform-io/package.json | jq -e -r '."itk-wasm"."test-data-hash"')}
export ITK_WASM_TRANSFORM_IO_TEST_DATA_URLS=${ITK_WASM_TRANSFORM_IO_TEST_DATA_URLS:-$(cat packages/transform-io/package.json | jq -e -r '."itk-wasm"."test-data-urls" | join(" ")')}

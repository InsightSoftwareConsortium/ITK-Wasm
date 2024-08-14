#!/usr/bin/env bash

function die() {
    echo "$1"
    exit 1
}

if [$OSTYPE == "cygwin"] || [$OSTYPE == "msys"] || [$OSTYPE =="win32"]; then
    echo "Windows platform detected ... adding \"/Zc:__cplusplus /DNOMINMAX\" to \$CXXFLAGS"
    export CXXFLAGS="/Zc:__cplusplus /DNOMINMAX"
fi

export ITK_WASM_DCMTK_REPOSITORY=${ITK_WASM_DCMTK_REPOSITORY:-"https://github.com/InsightSoftwareConsortium/DCMTK"}
export ITK_WASM_DCMTK_GIT_TAG=${ITK_WASM_DCMTK_GIT_TAG:-"fe7cff5de40b67ae0490d476ddf17689c06bcaf4"}

export ITK_WASM_ITK_REPOSITORY=${ITK_WASM_ITK_REPOSITORY:-"https://github.com/KitwareMedical/ITK"}
export ITK_WASM_ITK_BRANCH=${ITK_WASM_ITK_BRANCH:-"itkwasm-main-mutable"}

export ITK_WASM_NATIVE_WORKSPACE=${ITK_WASM_NATIVE_WORKSPACE:-$(pwd)/native}

export ITK_WASM_ITK_SOURCE_DIR=${ITK_WASM_ITK_SOURCE_DIR:-${ITK_WASM_NATIVE_WORKSPACE}/ITK}
export ITK_WASM_ITK_BUILD_DIR=${ITK_WASM_ITK_BUILD_DIR:-${ITK_WASM_NATIVE_WORKSPACE}/ITK-build}
mkdir -p ${ITK_WASM_ITK_BUILD_DIR} || die "Could not create ITK build directory"

#!/bin/bash
if [$OSTYPE == "cygwin"] || [$OSTYPE == "msys"] || [$OSTYPE =="win32"]; then
    echo "Windows platform detected ... adding \"/Zc:__cplusplus /DNOMINMAX\" to \$CXXFLAGS"
    export CXXFLAGS="/Zc:__cplusplus /DNOMINMAX"
fi
#if [[ "$OSTYPE" == "cygwin" || "$OSTYPE" == "msys" || "$OSTYPE" =="win32" ]]; then

cmake -BITK-build -SITK \
    -DBUILD_TESTING=OFF \
    -DCMAKE_CXX_STANDARD:STRING=17 \
    -DCMAKE_BUILD_TYPE:STRING=Debug \
    -DCMAKE_CONFIGURATION_TYPES:STRING=Debug \
    -DBUILD_EXAMPLES:BOOL=OFF \
    -DBUILD_TESTING:BOOL=OFF \
    -DBUILD_SHARED_LIBS=OFF \
    -DBUILD_STATIC_LIBS=ON \
    -DDCMTK_LINK_STATIC=ON \
    -DITK_LEGACY_REMOVE:BOOL=ON \
    -DITK_BUILD_DEFAULT_MODULES:BOOL=ON \
    -DITKGroup_IO:BOOL=ON \
    -DH5_HAVE_GETPWUID:BOOL=OFF \
    -DModule_ITKIOMINC:BOOL=ON \
    -DModule_MGHIO:BOOL=ON \
    -DModule_IOMeshSWC:BOOL=ON \
    -DModule_IOScanco:BOOL=ON \
    -DModule_IOFDF:BOOL=ON \
    -DModule_ITKDCMTK:BOOL=ON \
    -DModule_ITKImageFunction:BOOL=ON \
    -DModule_MinimalPathExtraction:BOOL=ON \
    -DModule_MorphologicalContourInterpolation:BOOL=ON \
    -DModule_SmoothingRecursiveYvvGaussianFilter:BOOL=ON \
    -DModule_Cuberille:BOOL=ON \
    -DModule_TotalVariation:BOOL=ON \
    -DModule_IOMeshSTL:BOOL=ON \
    -DModule_GenericLabelInterpolator:BOOL=ON \
    -DModule_MeshToPolyData=ON \
    -DDO_NOT_BUILD_ITK_TEST_DRIVER:BOOL=ON \
    -DOPJ_USE_THREAD:BOOL=OFF \
    -DDCMTK_WITH_THREADS:BOOL=OFF \
    -DDCMTK_BUILD_APPS:BOOL=OFF \
    -DNO_FLOAT_EXCEPTIONS:BOOL=ON \
    -DITK_MSVC_STATIC_RUNTIME_LIBRARY=ON

cmake --build ITK-build --config Debug -j16

cmake -BITK-Wasm-build \
    -SITK-Wasm \
    -DBUILD_TESTING=ON \
    -DCMAKE_CXX_STANDARD:STRING=20 \
    -DCMAKE_BUILD_TYPE:STRING=Debug \
    -DCMAKE_CONFIGURATION_TYPES:STRING=Debug \
    -DBUILD_SHARED_LIBS=OFF \
    -DITK_DIR=$PWD/ITK-build

cmake --build ITK-Wasm-build --config Debug -j16

cmake -Bpackages-dicom \
    -SITK-Wasm/packages/dicom \
    -DBUILD_TESTING=ON \
    -DCMAKE_CXX_STANDARD:STRING=20 \
    -DCMAKE_BUILD_TYPE:STRING=Debug \
    -DCMAKE_CONFIGURATION_TYPES:STRING=Debug \
    -DITK_DIR=$PWD/ITK-build

cmake --build packages-dicom --config Debug -j16

ctest --test-dir ITK-Wasm-build -C Debug


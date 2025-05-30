ARG BASE_IMAGE=docker.io/dockcross/web-wasm
ARG HOST_ARCH=amd64
FROM $BASE_IMAGE:20250123-74d1a0b-$HOST_ARCH
ARG BASE_IMAGE

LABEL maintainer="Matt McCormick matt@mmmccormick.com"
LABEL org.opencontainers.image.source="https://github.com/InsightSoftwareConsortium/ITK-Wasm"

WORKDIR /

COPY itk_wasm_env_vars.sh /
COPY wasi-toolchain.cmake /opt/wasi-sdk/Toolchain.cmake

# Note: on entry, emsdk will prepend to the path with its own node, so add to an earlier path
ENV NODE_TAG=v22.9.0
COPY install-node-js.sh /usr/local/bin/
RUN /usr/local/bin/install-node-js.sh && rm /usr/local/bin/install-node-js.sh
ENV PATH=/emsdk/upstream/emscripten:${PATH}
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest && corepack enable

ENV zstd_GIT_TAG=v1.5.5
RUN curl -L https://api.github.com/repos/facebook/zstd/tarball/${zstd_GIT_TAG} | tar xz --strip=1 --one-top-level=zstd && \
  mkdir zstd-build && \
  cd zstd-build && \
  CC=cc CXX=c++ /usr/bin/cmake \
    -G Ninja \
    -DCMAKE_INSTALL_PREFIX:PATH=/usr \
    -DZSTD_BUILD_SHARED:BOOL=OFF \
    -DCMAKE_TOOLCHAIN_FILE="" \
    ../zstd/build/cmake/ && \
  ninja && \
  ninja install && \
  cd .. && \
  rm -rf zstd-build zstd

RUN . /itk_wasm_env_vars.sh && git clone --branch $ITK_WASM_ITK_BRANCH --single-branch --depth 1 $ITK_WASM_ITK_REPOSITORY && \
  sed -i -e '/^option(OPJ_USE_THREAD/c\option(OPJ_USE_THREAD "use threads" OFF)' \
    /ITK/Modules/ThirdParty/GDCM/src/gdcm/Utilities/gdcmopenjpeg/src/lib/openjp2/CMakeLists.txt

# Modify CMake variable to use patched DCMTK library
# GIT_TAG refers to DCMTK branch: 20240311_DCMTK_PATCHES_FOR_ITK-Wasm-1
RUN . /itk_wasm_env_vars.sh && sed -i -e "/^set(DCMTK_GIT_REPOSITORY/c\set(DCMTK_GIT_REPOSITORY \"${ITK_WASM_DCMTK_REPOSITORY}\")" \
    /ITK/Modules/ThirdParty/DCMTK/DCMTKGitTag.cmake

RUN . /itk_wasm_env_vars.sh && sed -i -e "/^set(DCMTK_GIT_TAG/c\set(DCMTK_GIT_TAG \"${ITK_WASM_DCMTK_GIT_TAG}\")" \
    /ITK/Modules/ThirdParty/DCMTK/DCMTKGitTag.cmake

ARG CMAKE_BUILD_TYPE=Release

ARG LDFLAGS="-flto -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=4GB"
ARG CFLAGS="-msimd128 -flto -Wno-warn-absolute-paths -DITK_WASM_NO_FILESYSTEM_IO"
ENV LDFLAGS=$LDFLAGS
ENV CFLAGS=$CFLAGS
ENV CXXFLAGS=$CFLAGS

RUN mkdir ITK-build && \
  cd ITK-build && \
  cmake \
    -G Ninja \
    -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLCHAIN_FILE} \
    -DCMAKE_CXX_STANDARD:STRING=20 \
    -DCMAKE_INSTALL_PREFIX:PATH=/usr \
    -DCMAKE_BUILD_TYPE:STRING=$CMAKE_BUILD_TYPE \
    -DBUILD_EXAMPLES:BOOL=OFF \
    -DBUILD_TESTING:BOOL=OFF \
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
    -DModule_ITKIOTransformMINC:BOOL=ON \
    -DModule_ITKImageFunction:BOOL=ON \
    -DModule_MinimalPathExtraction:BOOL=ON \
    -DModule_MorphologicalContourInterpolation:BOOL=ON \
    -DModule_SmoothingRecursiveYvvGaussianFilter:BOOL=ON \
    -DModule_Cuberille:BOOL=ON \
    -DModule_TotalVariation:BOOL=ON \
    -DModule_IOMeshSTL:BOOL=ON \
    -DModule_IOMeshMZ3:BOOL=ON \
    -DModule_GenericLabelInterpolator:BOOL=ON \
    -DDO_NOT_BUILD_ITK_TEST_DRIVER:BOOL=ON \
    -DOPJ_USE_THREAD:BOOL=OFF \
    -DDCMTK_WITH_THREADS:BOOL=OFF \
    -DDCMTK_BUILD_APPS:BOOL=OFF \
    -DNO_FLOAT_EXCEPTIONS:BOOL=ON \
    -DCMAKE_C_FLAGS:STRING="${CFLAGS}" \
    -DCMAKE_CXX_FLAGS:STRING="${CXXFLAGS}" \
    -DCMAKE_EXE_LINKER_FLAGS:STRING="${LDFLAGS}" \
    ../ITK && \
  ninja && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 ITK-build

ENV ITKMeshToPolyData_GIT_TAG=1e594b7437a43be348b0ccea827c66fb5aa13e1f
RUN git clone https://github.com/InsightSoftwareConsortium/ITKMeshToPolyData.git && \
  cd ITKMeshToPolyData && \
  git checkout ${ITKMeshToPolyData_GIT_TAG} && \
  cd / && \
  mkdir ITKMeshToPolyData-build && \
  cd ITKMeshToPolyData-build && \
  cmake \
    -G Ninja \
    -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLCHAIN_FILE} \
    -DCMAKE_CXX_STANDARD:STRING=20 \
    -DCMAKE_INSTALL_PREFIX:PATH=/usr \
    -DCMAKE_BUILD_TYPE:STRING=$CMAKE_BUILD_TYPE \
    -DBUILD_TESTING:BOOL=OFF \
    -DITK_DIR:PATH=/ITK-build \
    -DCMAKE_C_FLAGS:STRING="${CFLAGS}" \
    -DCMAKE_CXX_FLAGS:STRING="${CXXFLAGS}" \
    -DCMAKE_EXE_LINKER_FLAGS:STRING="${LDFLAGS}" \
    ../ITKMeshToPolyData && \
  ninja && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 ITK-build

ENV wasm_tools_GIT_TAG=1.224.1
COPY install-wasm-tools.sh /usr/local/bin/
RUN /usr/local/bin/install-wasm-tools.sh && rm /usr/local/bin/install-wasm-tools.sh

# Build-time metadata as defined at http://label-schema.org
ARG BUILD_DATE
ARG IMAGE=itkwasm/base
ARG VERSION=latest
ARG VCS_REF
ARG VCS_URL
LABEL org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.name=$IMAGE \
      org.label-schema.version=$VERSION \
      org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.vcs-url=$VCS_URL \
      org.label-schema.schema-version="1.0"
ENV DEFAULT_DOCKCROSS_IMAGE=${IMAGE}:${VERSION}
WORKDIR /work

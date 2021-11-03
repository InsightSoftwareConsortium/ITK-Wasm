ARG BASE_IMAGE=dockcross/web-wasm
FROM $BASE_IMAGE:20211103-ed2c1eb
ARG BASE_IMAGE

LABEL maintainer="Matt McCormick <matt.mccormick@kitware.com>"
LABEL org.opencontainers.image.source="https://github.com/InsightSoftwareConsortium/itk-wasm"

WORKDIR /

# 2021-10-03 master branch
ENV ITK_GIT_TAG 3b68b2092bc2db2978a1ed68efe5ec38fcade185
RUN git clone https://github.com/thewtex/ITK.git && \
  cd ITK && \
  git checkout ${ITK_GIT_TAG} && \
  cd ../ && \
  sed -i -e '/^option(OPJ_USE_THREAD/c\option(OPJ_USE_THREAD "use threads" OFF)' \
    /ITK/Modules/ThirdParty/GDCM/src/gdcm/Utilities/gdcmopenjpeg/src/lib/openjp2/CMakeLists.txt
ARG CMAKE_BUILD_TYPE=Release

# For SlicerExecutionModel
RUN mkdir ITK-Native-build && \
  cd ITK-Native-build && \
  /usr/bin/cmake \
    -G Ninja \
    -DCMAKE_INSTALL_PREFIX:PATH=/usr \
    -DBUILD_EXAMPLES:BOOL=OFF \
    -DBUILD_TESTING:BOOL=OFF \
    -DITK_LEGACY_REMOVE:BOOL=ON \
    -DITK_BUILD_DEFAULT_MODULES:BOOL=OFF \
    -DITKGroup_Core:BOOL=ON \
    -DModule_ITKCommon:BOOL=ON \
    -DModule_ITKIOXML:BOOL=ON \
    -DModule_ITKExpat:BOOL=ON \
    -DCMAKE_C_COMPILER=/usr/bin/cc \
    -DCMAKE_CXX_COMPILER=/usr/bin/c++ \
    -DCMAKE_TOOLCHAIN_FILE="" \
    ../ITK && \
  ninja && \
  find . -name '*.o' -delete && \
  cd ..

ENV SlicerExecutionModel_GIT_TAG dbc39c049b3721c5f3ea80f20acd32e3c8cc65f3
RUN git clone https://github.com/thewtex/SlicerExecutionModel.git && \
  cd SlicerExecutionModel && \
  git checkout ${SlicerExecutionModel_GIT_TAG} && \
  cd ../ && \
  mkdir SlicerExecutionModel-build && \
  cd SlicerExecutionModel-build && \
  /usr/bin/cmake \
    -G Ninja \
    -DSlicerExecutionModel_USE_JSONCPP:BOOL=OFF \
    -DCMAKE_BUILD_TYPE:STRING=$CMAKE_BUILD_TYPE \
    -DBUILD_SHARED_LIBS:BOOL=OFF \
    -DCMAKE_INSTALL_PREFIX:PATH=/install-prefix \
    -DBUILD_TESTING:BOOL=OFF \
    -DITK_DIR:PATH=/ITK-Native-build \
    -DCMAKE_C_COMPILER=/usr/bin/cc \
    -DCMAKE_CXX_COMPILER=/usr/bin/c++ \
    -DCMAKE_TOOLCHAIN_FILE="" \
    ../SlicerExecutionModel && \
  ninja && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 SlicerExecutionModel-build

ARG LDFLAGS
ARG CFLAGS
ARG CXXFLAGS
ENV LDFLAGS=${LDFLAGS:-"-flto -s ALLOW_MEMORY_GROWTH=1"}
ENV CFLAGS=${CFLAGS:-"-flto -Wno-warn-absolute-paths --memory-init-file 0"}
ENV CXXFLAGS=${CXXFLAGS:-"${CFLAGS}"}

RUN mkdir ITK-build && \
  cd ITK-build && \
  cmake \
    -G Ninja \
    -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLCHAIN_FILE} \
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
    -DModule_IOScanco:BOOL=ON \
    -DModule_IOFDF:BOOL=ON \
    -DModule_ITKImageFunction:BOOL=ON \
    -DModule_SmoothingRecursiveYvvGaussianFilter:BOOL=ON \
    -DModule_MorphologicalContourInterpolation:BOOL=ON \
    -DModule_Cuberille:BOOL=ON \
    -DModule_TotalVariation:BOOL=ON \
    -DModule_IOMeshSTL:BOOL=ON \
    -DModule_GenericLabelInterpolator:BOOL=ON \
    -DDO_NOT_BUILD_ITK_TEST_DRIVER:BOOL=ON \
    -DOPJ_USE_THREAD:BOOL=OFF \
    ../ITK && \
  ninja && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 ITK-build

ENV ITKMeshToPolyData_GIT_TAG 8e04b0ae48a6b97b928c54cfa96feb0c87d0ccf0
RUN git clone https://github.com/InsightSoftwareConsortium/ITKMeshToPolyData.git && \
  cd ITKMeshToPolyData && \
  git checkout ${ITKMeshToPolyData_GIT_TAG} && \
  cd / && \
  mkdir ITKMeshToPolyData-build && \
  cd ITKMeshToPolyData-build && \
  cmake \
    -G Ninja \
    -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLCHAIN_FILE} \
    -DCMAKE_INSTALL_PREFIX:PATH=/usr \
    -DCMAKE_BUILD_TYPE:STRING=$CMAKE_BUILD_TYPE \
    -DBUILD_TESTING:BOOL=OFF \
    -DITK_DIR:PATH=/ITK-build \
    ../ITKMeshToPolyData && \
  ninja && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 ITK-build

ENV RAPIDJSON_GIT_TAG 0d4517f15a8d7167ba9ae67f3f22a559ca841e3b
RUN git clone https://github.com/Tencent/rapidjson.git && \
  cd rapidjson && \
  git checkout ${RAPIDJSON_GIT_TAG}

ENV IPFS_TAG v0.10.0
RUN curl -LO https://github.com/ipfs/go-ipfs/releases/download/${IPFS_TAG}/go-ipfs_${IPFS_TAG}_linux-amd64.tar.gz && \
  tar xvzf go-ipfs_${IPFS_TAG}_linux-amd64.tar.gz && \
  cp go-ipfs/ipfs /usr/local/bin/ && \
  rm -rf go-ipfs
ENV IPFS_PATH /home/ipfs/.ipfs
RUN mkdir -p $IPFS_PATH && \
 ipfs init && \
 chmod -R 777 $IPFS_PATH

RUN mkdir /wasm-runtimes

ENV WASMER_DIR /wasm-runtimes/wasmer
RUN curl https://get.wasmer.io -sSfL | sh
COPY wasmer-pwd.sh ${WASMER_DIR}/bin/
ENV PATH "$WASMER_DIR/bin:$PATH"

ENV WASMTIME_HOME /wasm-runtimes/wasmtime
RUN mkdir ${WASMTIME_HOME} && curl https://wasmtime.dev/install.sh -sSf | bash
COPY wasmtime-pwd.sh ${WASMTIME_HOME}/bin/
ENV PATH "$WASMTIME_HOME/bin:$PATH"

ENV WASM3_VERSION 0.5.0
RUN mkdir -p /wasm-runtimes/wasm3/bin && \
  curl -LO https://github.com/wasm3/wasm3/releases/download/v${WASM3_VERSION}/wasm3-linux-x64.elf && \
  mv wasm3-linux-x64.elf /wasm-runtimes/wasm3/bin/wasm3 && \
  chmod +x /wasm-runtimes/wasm3/bin/wasm3
ENV PATH "/wasm-runtimes/wasm3/bin:$PATH"

ENV WAVM_VERSION 2021-10-16
RUN mkdir -p /wasm-runtimes/wavm/ && \
  curl -LO https://github.com/WAVM/WAVM/releases/download/nightly%2F${WAVM_VERSION}/wavm-0.0.0-prerelease-linux.tar.gz && \
  tar -xv -C /wasm-runtimes/wavm/ -f wavm-0.0.0-prerelease-linux.tar.gz
ENV PATH "/wasm-runtimes/wavm/bin:$PATH"

# Build-time metadata as defined at http://label-schema.org
ARG BUILD_DATE
ARG IMAGE=insighttoolkit/itk-wasm-base
ARG VERSION=latest
ARG VCS_REF
ARG VCS_URL
LABEL org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.name=$IMAGE \
      org.label-schema.version=$VERSION \
      org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.vcs-url=$VCS_URL \
      org.label-schema.schema-version="1.0"
ENV DEFAULT_DOCKCROSS_IMAGE ${IMAGE}:${VERSION}
WORKDIR /work

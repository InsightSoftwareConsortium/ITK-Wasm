FROM dockcross/web-wasm:20211005-32b58e0

LABEL maintainer="Matt McCormick <matt.mccormick@kitware.com>"
LABEL org.opencontainers.image.source="https://github.com/InsightSoftwareConsortium/itk-js"

WORKDIR /

# 2021-10-03 master branch
ENV ITK_GIT_TAG 5121ee04ac8e66e56e574c13d95e1b728adcf17c
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
  ninja -j7 && \
  find . -name '*.o' -delete && \
  cd ..

ENV jsoncpp_GIT_TAG 940982438d01fe2575acef8dd98a9b6893ccc9bb
RUN git clone https://github.com/open-source-parsers/jsoncpp.git && \
  cd jsoncpp && \
  git checkout ${jsoncpp_GIT_TAG} && \
  cd ../ && \
  mkdir jsoncpp-build && \
  cd jsoncpp-build && \
  /usr/bin/cmake \
    -G Ninja \
    -DCMAKE_BUILD_TYPE:STRING=$CMAKE_BUILD_TYPE \
    -DBUILD_SHARED_LIBS:BOOL=OFF \
    -DCMAKE_INSTALL_PREFIX:PATH=/install-prefix \
    -DBUILD_TESTING:BOOL=OFF \
    -DJSONCPP_WITH_POST_BUILD_UNITTEST:BOOL=OFF \
    -DCMAKE_CXX_COMPILER=/usr/bin/c++ \
    -DCMAKE_TOOLCHAIN_FILE="" \
    ../jsoncpp && \
  ninja -j7 && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 jsoncpp-build

ENV SlicerExecutionModel_GIT_TAG dbc39c049b3721c5f3ea80f20acd32e3c8cc65f3
RUN git clone https://github.com/thewtex/SlicerExecutionModel.git && \
  cd SlicerExecutionModel && \
  git checkout ${SlicerExecutionModel_GIT_TAG} && \
  cd ../ && \
  mkdir SlicerExecutionModel-build && \
  cd SlicerExecutionModel-build && \
  /usr/bin/cmake \
    -G Ninja \
    -DJsonCpp_INCLUDE_DIR:FILEPATH=/jsoncpp/include \
    -DJsonCpp_LIBRARY:PATH=/jsoncpp-build/lib/libjsoncpp.a \
    -DSlicerExecutionModel_USE_JSONCPP:BOOL=ON \
    -DCMAKE_BUILD_TYPE:STRING=$CMAKE_BUILD_TYPE \
    -DBUILD_SHARED_LIBS:BOOL=OFF \
    -DCMAKE_INSTALL_PREFIX:PATH=/install-prefix \
    -DBUILD_TESTING:BOOL=OFF \
    -DITK_DIR:PATH=/ITK-Native-build \
    -DCMAKE_C_COMPILER=/usr/bin/cc \
    -DCMAKE_CXX_COMPILER=/usr/bin/c++ \
    -DCMAKE_TOOLCHAIN_FILE="" \
    ../SlicerExecutionModel && \
  ninja -j7 && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 SlicerExecutionModel-build

# After the WASI exception / setjmp support may work? setjmp is lost in final
# linking otherwise.
#ENV LDFLAGS="-flto -s ALLOW_MEMORY_GROWTH=1"
#ENV CFLAGS="-Wno-warn-absolute-paths --memory-init-file 0 -flto"
#ENV LDFLAGS="-flto=thin -s ALLOW_MEMORY_GROWTH=1"
ENV LDFLAGS="-s ALLOW_MEMORY_GROWTH=1"
ENV CFLAGS="-Wno-warn-absolute-paths --memory-init-file 0"
ENV CXXFLAGS="${CFLAGS}"
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
  ninja -j7 && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 ITK-build

ENV RAPIDJSON_GIT_TAG v1.1.0
RUN git clone https://github.com/Tencent/rapidjson.git && \
  cd rapidjson && \
  git checkout ${RAPIDJSON_GIT_TAG}

ENV IPFS_TAG v0.10.0
RUN curl -O https://ipfs.io/ipns/dist.ipfs.io/go-ipfs/${IPFS_TAG}/go-ipfs_${IPFS_TAG}_linux-amd64.tar.gz && \
  tar xvzf go-ipfs_${IPFS_TAG}_linux-amd64.tar.gz && \
  cp go-ipfs/ipfs /usr/local/bin/ && \
  rm -rf go-ipfs
ENV IPFS_PATH /home/emscripten/.ipfs
RUN ipfs init
RUN chmod -R 777 $IPFS_PATH

# Build-time metadata as defined at http://label-schema.org
ARG BUILD_DATE
ARG IMAGE=insighttoolkit/itk-js-base
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

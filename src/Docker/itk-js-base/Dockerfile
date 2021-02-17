FROM dockcross/web-wasm:20200511-ba6b062
MAINTAINER Matt McCormick <matt.mccormick@kitware.com>

ARG CMAKE_BUILD_TYPE=Release
ARG USE_DCMTK=ON

WORKDIR /

# 2020-04-27 release branch
ENV ITK_GIT_TAG v5.1.0
RUN git clone https://github.com/InsightSoftwareConsortium/ITK.git && \
  cd ITK && \
  git checkout ${ITK_GIT_TAG} && \
  cd ../ && \
  sed -i -e '/^option(OPJ_USE_THREAD/c\option(OPJ_USE_THREAD "use threads" OFF)' \
    /ITK/Modules/ThirdParty/GDCM/src/gdcm/Utilities/gdcmopenjpeg/src/lib/openjp2/CMakeLists.txt

# For SlicerExecutionModel
RUN mkdir ITK-Native-build && \
  cd ITK-Native-build && \
  CC=/usr/bin/cc CXX=/usr/bin/c++ /usr/bin/cmake \
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
  CC=/usr/bin/cc CXX=/usr/bin/c++ /usr/bin/cmake \
    -G Ninja \
    -DCMAKE_BUILD_TYPE:STRING=$CMAKE_BUILD_TYPE \
    -DBUILD_SHARED_LIBS:BOOL=OFF \
    -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLCHAIN_FILE} \
    -DCMAKE_INSTALL_PREFIX:PATH=/install-prefix \
    -DBUILD_TESTING:BOOL=OFF \
    -DJSONCPP_WITH_POST_BUILD_UNITTEST:BOOL=OFF \
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
  CC=/usr/bin/cc CXX=/usr/bin/c++ /usr/bin/cmake \
    -G Ninja \
    -DJsonCpp_INCLUDE_DIR:FILEPATH=/jsoncpp/include \
    -DJsonCpp_LIBRARY:PATH=/jsoncpp-build/lib/libjsoncpp.a \
    -DSlicerExecutionModel_USE_JSONCPP:BOOL=ON \
    -DCMAKE_BUILD_TYPE:STRING=$CMAKE_BUILD_TYPE \
    -DBUILD_SHARED_LIBS:BOOL=OFF \
    -DCMAKE_INSTALL_PREFIX:PATH=/install-prefix \
    -DBUILD_TESTING:BOOL=OFF \
    -DITK_DIR:PATH=/ITK-Native-build \
    ../SlicerExecutionModel && \
  ninja -j7 && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 SlicerExecutionModel-build

ENV CFLAGS="-Wno-warn-absolute-paths --memory-init-file 0 -s WASM=0 -lnodefs.js -Wno-almost-asm "
ENV CXXFLAGS="${CFLAGS} -std=c++14"
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
    -DModule_ITKIODCMTK:BOOL=$USE_DCMTK \
    -DDCMTK_USE_ICU:BOOL=OFF \
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
    -DOPJ_USE_THREAD:BOOL=OFF \
    ../ITK && \
  ninja -j7 && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 ITK-build
ENV CFLAGS="${CFLAGS} -s ALLOW_MEMORY_GROWTH=1"
ENV CXXFLAGS="${CXXFLAGS} -s ALLOW_MEMORY_GROWTH=1"

ENV RAPIDJSON_GIT_TAG v1.1.0
RUN git clone https://github.com/Tencent/rapidjson.git && \
  cd rapidjson && \
  git checkout ${RAPIDJSON_GIT_TAG}

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

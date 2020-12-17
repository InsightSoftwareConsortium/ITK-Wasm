FROM dockcross/web-wasm:20200511-ba6b062
MAINTAINER Matt McCormick <matt.mccormick@kitware.com>

WORKDIR /

# 2020-04-27 release branch
ENV ITK_GIT_TAG v5.1.0
ENV CFLAGS="-Wno-warn-absolute-paths --memory-init-file 0 -s WASM=0 -lnodefs.js -Wno-almost-asm "
ENV CXXFLAGS="${CFLAGS} -std=c++14"
RUN git clone https://github.com/InsightSoftwareConsortium/ITK.git && \
  cd ITK && \
  git checkout ${ITK_GIT_TAG} && \
  cd ../ && \
  sed -i -e '/^option(OPJ_USE_THREAD/c\option(OPJ_USE_THREAD "use threads" OFF)' \
    /ITK/Modules/ThirdParty/GDCM/src/gdcm/Utilities/gdcmopenjpeg/src/lib/openjp2/CMakeLists.txt && \
  mkdir ITK-build && \
  cd ITK-build && \
  cmake \
    -G Ninja \
    -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLCHAIN_FILE} \
    -DCMAKE_INSTALL_PREFIX:PATH=/usr \
    -DBUILD_EXAMPLES:BOOL=OFF \
    -DBUILD_TESTING:BOOL=OFF \
    -DITK_LEGACY_REMOVE:BOOL=ON \
    -DITK_BUILD_DEFAULT_MODULES:BOOL=ON \
    -DITKGroup_IO:BOOL=ON \
    -DH5_HAVE_GETPWUID:BOOL=OFF \
    -DModule_ITKIODCMTK:BOOL=ON \
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

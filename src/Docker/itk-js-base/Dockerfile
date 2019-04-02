FROM dockcross/web-wasm:20190310-7ff84ba
MAINTAINER Insight Software Consortium <community@itk.org>

WORKDIR /

# 2019-03-07
ENV ITK_GIT_TAG 036492cfad580004a280331ebaced97b380eda0a
ENV CFLAGS="-Wno-warn-absolute-paths --memory-init-file 0 -s ALLOW_MEMORY_GROWTH=1 -Wno-almost-asm -s WASM=0"
ENV CXXFLAGS="${CFLAGS} -std=c++11"
RUN git clone https://github.com/InsightSoftwareConsortium/ITK.git && \
  cd ITK && \
  git checkout ${ITK_GIT_TAG} && \
  cd ../ && \
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
    -DModule_ITKIODCMTK:BOOL=ON \
    -DDCMTK_USE_ICU:BOOL=OFF \
    -DModule_ITKIOMINC:BOOL=ON \
    -DModule_MGHIO:BOOL=ON \
    -DModule_ITKImageFunction:BOOL=ON \
    -DModule_SmoothingRecursiveYvvGaussianFilter:BOOL=ON \
    -DModule_MorphologicalContourInterpolation:BOOL=ON \
    ../ITK && \
  ninja -j7 && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 ITK-build

ENV ITKIOMeshSTL_GIT_TAG 3153ccadce3452c047248687909b74d96211048b
RUN git clone https://github.com/InsightSoftwareConsortium/ITKIOMeshSTL.git && \
  cd ITKIOMeshSTL && \
  git checkout ${ITKIOMeshSTL_GIT_TAG} && \
  cd ../ && \
  mkdir ITKIOMeshSTL-build && \
  cd ITKIOMeshSTL-build && \
  cmake -G Ninja \
    -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLCHAIN_FILE} \
    -DCMAKE_INSTALL_PREFIX:PATH=/usr \
    -DITK_DIR:PATH=/ITK-build \
    ../ITKIOMeshSTL && \
  ninja -j7 && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 ITK-build

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

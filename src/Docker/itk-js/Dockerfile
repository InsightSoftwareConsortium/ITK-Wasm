ARG CMAKE_BUILD_TYPE=Release
ARG BASE_TAG=latest

FROM insighttoolkit/itk-js-base:$BASE_TAG
MAINTAINER Insight Software Consortium <community@itk.org>

WORKDIR /

ADD ITKBridgeJavaScriptModuleCopy /ITKBridgeJavaScript
RUN cd / && \
  mkdir ITKBridgeJavaScript-build && \
  cd ITKBridgeJavaScript-build && \
  cmake \
    -G Ninja \
    -DITK_DIR=/ITK-build \
    -DRapidJSON_INCLUDE_DIR=/rapidjson/include \
    -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLCHAIN_FILE} \
    -DCMAKE_BUILD_TYPE:STRING=$CMAKE_BUILD_TYPE \
      ../ITKBridgeJavaScript && \
  ninja -j7 && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 ITKBridgeJavaScript-build

COPY ITKBridgeJavaScript.cmake /usr/share/cmake-3.17/Modules/
ENV CMAKE_TOOLCHAIN_FILE_DOCKCROSS ${CMAKE_TOOLCHAIN_FILE}
ENV CMAKE_TOOLCHAIN_FILE_ITK /ITKBridgeJavaScript/toolchain.cmake
RUN cp ${CMAKE_TOOLCHAIN_FILE} ${CMAKE_TOOLCHAIN_FILE_ITK}
RUN echo "include(ITKBridgeJavaScript)" >> ${CMAKE_TOOLCHAIN_FILE_ITK}
ENV CMAKE_TOOLCHAIN_FILE ${CMAKE_TOOLCHAIN_FILE_ITK}
COPY web-build /usr/local/bin/

# Build-time metadata as defined at http://label-schema.org
ARG BUILD_DATE
ARG IMAGE=insighttoolkit/itk-js
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

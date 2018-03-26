FROM insighttoolkit/itk-js-base:latest
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
    -DCMAKE_BUILD_TYPE=Release \
      ../ITKBridgeJavaScript && \
  ninja -j7 && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 ITKBridgeJavaScript-build

COPY ITKBridgeJavaScript.cmake /usr/share/cmake-3.10/Modules/
COPY web-build /usr/local/bin/

ENV DEFAULT_DOCKCROSS_IMAGE insighttoolkit/itk-js
WORKDIR /work

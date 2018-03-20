FROM dockcross/browser-asmjs:latest
MAINTAINER Insight Software Consortium <community@itk.org>

WORKDIR /

ENV ITKBridgeJavaScript_GIT_TAG 847cd6a64c71a159b3a9c35236092157a9bf6fc8
RUN git clone https://github.com/InsightSoftwareConsortium/itk-js.git ITKBridgeJavaScript && \
  cd ITKBridgeJavaScript && \
  git checkout ${ITKBridgeJavaScript_GIT_TAG} && \
  cd ../ && \
  mkdir ITKBridgeJavaScript-build && \
  cd ITKBridgeJavaScript-build && \
  cmake \
    -G Ninja \
    -DITK_DIR=/ITK-build \
    -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLCHAIN_FILE} \
    -DCMAKE_BUILD_TYPE=Release \
      ../ITKBridgeJavaScript && \
  ninja -j7 && \
  find . -name '*.o' -delete && \
  cd .. && chmod -R 777 ITKBridgeJavScript-build

COPY ITKBridgeJavaScript.cmake /usr/share/cmake-3.10/Modules/
COPY web-build /usr/local/bin/

ENV DEFAULT_DOCKCROSS_IMAGE insighttoolkit/itk-js
WORKDIR /work

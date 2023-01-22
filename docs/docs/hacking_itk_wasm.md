# Hacking itk-wasm

Thank you for contributing a pull request!

**Welcome to the ITK community!**

We are glad you are here and appreciate your contribution. Please keep in mind our [community participation guidelines](https://github.com/InsightSoftwareConsortium/ITK/blob/main/CODE_OF_CONDUCT.md).

### Build dependencies

- [Node.js / NPM](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/install/)
  * On Linux, make sure you can run [`docker` without `sudo`](https://askubuntu.com/questions/477551/how-can-i-use-docker-without-sudo).
  * On Windows, we recommend [WSL 2 with Docker enabled](https://docs.docker.com/desktop/windows/wsl/).
- Bash

### Building

To build itk-wasm itself:
```sh
npm install
npm run build
```

Run the tests:
```sh
npm test
```

Serve the documentation:
```sh
npm i -g docsify
docsify serve ./docs/
```

Create a debug build (see also: [the debugging example](/examples/debugging)):
```sh
git clean -fdx
# pull the latest debug Docker images
./src/docker/pull.sh
npm run build:debug
```

### Add test data

To prevent Git repository bloat, we add testing data through [CMake content links](https://blog.kitware.com/cmake-externaldata-using-large-files-with-distributed-version-control/) of [Content Identifiers (CIDs)](https://proto.school/anatomy-of-a-cid). To add new test data,

1. Upload the data and download its content link *.cid* file with the [CMake w3 ExternalData Upload Tool](https://cmake-w3-externaldata-upload.on.fleek.co/)
2. Move the *.cid* file to *itk-wasm/test/Input/*
3. Reference the content link with a `DATA{<path>}` call in *itk-wasm/test/CMakeLists.txt*.

### Contributing

We use [semantic-release](https://github.com/semantic-release/semantic-release) for handling the change log and version. Therefore, we recommend using the following command line when creating a commit:

```sh
$ npm run commit
```

Otherwise you can follow the specification available [here](https://gist.github.com/stephenparish/9941e89d80e2bc58a153).

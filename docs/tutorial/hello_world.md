# Hello Wasm World!

## Introduction

This example walks through how to compile a *hello world* executable written in C++ to [WebAssembly](https://webassembly.org/) and how to execute it with standalone WebAssembly runtimes, the Node.js JavaScript runtime, and web browser runtimes!

Before getting started, make sure [Node.js](https://nodejs.org/en/download/) and [Docker](https://docs.docker.com/install/) are installed. On Linux, make sure you can run [`docker` without `sudo`](https://askubuntu.com/questions/477551/how-can-i-use-docker-without-sudo). On Windows, we recommend [WSL 2 with Docker enabled](https://docs.docker.com/desktop/windows/wsl/).

While we recommend following along step-by-step, the complete example can also be found in the [`examples/` directory of the project repository](https://github.com/InsightSoftwareConsortium/itk-wasm/tree/main/examples/hello-world).

Let's get started! 🚀

## Write the code

First, let's create a new directory to house our project.

```sh
mkdir HelloWorld
cd HelloWorld
```

Let's write some code! Populate *hello.cxx* with our Hello World program:

```cpp
#include <iostream>

int main() {
  std::cout << "Hello Wasm world!" << std::endl;
  return 0;
}
```

Next, provide a [CMake](https://cmake.org/) build configuration at *CMakeLists.txt*:

```cmake
cmake_minimum_required(VERSION 3.16)
project(HelloWorld)

add_executable(hello hello.cxx)
```

## Install itk-wasm

We use the `add_executable` command to build executables with itk-wasm. The [Emscripten](https://kripken.github.io/emscripten-site/) and [WASI](https://github.com/WebAssembly/wasi-sdk) toolchains along with itk-wasm build and execution configurations are contained in itk-wasm [dockcross](https://github.com/dockcross/dockcross) Docker images invoked by the itk-wasm command line interface (CLI).  Note that the same code can also be built and tested with native operating system toolchains. This is useful for development and debugging.

Build the program with the itk-wasm CLI, `itk-wasm`. This is shipped with the `itk-wasm` Node.js package. First install *itk-wasm* with the Node Package Manager, `npm`, the CLI that ships with Node.js.

```sh
# Initialize an empty project in the current directory
npm init --yes
npm install itk-wasm@1.0.0-b.72
```

## WASI

Build the project with the WASI `itkwasm/wasi` toolchain in the `./wasi-build/` directory:

```sh
npx itk-wasm -i itkwasm/wasi build
```

A `hello.wasi.wasm` WebAssembly binary is built in the `./wasi-build/` directory.

```sh
❯ ls wasi-build
build.ninja          CMakeFiles          libwasi-exception-shim.a
cmake_install.cmake  hello.wasi.wasm
```

Execute the binary with the `run` `itk-wasm` subcommand.

```sh
❯ npx itk-wasm run wasi-build/hello.wasi.wasm
Hello Wasm world!
```

Congratulations! You just executed a C++ program compiled to WebAssembly. 🎉

The binary can also be executed with other [WASI runtimes](https://github.com/mbasso/awesome-wasm#non-web-embeddings).

## Node.js

For Node.js or the Browser, build the project with the default [Emscripten](https://emscripten.org/) toolchain. The project is built in the `./emscripten-build` directory by default.

```sh
npx itk-wasm build
```

To execute the project, create an `index.mjs` JavaScript file to [invoke the module](../api/node_pipelines.html):

```js
import path from 'path'
import { runPipelineNode } from 'itk-wasm'

const pipelinePath = path.resolve('emscripten-build', 'hello')
const args = []
await runPipelineNode(pipelinePath, args)
```

**Important**: Inside the *package.json* file, we must also add `"type": "module",` to tell Node.js that we have a modern JavaScript project that uses [ES modules](https://nodejs.org/api/esm.html#modules-ecmascript-modules).

And run it!

```sh
❯ npx node ./index.mjs
Hello Wasm world!
```

Congratulations! You just executed a C++ program in JavaScript. 🎉

## Browser

The same Emscripten Wasm module can be executed in a web browser.

Create an HTML file named `index.html` that will call the Wasm module through JavaScript and display its output in the HTML DOM:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>itk-wasm Browser Hello World!</title>
    <meta charset="UTF-8" />
    <script src="https://cdn.jsdelivr.net/npm/itk-wasm@1.0.0-b.73/dist/umd/itk-wasm.min.js"></script>
  </head>

  <body>
    <textarea readonly>WebAssembly output...</textarea>

    <script>
      const outputTextArea = document.querySelector("textarea");
      outputTextArea.textContent = "Loading...";

      const wasmURL = new URL('emscripten-build/hello', document.location)
      const args = []
      const inputs = null
      const outputs = null
      itk.runPipeline(null, wasmURL, args, inputs, outputs).then(
        ({ stdout, webWorker }) => {
          webWorker.terminate()
          outputTextArea.textContent = stdout
          })
    </script>
  </body>
</html>
```

Serve the web page and Wasm module with an http server:

```sh
npm install http-server
http-server .
```

And point your browser to `http://127.0.0.1:8080/`.

![Hello Wasm World!](./hello_wasm_world.png)

Congratulations! You just executed a C++ program in your web browser. 🎉

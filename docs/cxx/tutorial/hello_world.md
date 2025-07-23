# Hello Wasm World!

## Introduction

This example walks through how to compile a *hello world* executable written in C++ to [WebAssembly](https://webassembly.org/) and how to execute it with standalone WebAssembly runtimes, the Node.js JavaScript runtime, and web browser runtimes!

**Updated for create-itk-wasm**: This tutorial now demonstrates the modern ITK-Wasm development workflow using the `create-itk-wasm` CLI tool, which provides a complete development environment with automated build configurations, testing infrastructure, and language binding generation.

Before getting started, make sure [Node.js](https://nodejs.org/en/download/) and [Docker](https://docs.docker.com/install/) or [Podman](https://podman.io/docs/installation) are installed. On Linux, make sure you can run [`docker` without `sudo`](https://askubuntu.com/questions/477551/how-can-i-use-docker-without-sudo).

While we recommend following along step-by-step, the complete example can also be found in the [`examples/` directory of the project repository](https://github.com/InsightSoftwareConsortium/ITK-Wasm/tree/main/examples/hello-world).

Let's get started! 🚀

## Create the project

The easiest way to get started with ITK-Wasm is using the `create-itk-wasm` CLI tool, which scaffolds a complete development environment with all necessary build configurations and toolchains.

First, make sure [Node.js](https://nodejs.org/en/download/) and [Docker](https://docs.docker.com/install/) or [Podman](https://podman.io/docs/installation) are installed. On Linux, make sure you can run [`docker` without `sudo`](https://askubuntu.com/questions/477551/how-can-i-use-docker-without-sudo).

Create a new project:

```sh
npx create-itk-wasm hello-world
cd hello-world
```

This creates a complete project structure with:
- **Native C++ build** - Traditional compiled executables for development and testing  
- **Emscripten toolchain** - WebAssembly compilation for browser environments
- **WASI toolchain** - WebAssembly System Interface for server-side execution
- **Language bindings** - Automatic TypeScript and Python wrapper generation
- **Testing infrastructure** - Example tests for all target platforms

## Write the code

The `create-itk-wasm` tool generates a pipeline template. Let's modify it to create our Hello World program. Edit the generated C++ file in the pipeline directory (e.g., `hello-world/hello-world.cxx`):

```cpp
#include "itkPipeline.h"
#include "itkOutputTextStream.h"
#include <iostream>

int main(int argc, char * argv[])
{
  itk::wasm::Pipeline pipeline("hello", "A simple hello world pipeline", argc, argv);

  // Add an optional message parameter
  std::string message = "Hello Wasm world!";
  pipeline.add_option("--message", message, "Message to display");

  // Add text output for the message
  itk::wasm::OutputTextStream textOutput;
  pipeline.add_option("text-output", textOutput, "Text output")->required()->type_name("OUTPUT_TEXT");

  ITK_WASM_PARSE(pipeline);

  // Output the message to both stdout and the text output stream
  std::cout << message << std::endl;
  
  textOutput.Get() << message << std::endl;

  return EXIT_SUCCESS;
}
```

The ITK-Wasm pipeline structure provides:
- **CLI11 integration** for robust command-line argument parsing
- **Standardized I/O** through the `itk::wasm::Pipeline` interface  
- **Cross-platform compatibility** with the same code running natively and in WebAssembly

## Project structure

The `create-itk-wasm` tool generates a complete project structure:

```
hello-world/
├── pixi.toml              # Pixi environment and task configuration
├── package.json           # Node.js dependencies and scripts  
├── CMakeLists.txt         # Main CMake configuration
├── hello/                 # Pipeline directory
│   ├── hello.cxx         # Pipeline C++ source code
│   └── CMakeLists.txt    # Pipeline-specific CMake config
├── tests/                 # Test files
├── index.html            # Browser demo page
├── index.mjs             # Node.js example
└── README.md             # Project documentation
```

This structure supports:
- **Multiple pipelines** - Add more pipelines as subdirectories
- **Automatic binding generation** - TypeScript and Python wrappers are generated
- **Comprehensive testing** - Native, WASI, Node.js, and browser tests
- **Modern tooling** - Pixi for dependency management, pnpm for JavaScript packages

## Build and run

The generated project includes [pixi](https://pixi.sh/) for seamless dependency management and build orchestration. Pixi handles the installation of all required toolchains and provides consistent commands across platforms.

### WASI

Build and test the WASI WebAssembly binary:

```sh
pixi run build:wasi
pixi run test:wasi
```

This creates a `hello.wasi.wasm` binary that can be executed with WASI runtimes.

```sh
❯ pixi run test:wasi
Hello Wasm world!
```

## Next steps

Now that you have a working ITK-Wasm pipeline, you can:

1. **Add more functionality** - Modify the C++ code to perform image processing, analysis, or other computational tasks
2. **Add inputs and outputs** - Use `create-itk-wasm` again to add more pipelines or modify the existing one to handle images, meshes, or other data types
3. **Integrate with your application** - Use the generated TypeScript or Python bindings to integrate your pipeline into web applications, desktop software, or data analysis workflows
4. **Publish your package** - Share your pipeline with the community by publishing it as an npm package or Python package

For more advanced examples and comprehensive documentation, visit [wasm.itk.org](https://wasm.itk.org).

Consider adding your project to the [ITK-Wasm packages list](https://wasm.itk.org/en/latest/introduction/packages.html) to help others discover your work!

The binary can also be executed with other [WASI runtimes](https://github.com/mbasso/awesome-wasm#non-web-embeddings).

## Node.js

Build and test with Node.js:

```sh
pixi run build:emscripten
pixi run test:node
```

This builds the Emscripten WebAssembly module and tests it in Node.js using the generated TypeScript bindings.

```sh
❯ pixi run test:node
Hello Wasm world!
```

The `create-itk-wasm` tool automatically generates TypeScript bindings that provide a clean, type-safe API for calling your pipeline from JavaScript/TypeScript.

## Browser

The same Emscripten WebAssembly module can be executed in a web browser using the generated web examples.

Start the development server:

```sh
pixi run start
```

Then open your browser to the URL shown (typically `http://localhost:8080`) to see the pipeline running in the browser.

![Hello Wasm World!](/_static/tutorial/hello_wasm_world.png)

The `create-itk-wasm` tool generates complete web examples demonstrating how to use your pipeline in browser environments.

## Native development

For development and debugging, you can also build and run the pipeline natively:

```sh
pixi run build:native
pixi run test:native
```

This builds a traditional C++ executable that can be debugged with standard tools like `gdb` or IDE debuggers.

## Next steps

Now that you have a working ITK-Wasm pipeline, you can:

1. **Add more functionality** - Modify the C++ code to perform image processing, analysis, or other computational tasks
2. **Add inputs and outputs** - Use `create-itk-wasm` again to add more pipelines or modify the existing one to handle images, meshes, or other data types
3. **Integrate with your application** - Use the generated TypeScript or Python bindings to integrate your pipeline into web applications, desktop software, or data analysis workflows
4. **Publish your package** - Share your pipeline with the community by publishing it as an npm package or Python package

For more advanced examples and comprehensive documentation, visit [wasm.itk.org](https://wasm.itk.org).

Consider adding your project to the [ITK-Wasm packages list](https://wasm.itk.org/en/latest/introduction/packages.html) to help others discover your work!

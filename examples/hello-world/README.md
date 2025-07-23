# Hello World

An ITK-Wasm Hello World example demonstrating the `create-itk-wasm` workflow.

This example shows how to:

1. Create an ITK-Wasm project using `create-itk-wasm` 
2. Build for multiple target platforms (WASI, Emscripten, Native)
3. Test in different environments (Node.js, Browser, WASI runtimes)

## Getting Started

This example was created using:

```sh
npx create-itk-wasm hello-world
```

## Building and Testing

Build all targets:

```sh
pixi run build
```

Test all platforms:

```sh
pixi run test
```

For individual targets:

```sh
# WASI WebAssembly
pixi run build:wasi
pixi run test:wasi

# Emscripten WebAssembly (Browser/Node.js)
pixi run build:emscripten
pixi run test:node

# Native executable
pixi run build:native
pixi run test:native
```

## Web Demo

Start the development server:

```sh
pixi run start
```

Then open your browser to view the interactive demo.

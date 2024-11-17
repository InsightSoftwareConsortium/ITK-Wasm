# create-itk-wasm

CLI to create a new [ITK-Wasm](https://wasm.itk.org) project or add a pipeline to an existing project.

## Usage

[Install pnpm](https://pnpm.io/installation), e.g.

```sh
npm install -g pnpm
```

and [pixi](https://pixi.sh/latest/), e.g.

```sh
curl -fsSL https://pixi.sh/install.sh | bash
```

Then,

```sh
mkdir my-project
cd my-project

pnpm create itk-wasm
# Answers the questions

pixi run build
pixi run test

# Add your C++ logic code to the *.cxx files
pixi run build
pixi run test

# For more granular targets, see the output of
pixi task list
```

For more information, see the [ITK-Wasm documentation](https://wasm.itk.org).

Consider adding your project to the [packages list](https://wasm.itk.org/en/latest/introduction/packages.html).

A project can also be initialized via command line flags: see `--help` for all options. A single pipeline can be specified via command line flags. To add more pipelines, call the CLI again for the same project.
# create-itk-wasm

CLI to create a new [ITK-Wasm](https://wasm.itk.org) project or add a pipeline to an existing project.

## Usage

[Install pnpm](https://pnpm.io/installation), e.g.

```
npm install -g pnpm
```

Then,

```
mkdir my-project
cd my-project

pnpm create itk-wasm
# Answers the questions

pnpm install
pnpm build
pnpm test

# Add your C++ logic code to the *.cxx files
pnpm build
pnpm test

# For more granular targets, see the output of
pnpm run
```

For more information, see the [ITK-Wasm documentation](https://wasm.itk.org).

Consider adding your project to the [packages list](https://wasm.itk.org/en/latest/introduction/packages.html).
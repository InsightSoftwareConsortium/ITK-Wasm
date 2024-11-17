import fs from 'fs'
import path from 'path'

import ProjectSpec from '../project-spec.js'
import die from '../die.js'

function generatePackageJson(project: ProjectSpec) {
  if (!project.typescriptPackageName) {
    die('typescript-package-name is required')
  }
  if (!project.pythonPackageName) {
    die('python-package-name is required')
  }

  const itkWasm = {
    'test-data-hash':
      'bafkreidnoz54py66bn56uq6itwkfgngflaqilflfvwkxlps4ycmygstzja',
    'test-data-urls': [
      'https://github.com/InsightSoftwareConsortium/ITK-Wasm/releases/download/itk-wasm-v1.0.0-b.179/sample-data.tar.gz',
      'https://bafybeidxatrsrrphfmntdyze6ec3jbiak527wj3kalwjptv4bimpcnzxdq.ipfs.w3s.link/ipfs/bafybeidxatrsrrphfmntdyze6ec3jbiak527wj3kalwjptv4bimpcnzxdq/sample-data.tar.gz'
    ],
    'package-description': project.packageDescription,
    'typescript-package-name': project.typescriptPackageName,
    'python-package-name': project.pythonPackageName,
    repository: project.repositoryUrl
  }
  if (project.repositoryUrl) {
    // @ts-ignore
    itkWasm.repository = project.repositoryUrl
  }
  let packageJson = {
    name: `${project.name}-build`,
    version: '0.1.0',
    private: true,
    description: `Scripts to generate ${project.name} ITK-Wasm artifacts.`,
    type: 'module',
    'itk-wasm': itkWasm,
    license: project.license,
    scripts: {
      build: 'pnpm build:gen:typescript && pnpm build:gen:python',
      'build:emscripten': 'itk-wasm pnpm-script build:emscripten',
      'build:emscripten:debug': 'itk-wasm pnpm-script build:emscripten:debug',
      'build:micromamba':
        'echo "No build:micromamba script required with pixi"',
      'build:wasi': 'itk-wasm pnpm-script build:wasi',
      'build:wasi:debug': 'itk-wasm pnpm-script build:wasi:debug',
      'build:python:wasi':
        "echo 'No build:python:wasi script required with pixi'",
      'bindgen:typescript': 'itk-wasm pnpm-script bindgen:typescript',
      'bindgen:python': 'itk-wasm pnpm-script bindgen:python',
      'build:gen:typescript': 'itk-wasm pnpm-script build:gen:typescript',
      'build:gen:python': 'itk-wasm pnpm-script build:gen:python',
      test: 'pixi run download-test-data && pnpm build:gen:python && pnpm test:python',
      'test:python:wasi': 'itk-wasm pnpm-script test:python:wasi',
      'test:python:emscripten': 'itk-wasm pnpm-script test:python:emscripten',
      'test:python:dispatch': 'itk-wasm pnpm-script test:python:emscripten',
      'test:python': 'itk-wasm pnpm-script test:python',
      'test:wasi': 'itk-wasm pnpm-script test:wasi'
    },
    devDependencies: {
      '@itk-wasm/dam': '^1.1.1',
      'itk-wasm': '1.0.0-b.180'
    }
  }
  if (project.author) {
    // @ts-ignore
    packageJson.author = project.author
  }
  if (project.repositoryUrl) {
    // @ts-ignore
    packageJson.repository = {
      type: 'git',
      url: project.repositoryUrl
    }
  }
  const packageJsonPath = path.join(project.directory, 'package.json')
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
}

export default generatePackageJson

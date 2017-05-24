# ITK Bridge JavaScript

[![CircleCI](https://circleci.com/gh/InsightSoftwareConsortium/ITKBridgeJavaScript.svg?style=svg)](https://circleci.com/gh/InsightSoftwareConsortium/ITKBridgeJavaScript)

## Supported file formats

- [NRRD](http://teem.sourceforge.net/nrrd/format.html)
- [Portable Network Graphics (PNG)](https://en.wikipedia.org/wiki/Portable_Network_Graphics)

## Hacking ITKBridgeJavaScript

### Build dependencies

- Node.js / NPM
- Docker

### Building

To build ITKBridgeJavaScript itself:

```bash
npm install
npm run build
```

Run the tests:
```bash
npm test
```

### Contributing

We use semantic-release for handling change log and version. 
Therefore we recommend using the following command line when 
creating a commit:

```sh
$ npm run commit
```

Otherwise you can follow the specification available [here](https://gist.github.com/stephenparish/9941e89d80e2bc58a153).

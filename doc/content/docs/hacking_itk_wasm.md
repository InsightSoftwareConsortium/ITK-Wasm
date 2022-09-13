title: Hacking itk-wasm
---

### Build dependencies

- [Node.js / NPM](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/install/)
  * On Linux, make sure you can run [`docker` without `sudo`](https://askubuntu.com/questions/477551/how-can-i-use-docker-without-sudo).
  * On Windows, we recommend [WSL 2 with Docker enabled](https://docs.docker.com/desktop/windows/wsl/).
- Bash

### Building

To build itk-wasm itself:
```bash
npm install
npm run build
```

Run the tests:
```bash
npm test
```

Build and serve the documentation:
```bash
npm run doc:www
```

Create a debug build (see also: [the debugging example](../example/debugging.html)):
```bash
git clean -fdx
# pull the latest debug Docker images
./src/docker/pull.sh
npm run build:debug
```

### Contributing

We use semantic-release for handling change log and version.
Therefore we recommend using the following command line when
creating a commit:

```sh
$ npm run commit
```

Otherwise you can follow the specification available [here](https://gist.github.com/stephenparish/9941e89d80e2bc58a153).

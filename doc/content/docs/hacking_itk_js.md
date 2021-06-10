title: Hacking itk.js
---

### Build dependencies

- [Node.js / NPM](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/install/)
  * On Linux, make sure you can run [`docker` without `sudo`](https://askubuntu.com/questions/477551/how-can-i-use-docker-without-sudo).
  * On Windows, make sure [Shared Drives are enabled in the Docker settings](https://docs.docker.com/docker-for-windows/troubleshoot/#volumes).
- Bash
  * Bash is installed by default on Linux and macOS.
  * On Windows, we recommend [Git Bash](https://git-scm.com/).

### Building

To build itk.js itself:
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

### Contributing

We use semantic-release for handling change log and version.
Therefore we recommend using the following command line when
creating a commit:

```sh
$ npm run commit
```

Otherwise you can follow the specification available [here](https://gist.github.com/stephenparish/9941e89d80e2bc58a153).

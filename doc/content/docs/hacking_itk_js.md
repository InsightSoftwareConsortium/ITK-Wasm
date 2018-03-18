title: Hacking itk.js
---

### Build dependencies

- Node.js / NPM
- Docker

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

title: Using the itk.js UMD modules from an HTML script tag
---

<div class="glitch-embed-wrap" style="height: 420px; width: 100%; padding-bottom: 25px;">
  <iframe
    allow="geolocation; microphone; camera; midi; encrypted-media"
    src="https://glitch.com/embed/#!/embed/itk-js-umd-example?path=README.md&previewSize=100"
    alt="itk-js-umd-example on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

---

This example demonstrates how to use *itk.js* in a web browser application via its pre-built [UMD](https://github.com/umdjs/umd) module. This is an alternative to bundling the modules with the Webpack application, as shown in the [Webpack example](./webpack.html). In this example, we re-use the itk.js IO modules published on [unpkg.com](https://unpkg.com). Find the full example in the `itk-js/examples/UMD` [directory of the GitHub repository](https://github.com/InsightSoftwareConsortium/itk-js/tree/master/examples/UMD).

Inside the HTML `head`, load the itk.js UMD script:

```html
  <head>
    [...]
    <script src="https://unpkg.com/itk@9.4.0/umd/itk.js"></script>
  </head>
```

Inside body JavaScript code, the `itk` object provides [itk.js API functions and objects](https://insightsoftwareconsortium.github.io/itk-js/api/) as properties.

```
  [...]
  return itk.readImageFile(null, files[0]).then(function({ image, webWorker }) {
    webWorker.terminate();
```

## Simple HTTP server

Optionally, add an npm script that will start a local web server for development.

```
  npm install --save-dev local-web-server
```

Next, define a `start` command to start a local development web server in the *scripts* section of the `package.json` file,

```js
  "scripts": {
    "start": "ws -d dist"
  },
```

To start the development web server hosting the `dist/` directory contents, run

```sh
npm run start
```

## Testing with Karma

This section described how to configure browser-based testing with the [Karma test runner](https://karma-runner.github.io/2.0/index.html).

First, install Karma and a test harness library like [tape](https://github.com/substack/tape).

```
npm install --save-dev karma karma-chrome-launcher karma-tap karma-tap-pretty-reporter karma-webpack tape tap-spec
```

Next write a [karma.config.js](https://github.com/InsightSoftwareConsortium/itk-js/blob/master/examples/UMD/karma.conf.js) file, and a [test/index.js](https://github.com/InsightSoftwareConsortium/itk-js/blob/master/examples/UMD/test/index.js) test script.
Webpack builds test scripts in `test/*.js`, resolves module dependencies, and Karma serves and runs the resulting scripts.

Create entries in the `package.json` file to start Karma, and run the tests!

```js
  "scripts": {
    [...]
    "test": "karma start ./karma.conf.js",
    "test:debug": "karma start ./karma.conf.js --browsers Chrome --no-single-run"
  },
```

and

```
npm run test
```

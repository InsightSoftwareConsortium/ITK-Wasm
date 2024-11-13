import * as transformIo from "../../../dist/index.js";
globalThis.transformIo = transformIo;

// Use local, vendored WebAssembly module assets
const viteBaseUrl = import.meta.env.BASE_URL;
const pipelinesBaseUrl: string | URL = new URL(
  `${viteBaseUrl}pipelines`,
  document.location.origin
).href;
transformIo.setPipelinesBaseUrl(pipelinesBaseUrl);

const params = new URLSearchParams(window.location.search);
if (!params.has("functionName")) {
  params.set("functionName", "readTransform");
  const url = new URL(document.location);
  url.search = params;
  window.history.replaceState({ functionName: "readTransform" }, "", url);
}

import "./read-transform-controller.js";
import "./write-transform-controller.js";
// End added content
import "./hdf5-read-transform-controller.js";
import "./hdf5-write-transform-controller.js";
import "./mat-read-transform-controller.js";
import "./mat-write-transform-controller.js";
import "./mnc-read-transform-controller.js";
import "./mnc-write-transform-controller.js";
import "./txt-read-transform-controller.js";
import "./txt-write-transform-controller.js";
import "./wasm-read-transform-controller.js";
import "./wasm-write-transform-controller.js";
import "./wasm-zstd-read-transform-controller.js";
import "./wasm-zstd-write-transform-controller.js";

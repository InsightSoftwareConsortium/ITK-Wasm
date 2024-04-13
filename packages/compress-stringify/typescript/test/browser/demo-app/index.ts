import * as compressStringify from "../../../dist/index.js";
globalThis.compressStringify = compressStringify;

import * as imageIo from "@itk-wasm/image-io";
globalThis.imageIo = imageIo;
import * as meshIo from "@itk-wasm/mesh-io";
globalThis.meshIo = meshIo;
import * as compareImages from "@itk-wasm/compare-images";
globalThis.compareImages = compareImages;
import * as compareMeshes from "@itk-wasm/compare-meshes";
globalThis.compareMeshes = compareMeshes;
import * as meshToPolyData from "@itk-wasm/mesh-to-poly-data";
globalThis.meshToPolyData = meshToPolyData;

// Use local, vendored WebAssembly module assets
const viteBaseUrl = import.meta.env.BASE_URL;
const pipelinesBaseUrl: string | URL = new URL(
  `${viteBaseUrl}pipelines`,
  document.location.origin,
).href;
compressStringify.setPipelinesBaseUrl(pipelinesBaseUrl);
imageIo.setPipelinesBaseUrl(pipelinesBaseUrl);
meshIo.setPipelinesBaseUrl(pipelinesBaseUrl);
compareImages.setPipelinesBaseUrl(pipelinesBaseUrl);
compareMeshes.setPipelinesBaseUrl(pipelinesBaseUrl);
meshToPolyData.setPipelinesBaseUrl(pipelinesBaseUrl);

const params = new URLSearchParams(window.location.search);
if (!params.has("functionName")) {
  params.set("functionName", "compressStringify");
  const url = new URL(document.location);
  url.search = params;
  window.history.replaceState({ functionName: "compressStringify" }, "", url);
}
import "./compress-stringify-controller.js";
import "./parse-string-decompress-controller.js";

import * as dicom from "../../../dist/index.js";
globalThis.dicom = dicom;

import { readImage } from "@itk-wasm/image-io";
globalThis.readImage = readImage;

import { castImage } from "itk-wasm";
globalThis.castImage = castImage;

// Use local, vendored WebAssembly module assets
const viteBaseUrl = import.meta.env.BASE_URL;
const pipelinesBaseUrl: string | URL = new URL(
  `${viteBaseUrl}pipelines`,
  document.location.origin,
).href;
dicom.setPipelinesBaseUrl(pipelinesBaseUrl);

const params = new URLSearchParams(window.location.search);
if (!params.has("functionName")) {
  params.set("functionName", "applyPresentationStateToImage");
  const url = new URL(document.location);
  url.search = params;
  window.history.replaceState(
    { functionName: "applyPresentationStateToImage" },
    "",
    url,
  );
}
import "./apply-presentation-state-to-image-controller.js";
import "./read-dicom-encapsulated-pdf-controller.js";
import "./read-image-dicom-file-series-controller.js";
import "./read-overlapping-segmentation-controller.js";
import "./read-segmentation-controller.js";
import "./structured-report-to-html-controller.js";
import "./structured-report-to-text-controller.js";
import "./write-multi-segmentation-controller.js";
import "./write-overlapping-segmentation-controller.js";
import "./write-segmentation-controller.js";

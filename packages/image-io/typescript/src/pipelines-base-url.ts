import { getPipelinesBaseUrl as itkWasmGetPipelinesBaseUrl } from "itk-wasm";
import version from "./version.js";

let pipelinesBaseUrl: string | URL | undefined;
let defaultPipelinesBaseUrl: string | URL =
  `https://cdn.jsdelivr.net/npm/@itk-wasm/image-io@${version}/dist/pipelines`;

export function setPipelinesBaseUrl(baseUrl: string | URL): void {
  pipelinesBaseUrl = baseUrl;
}

export function getPipelinesBaseUrl(): string | URL {
  if (typeof pipelinesBaseUrl !== "undefined") {
    return pipelinesBaseUrl;
  }
  const itkWasmPipelinesBaseUrl = itkWasmGetPipelinesBaseUrl();
  if (typeof itkWasmPipelinesBaseUrl !== "undefined") {
    return itkWasmPipelinesBaseUrl;
  }
  return defaultPipelinesBaseUrl;
}

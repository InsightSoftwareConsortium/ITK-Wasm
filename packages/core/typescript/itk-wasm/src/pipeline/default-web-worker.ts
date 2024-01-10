let defaultWebWorker: Worker | null = null

/**
 * Set the default web worker for functions in a bundle defined with itk-wasm bindgen.
 *
 * Must be created with `createWebWorker`.
 **/
export function setDefaultWebWorker (webWorker: Worker | null): void {
  defaultWebWorker = webWorker
}

/**
 * Get the default web worker for functions in a bundle defined with itk-wasm bindgen.
 *
 * A value of `null` indicates that the default web worker has not been set and the default web worker for the
 * bindgen package will be used.
 **/
export function getDefaultWebWorker (): Worker | null {
  return defaultWebWorker
}

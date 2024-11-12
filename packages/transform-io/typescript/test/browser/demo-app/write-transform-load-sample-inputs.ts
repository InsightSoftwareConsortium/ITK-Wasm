import * as transformIo from "../../../dist/index.js";

export default async function writeTransformLoadSampleInputs(
  model,
  preRun = false
) {
  const inputButton = document.querySelector(
    "#writeTransformInputs sl-button[name=transform-file-button]"
  );
  if (!preRun) {
    inputButton.loading = true;
  }
  const fileName = "LinearTransform.h5";
  const inputResponse = await fetch(
    `https://bafybeiexsz7fct367pn5i7qvasktr3htc27corme3yihxhismhkhrmngne.ipfs.w3s.link/ipfs/bafybeiexsz7fct367pn5i7qvasktr3htc27corme3yihxhismhkhrmngne/${fileName}`
  );
  const inputData = new Uint8Array(await inputResponse.arrayBuffer());
  const { transform: inputTransform, webWorker } =
    await transformIo.readTransform({ data: inputData, path: fileName });
  webWorker.terminate();
  model.inputs.set("transform", inputTransform);

  const serializedTransform = "transform.h5";
  model.inputs.set("serializedTransform", serializedTransform);

  if (!preRun) {
    const inputElement = document.getElementById(
      "writeTransform-transform-details"
    );
    inputElement.innerHTML = `<pre>${globalThis.escapeHtml(
      inputData.subarray(0, 50).toString()
    )}</pre>`;
    inputElement.disabled = false;
    const serializedTransformElement = document.querySelector(
      "#writeTransformInputs sl-input[name=serialized-transform]"
    );
    serializedTransformElement.value = serializedTransform;
    inputButton.loading = false;
  }

  return model;
}

// Use this function to run the pipeline when this tab group is select.
// This will load the web worker if it is not already loaded, download the wasm module, and allocate memory in the wasm model.
// Set this to `false` if sample inputs are very large or sample pipeline computation is long.
export const usePreRun = true;

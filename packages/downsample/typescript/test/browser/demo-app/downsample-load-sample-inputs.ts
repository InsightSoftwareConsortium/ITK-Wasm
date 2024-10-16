export default async function downsampleLoadSampleInputs(
  model,
  preRun = false,
) {
  const downsampleButton = document.querySelector(
    "#downsampleInputs sl-button[name=input-file-button]",
  );
  if (!preRun) {
    downsampleButton.loading = true;
  }

  const fileName = "cthead1.png";
  const response = await fetch(
    `https://bafybeih4fck4ndvsvgo6774xy5w7ip3bzcvh7x7e527m4yvazgrxdzayua.ipfs.w3s.link/ipfs/bafybeih4fck4ndvsvgo6774xy5w7ip3bzcvh7x7e527m4yvazgrxdzayua/input/${fileName}`,
  );
  const data = new Uint8Array(await response.arrayBuffer());
  const inputFile = { data, path: fileName };
  const { image } = await globalThis.readImage(inputFile);

  model.inputs.set("input", image);
  model.options.set("shrinkFactors", [2, 2]);

  if (!preRun) {
    const downsampleElement = document.getElementById(
      "downsample-input-details",
    );
    downsampleElement.setImage(image);
    downsampleElement.disabled = false;

    const shrinkFactorsElement = document.querySelector(
      "#downsampleInputs sl-input[name=shrink-factors]",
    );
    shrinkFactorsElement.value = JSON.stringify(
      model.options.get("shrinkFactors"),
    );

    downsampleButton.loading = false;
  }

  return model;
}

// Use this function to run the pipeline when this tab group is select.
// This will load the web worker if it is not already loaded, download the wasm module, and allocate memory in the wasm model.
// Set this to `false` if sample inputs are very large or sample pipeline computation is long.
export const usePreRun = true;

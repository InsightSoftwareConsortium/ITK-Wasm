export default async function resampleToReferenceLoadSampleInputs(model, preRun = false) {
  const resampleToReferenceButton = document.querySelector(
    "#resampleToReferenceInputs sl-button[name=input-file-button]",
  );
  if (!preRun) {
    resampleToReferenceButton.loading = true;
  }

  const fileName = "cthead1.png";
  const response = await fetch(
    `https://bafybeih4fck4ndvsvgo6774xy5w7ip3bzcvh7x7e527m4yvazgrxdzayua.ipfs.w3s.link/ipfs/bafybeih4fck4ndvsvgo6774xy5w7ip3bzcvh7x7e527m4yvazgrxdzayua/input/${fileName}`,
  );
  const data = new Uint8Array(await response.arrayBuffer());
  const inputFile = { data, path: fileName };
  const { image } = await globalThis.readImage(inputFile);

  // Sample: resample cthead1 onto its own grid (identity transform, linear
  // interpolation). The moving image doubles as the reference image, so the
  // sample is self-contained from the single published input and produces an
  // output essentially equal to the input. The transform is optional and left
  // unset (defaults to identity); upload one via the demo to exercise that path.
  model.inputs.set("input", image);
  model.inputs.set("referenceImage", image);
  model.options.set("interpolator", "linear");

  if (!preRun) {
    const inputDetails = document.getElementById("resampleToReference-input-details");
    inputDetails.setImage(image);
    inputDetails.disabled = false;

    const referenceDetails = document.getElementById(
      "resampleToReference-reference-image-details",
    );
    referenceDetails.setImage(image);
    referenceDetails.disabled = false;

    const interpolatorElement = document.querySelector(
      "#resampleToReferenceInputs sl-input[name=interpolator]",
    );
    interpolatorElement.value = model.options.get("interpolator");

    resampleToReferenceButton.loading = false;
  }

  return model;
}

// Use this function to run the pipeline when this tab group is select.
// This will load the web worker if it is not already loaded, download the wasm module, and allocate memory in the wasm model.
// Set this to `false` if sample inputs are very large or sample pipeline computation is long.
export const usePreRun = true;

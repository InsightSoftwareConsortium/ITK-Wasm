export default async function readTransformLoadSampleInputs(
  model,
  preRun = false
) {
  const inputButton = document.querySelector(
    "#readTransformInputs sl-button[name=serialized-transform-file-button]"
  );
  if (!preRun) {
    inputButton.loading = true;
  }
  const fileName = "LinearTransform.h5";
  const inputResponse = await fetch(
    `https://bafybeiexsz7fct367pn5i7qvasktr3htc27corme3yihxhismhkhrmngne.ipfs.w3s.link/ipfs/bafybeiexsz7fct367pn5i7qvasktr3htc27corme3yihxhismhkhrmngne/${fileName}`
  );
  const inputData = new Uint8Array(await inputResponse.arrayBuffer());
  model.inputs.set("serializedTransform", { data: inputData, path: fileName });
  if (!preRun) {
    const inputElement = document.getElementById(
      "readTransform-serialized-transform-details"
    );
    inputElement.innerHTML = `<pre>${globalThis.escapeHtml(
      inputData.subarray(0, 50).toString()
    )}</pre>`;
    inputElement.disabled = false;
    inputButton.loading = false;
  }

  return model;
}

export const usePreRun = true;

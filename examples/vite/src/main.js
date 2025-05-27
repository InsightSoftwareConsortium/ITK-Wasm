// Example ITK-Wasm package, @itk-wasm/image-io
import { readImage, setPipelinesBaseUrl } from "@itk-wasm/image-io";
// Use local, vendored WebAssembly module assets copied by viteStaticCopy
const viteBaseUrl = import.meta.env.BASE_URL || "/";
const pipelinesBaseUrl = new URL(
  `${viteBaseUrl}pipelines`,
  document.location.origin
).href;
setPipelinesBaseUrl(pipelinesBaseUrl);

// Visualization
import { Niivue, MULTIPLANAR_TYPE } from "@niivue/niivue";
// Convert ITK-Wasm Image to Niivue Image
import { iwi2niiCore } from "@niivue/cbor-loader";

async function processImage(event) {
  const outputTextArea = document.querySelector("textarea");
  outputTextArea.textContent = "Loading...";

  const dataTransfer = event.dataTransfer;
  const files = event.target.files || dataTransfer.files;

  const { image } = await readImage(files[0]);

  function replacer(key, value) {
    if (!!value && value.byteLength !== undefined) {
      return String(value.slice(0, 6)) + "...";
    }
    return value;
  }
  outputTextArea.textContent = JSON.stringify(image, replacer, 4);

  const canvas = document.querySelector("#viewer > canvas");
  const nv = new Niivue({ multiplanarLayout: MULTIPLANAR_TYPE.GRID });
  await nv.attachToCanvas(canvas);
  const niiImage = iwi2niiCore(image);
  await nv.loadVolumes([{ url: niiImage, name: "image.nii" }]);
}

const imageInput = document.querySelector("input[name='input-file']");
imageInput.addEventListener("change", processImage);

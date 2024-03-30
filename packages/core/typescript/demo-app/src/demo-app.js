import { ItkWasmMultiscaleSpatialImage } from "@itk-viewer/io/ItkWasmMultiscaleSpatialImage.js";
import "@itk-viewer/element/itk-viewer-2d.js";

import "@shoelace-style/shoelace/dist/themes/light.css";
import "@shoelace-style/shoelace/dist/themes/dark.css";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/tab-group/tab-group.js";
import "@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js";
import "@shoelace-style/shoelace/dist/components/tab/tab.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/checkbox/checkbox.js";
import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
import "@shoelace-style/shoelace/dist/components/alert/alert.js";
import "@shoelace-style/shoelace/dist/components/icon/icon.js";
import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
import "@shoelace-style/shoelace/dist/components/divider/divider.js";
import "@shoelace-style/shoelace/dist/components/details/details.js";
import "@shoelace-style/shoelace/dist/components/popup/popup.js";
import "@shoelace-style/shoelace/dist/components/tag/tag.js";
import "@shoelace-style/shoelace/dist/components/select/select.js";
import "@shoelace-style/shoelace/dist/components/option/option.js";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";
import "@shoelace-style/shoelace/dist/components/range/range.js";
import "@shoelace-style/shoelace/dist/components/card/card.js";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";

setBasePath("/");

if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  // dark mode
  document.documentElement.classList.add("sl-theme-dark");
}

function showImage(image, details) {
  details.innerHTML = "";

  const viewer = document.createElement("itk-viewer-2d");
  viewer.style.width = "100%";
  viewer.style.height = "26rem";
  const multiImage = new ItkWasmMultiscaleSpatialImage(image);
  // need to wait a tick due to bad setup flow in @itk-viewer/element
  setTimeout(() => {
    const viewerActor = viewer.getActor();
    viewerActor.send({ type: "setImage", image: multiImage });
  }, 0);

  const imageInfo = document.createElement("pre");
  imageInfo.innerHTML = escapeHtml(
    JSON.stringify(image, interfaceTypeJsonReplacer, 2),
  );

  details.appendChild(viewer);
  details.appendChild(imageInfo);
}

function loadImage(image, details) {
  if (!details.summary.startsWith("️🔎")) {
    details.summary = "️🔎 " + details.summary;
  }
  if (details.open) {
    showImage(image, details);
  }
  if (details.showImageListener) {
    details.removeEventListener("sl-show", details.showImageListener);
  }
  details.showImageListener = () => {
    showImage(image, details);
  };
  details.addEventListener("sl-show", details.showImageListener);
}
globalThis.loadImage = loadImage;

import { LitElement, html, nothing } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import { ItkWasmMultiscaleSpatialImage } from "@itk-viewer/io/ItkWasmMultiscaleSpatialImage.js";
import "@itk-viewer/element/itk-viewer-2d.js";

export class ItkImageDetails extends LitElement {
  static properties = {
    disabled: { type: Boolean, reflect: true},
    summary: { type: String },
    image: { state: true },
  };

  details = createRef();
  viewer = createRef();

  constructor() {
    super();
    this.disabled = true;
    this.summary = "";
    this.image = undefined;
  }

  loadImage() {
    const multiImage = new ItkWasmMultiscaleSpatialImage(this.image);
    // need to wait a tick due to bad actor setup flow in @itk-viewer/element
    setTimeout(() => {
      const viewerActor = this.viewer.value.getActor();
      viewerActor.send({ type: "setImage", image: multiImage });
    }, 0);
  }

  setImage(image) {
    this.image = image;
    this.disabled = !image;
    if (this.details.value.open) {
      this.loadImage();
    }
  }

  renderImage(image) {
    return html`
      <itk-viewer-2d
        ${ref(this.viewer)}
        style="width: 100%; height: 26rem;"
      ></itk-viewer-2d>
      <pre>${JSON.stringify(image, interfaceTypeJsonReplacer, 2)}</pre>
    `;
  }

  render() {
    const disabled = this.disabled ? true : nothing;
    const summary =
      this.image === undefined ? this.summary : "️🔎 " + this.summary;

    return html`
      <sl-details
        disabled=${disabled}
        summary=${summary}
        @sl-show=${this.loadImage}
        ${ref(this.details)}
      >
        ${this.image ? this.renderImage(this.image) : nothing}
      </sl-details>
    `;
  }
}

customElements.define("itk-image-details", ItkImageDetails);

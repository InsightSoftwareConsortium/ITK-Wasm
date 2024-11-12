import * as transformIo from "../../../dist/index.js";
import readTransformLoadSampleInputs, {
  usePreRun,
} from "./read-transform-load-sample-inputs.js";

class ReadTransformModel {
  inputs: Map<string, any>;
  options: Map<string, any>;
  outputs: Map<string, any>;

  constructor() {
    this.inputs = new Map();
    this.options = new Map();
    this.outputs = new Map();
  }
}

class ReadTransformController {
  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs;

    this.model = new ReadTransformModel();
    const model = this.model;

    this.webWorker = null;

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector(
        "#readTransformInputs [name=loadSampleInputs]"
      );
      loadSampleInputsButton.setAttribute("style", "display: block-inline;");
      loadSampleInputsButton.addEventListener("click", async (event) => {
        loadSampleInputsButton.loading = true;
        await loadSampleInputs(model);
        loadSampleInputsButton.loading = false;
      });
    }

    // ----------------------------------------------
    // Inputs
    const serializedTransformElement = document.querySelector(
      "#readTransformInputs input[name=serialized-transform-file]"
    );
    serializedTransformElement.addEventListener("change", async (event) => {
      const dataTransfer = event.dataTransfer;
      const files = event.target.files || dataTransfer.files;

      const arrayBuffer = await files[0].arrayBuffer();
      model.inputs.set("serializedTransform", {
        data: new Uint8Array(arrayBuffer),
        path: files[0].name,
      });
      const details = document.getElementById(
        "readTransform-serialized-transform-details"
      );
      details.innerHTML = `<pre>${globalThis.escapeHtml(
        model.inputs
          .get("serializedTransform")
          .data.subarray(0, 50)
          .toString() + " ..."
      )}</pre>`;
      details.disabled = false;
    });

    // ----------------------------------------------
    // Options
    const floatParametersElement = document.querySelector(
      "#readTransformInputs sl-checkbox[name=float-parameters]"
    );
    floatParametersElement.addEventListener("sl-change", (event) => {
      model.options.set("floatParameters", floatParametersElement.checked);
    });

    // ----------------------------------------------
    // Outputs
    const transformOutputDownload = document.querySelector(
      "#readTransformOutputs sl-button[name=transform-download]"
    );
    transformOutputDownload.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (model.outputs.has("transform")) {
        const transformDownloadFormat = document.getElementById(
          "transform-output-format"
        );
        const downloadFormat = transformDownloadFormat.value || "nrrd";
        const fileName = `transform.${downloadFormat}`;
        const { webWorker, serializedTransform } =
          await transformIo.writeTransform(
            model.outputs.get("transform"),
            fileName
          );

        webWorker.terminate();
        globalThis.downloadFile(serializedTransform, fileName);
      }
    });

    const preRun = async () => {
      if (!this.webWorker && loadSampleInputs && usePreRun) {
        await loadSampleInputs(model, true);
        await this.run();
      }
    };

    const onSelectTab = async (event) => {
      if (event.detail.name === "readTransform-panel") {
        const params = new URLSearchParams(window.location.search);
        if (
          !params.has("functionName") ||
          params.get("functionName") !== "readTransform"
        ) {
          params.set("functionName", "readTransform");
          const url = new URL(document.location);
          url.search = params;
          window.history.replaceState(
            { functionName: "readTransform" },
            "",
            url
          );
          await preRun();
        }
      }
    };

    const tabGroup = document.querySelector("sl-tab-group");
    tabGroup.addEventListener("sl-tab-show", onSelectTab);
    function onInit() {
      const params = new URLSearchParams(window.location.search);
      if (
        params.has("functionName") &&
        params.get("functionName") === "readTransform"
      ) {
        tabGroup.show("readTransform-panel");
        preRun();
      }
    }
    onInit();

    const runButton = document.querySelector(
      '#readTransformInputs sl-button[name="run"]'
    );
    runButton.addEventListener("click", async (event) => {
      event.preventDefault();

      if (!model.inputs.has("serializedTransform")) {
        globalThis.notify(
          "Required input not provided",
          "serializedTransform",
          "danger",
          "exclamation-octagon"
        );
        return;
      }

      try {
        runButton.loading = true;

        const t0 = performance.now();
        const { transform } = await this.run();
        const t1 = performance.now();
        globalThis.notify(
          "readTransform successfully completed",
          `in ${t1 - t0} milliseconds.`,
          "success",
          "rocket-fill"
        );

        model.outputs.set("transform", transform);
        transformOutputDownload.variant = "success";
        transformOutputDownload.disabled = false;
        const transformDetails = document.getElementById(
          "readTransform-transform-details"
        );
        transformDetails.innerHTML = `<pre>${globalThis.escapeHtml(
          JSON.stringify(transform, globalThis.interfaceTypeJsonReplacer, 2)
        )}</pre>`;
        transformDetails.disabled = false;
        const transformOutput = document.getElementById(
          "readTransform-transform-details"
        );
      } catch (error) {
        globalThis.notify(
          "Error while running pipeline",
          error.toString(),
          "danger",
          "exclamation-octagon"
        );
        throw error;
      } finally {
        runButton.loading = false;
      }
    });
  }

  async run() {
    const options = Object.fromEntries(this.model.options.entries());
    options.webWorker = this.webWorker;
    const { webWorker, transform } = await transformIo.readTransform(
      {
        data: this.model.inputs.get("serializedTransform").data.slice(),
        path: this.model.inputs.get("serializedTransform").path,
      },
      options
    );
    this.webWorker = webWorker;

    return { transform };
  }
}

const readTransformController = new ReadTransformController(
  readTransformLoadSampleInputs
);

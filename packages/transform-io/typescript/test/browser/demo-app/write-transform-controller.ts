import { readTransform } from "../../../dist/index.js";
import * as transformIo from "../../../dist/index.js";
import writeTransformLoadSampleInputs, {
  usePreRun,
} from "./write-transform-load-sample-inputs.js";

class WriteTransformModel {
  inputs: Map<string, any>;
  options: Map<string, any>;
  outputs: Map<string, any>;

  constructor() {
    this.inputs = new Map();
    this.options = new Map();
    this.outputs = new Map();
  }
}

class WriteTransformController {
  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs;

    this.model = new WriteTransformModel();
    const model = this.model;

    this.webWorker = null;

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector(
        "#writeTransformInputs [name=loadSampleInputs]"
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
    const transformElement = document.querySelector(
      "#writeTransformInputs input[name=transform-file]"
    );
    transformElement.addEventListener("change", async (event) => {
      const dataTransfer = event.dataTransfer;
      const files = event.target.files || dataTransfer.files;

      const { transform, webWorker } = await readTransform(files[0]);
      webWorker.terminate();
      model.inputs.set("transform", transform);
      const details = document.getElementById(
        "writeTransform-transform-details"
      );
      details.innerHTML = `<pre>${globalThis.escapeHtml(
        JSON.stringify(transform, globalThis.interfaceTypeJsonReplacer, 2)
      )}</pre>`;
      details.disabled = false;
    });

    const serializedTransformElement = document.querySelector(
      "#writeTransformInputs sl-input[name=serialized-transform]"
    );
    serializedTransformElement.addEventListener("sl-change", (event) => {
      model.inputs.set("serializedTransform", serializedTransformElement.value);
    });

    // ----------------------------------------------
    // Options
    const floatParametersElement = document.querySelector(
      "#writeTransformInputs sl-checkbox[name=float-parameters]"
    );
    floatParametersElement.addEventListener("sl-change", (event) => {
      model.options.set("floatParameters", floatParametersElement.checked);
    });

    // ----------------------------------------------
    // Outputs
    const serializedTransformOutputDownload = document.querySelector(
      "#writeTransformOutputs sl-button[name=serialized-transform-download]"
    );
    serializedTransformOutputDownload.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (model.outputs.has("serializedTransform")) {
        globalThis.downloadFile(
          model.outputs.get("serializedTransform").data,
          model.outputs.get("serializedTransform").path
        );
      }
    });

    const preRun = async () => {
      if (!this.webWorker && loadSampleInputs && usePreRun) {
        await loadSampleInputs(model, true);
        await this.run();
      }
    };

    const onSelectTab = async (event) => {
      if (event.detail.name === "writeTransform-panel") {
        const params = new URLSearchParams(window.location.search);
        if (
          !params.has("functionName") ||
          params.get("functionName") !== "writeTransform"
        ) {
          params.set("functionName", "writeTransform");
          const url = new URL(document.location);
          url.search = params;
          window.history.replaceState(
            { functionName: "writeTransform" },
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
        params.get("functionName") === "writeTransform"
      ) {
        tabGroup.show("writeTransform-panel");
        preRun();
      }
    }
    onInit();

    const runButton = document.querySelector(
      '#writeTransformInputs sl-button[name="run"]'
    );
    runButton.addEventListener("click", async (event) => {
      event.preventDefault();

      if (!model.inputs.has("transform")) {
        globalThis.notify(
          "Required input not provided",
          "transform",
          "danger",
          "exclamation-octagon"
        );
        return;
      }

      try {
        runButton.loading = true;

        const t0 = performance.now();
        const { couldWrite, serializedTransform } = await this.run();
        const t1 = performance.now();
        globalThis.notify(
          "writeTransform successfully completed",
          `in ${t1 - t0} milliseconds.`,
          "success",
          "rocket-fill"
        );

        model.outputs.set("couldWrite", couldWrite);
        model.outputs.set("serializedTransform", serializedTransform);

        serializedTransformOutputDownload.variant = "success";
        serializedTransformOutputDownload.disabled = false;
        const serializedTransformOutput = document.getElementById(
          "writeTransform-serialized-transform-details"
        );
        serializedTransformOutput.innerHTML = `<pre>${globalThis.escapeHtml(
          serializedTransform.data.subarray(0, 1024).toString() + " ..."
        )}</pre>`;
        serializedTransformOutput.disabled = false;
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
    const { webWorker, couldWrite, serializedTransform } =
      await transformIo.writeTransform(
        this.model.inputs.get("transform"),
        this.model.inputs.get("serializedTransform"),
        options
      );
    this.webWorker = webWorker;

    return { couldWrite, serializedTransform };
  }
}

const writeTransformController = new WriteTransformController(
  writeTransformLoadSampleInputs
);

import * as meshIo from "../../../dist/index.js";
import readPointSetLoadSampleInputs, {
  usePreRun,
} from "./read-point-set-load-sample-inputs.js";

class ReadPointSetModel {
  inputs: Map<string, any>;
  options: Map<string, any>;
  outputs: Map<string, any>;

  constructor() {
    this.inputs = new Map();
    this.options = new Map();
    this.outputs = new Map();
  }
}

class ReadPointSetController {
  constructor(loadSampleInputs) {
    this.loadSampleInputs = loadSampleInputs;

    this.model = new ReadPointSetModel();
    const model = this.model;

    this.webWorker = null;

    if (loadSampleInputs) {
      const loadSampleInputsButton = document.querySelector(
        "#readPointSetInputs [name=loadSampleInputs]",
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
    const serializedPointSetElement = document.querySelector(
      "#readPointSetInputs input[name=serialized-point-set-file]",
    );
    serializedPointSetElement.addEventListener("change", async (event) => {
      const dataTransfer = event.dataTransfer;
      const files = event.target.files || dataTransfer.files;

      const arrayBuffer = await files[0].arrayBuffer();
      model.inputs.set("serializedPointSet", {
        data: new Uint8Array(arrayBuffer),
        path: files[0].name,
      });
      const details = document.getElementById(
        "readPointSet-serialized-point-set-details",
      );
      details.innerHTML = `<pre>${globalThis.escapeHtml(model.inputs.get("serializedPointSet").data.subarray(0, 50).toString() + " ...")}</pre>`;
      details.disabled = false;
    });

    // ----------------------------------------------
    // Options
    const informationOnlyElement = document.querySelector(
      "#readPointSetInputs sl-checkbox[name=information-only]",
    );
    informationOnlyElement.addEventListener("sl-change", (event) => {
      model.options.set("informationOnly", informationOnlyElement.checked);
    });

    // ----------------------------------------------
    // Outputs
    const pointSetOutputDownload = document.querySelector(
      "#readPointSetOutputs sl-button[name=point-set-download]",
    );
    pointSetOutputDownload.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (model.outputs.has("pointSet")) {
        const pointSetDownloadFormat = document.getElementById(
          "point-set-output-format",
        );
        const downloadFormat = pointSetDownloadFormat.value || "nrrd";
        const fileName = `pointSet.${downloadFormat}`;
        const { webWorker, serializedPointSet } = await meshIo.writePointSet(
          model.outputs.get("pointSet"),
          fileName,
        );

        webWorker.terminate();
        globalThis.downloadFile(serializedPointSet, fileName);
      }
    });

    const preRun = async () => {
      if (!this.webWorker && loadSampleInputs && usePreRun) {
        await loadSampleInputs(model, true);
        await this.run();
      }
    };

    const onSelectTab = async (event) => {
      if (event.detail.name === "readPointSet-panel") {
        const params = new URLSearchParams(window.location.search);
        if (
          !params.has("functionName") ||
          params.get("functionName") !== "readPointSet"
        ) {
          params.set("functionName", "readPointSet");
          const url = new URL(document.location);
          url.search = params;
          window.history.replaceState(
            { functionName: "readPointSet" },
            "",
            url,
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
        params.get("functionName") === "readPointSet"
      ) {
        tabGroup.show("readPointSet-panel");
        preRun();
      }
    }
    onInit();

    const runButton = document.querySelector(
      '#readPointSetInputs sl-button[name="run"]',
    );
    runButton.addEventListener("click", async (event) => {
      event.preventDefault();

      if (!model.inputs.has("serializedPointSet")) {
        globalThis.notify(
          "Required input not provided",
          "serializedPointSet",
          "danger",
          "exclamation-octagon",
        );
        return;
      }

      try {
        runButton.loading = true;

        const t0 = performance.now();
        const { couldRead, pointSet } = await this.run();
        const t1 = performance.now();
        globalThis.notify(
          "readPointSet successfully completed",
          `in ${t1 - t0} milliseconds.`,
          "success",
          "rocket-fill",
        );

        model.outputs.set("pointSet", pointSet);
        pointSetOutputDownload.variant = "success";
        pointSetOutputDownload.disabled = false;
        const pointSetDetails = document.getElementById(
          "readPointSet-point-set-details",
        );
        pointSetDetails.innerHTML = `<pre>${globalThis.escapeHtml(JSON.stringify(pointSet, globalThis.interfaceTypeJsonReplacer, 2))}</pre>`;
        pointSetDetails.disabled = false;
        const pointSetOutput = document.getElementById(
          "readPointSet-point-set-details",
        );
      } catch (error) {
        globalThis.notify(
          "Error while running pipeline",
          error.toString(),
          "danger",
          "exclamation-octagon",
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
    const { webWorker, pointSet } = await meshIo.readPointSet(
      {
        data: this.model.inputs.get("serializedPointSet").data.slice(),
        path: this.model.inputs.get("serializedPointSet").path,
      },
      options,
    );
    this.webWorker = webWorker;

    return { pointSet };
  }
}

const readPointSetController = new ReadPointSetController(
  readPointSetLoadSampleInputs,
);

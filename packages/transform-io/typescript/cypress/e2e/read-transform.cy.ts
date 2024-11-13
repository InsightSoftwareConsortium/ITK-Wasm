import { demoServer, verifyTestLinearTransform } from "./common.ts";

describe("read-transform", () => {
  beforeEach(function () {
    cy.visit(demoServer);

    const testPathPrefix = "../test/data/input/";

    const testTransformFiles = ["LinearTransform.h5"];
    testTransformFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName);
    });
  });

  it("Reads an transform File in the demo", function () {
    cy.get('sl-tab[panel="readTransform-panel"]').click();

    const testFile = {
      contents: new Uint8Array(this["LinearTransform.h5"]),
      fileName: "LinearTransform.h5",
    };
    cy.get(
      '#readTransformInputs input[name="serialized-transform-file"]'
    ).selectFile([testFile], { force: true });
    cy.get("#readTransform-serialized-transform-details").should(
      "contain",
      "137,72"
    );

    cy.get('#readTransformInputs sl-button[name="run"]').click();

    cy.get("#readTransform-transform-details").should(
      "contain",
      "transformType"
    );
  });

  it("Reads an transform BinaryFile", function () {
    cy.window().then(async (win) => {
      const arrayBuffer = new Uint8Array(this["LinearTransform.h5"]).buffer;
      const { transform, webWorker } = await win.transformIo.readTransform({
        data: new Uint8Array(arrayBuffer),
        path: "LinearTransform.h5",
      });
      webWorker.terminate();
      verifyTestLinearTransform(transform);
    });
  });

  it("Reads an transform File", function () {
    cy.window().then(async (win) => {
      const arrayBuffer = new Uint8Array(this["LinearTransform.h5"]).buffer;
      const transformFile = new win.File([arrayBuffer], "LinearTransform.h5");
      const { transform, webWorker } = await win.transformIo.readTransform(
        transformFile
      );
      webWorker.terminate();
      verifyTestLinearTransform(transform);
    });
  });

  it("Reads re-uses a WebWorker", function () {
    cy.window().then(async (win) => {
      const arrayBuffer = new Uint8Array(this["LinearTransform.h5"]).buffer;
      const transformFile = new win.File([arrayBuffer], "LinearTransform.h5");
      const { webWorker } = await win.transformIo.readTransform(transformFile);
      const { transform } = await win.transformIo.readTransform(transformFile, {
        webWorker,
      });
      webWorker.terminate();
      verifyTestLinearTransform(transform);
    });
  });

  it(
    "Throws a catchable error for an invalid file",
    { defaultCommandTimeout: 120000 },
    function () {
      cy.window().then(async (win) => {
        const invalidArray = new Uint8Array([21, 4, 4, 4, 4, 9, 5, 0, 82, 42]);
        const invalidBlob = new win.Blob([invalidArray]);
        const invalidFile = new win.File([invalidBlob], "invalid.file");
        try {
          const { webWorker, transform } = await win.transformIo.readTransform(
            invalidFile
          );
          webWorker.terminate();
        } catch (error) {
          cy.expect(error.message).to.equal(
            "Could not find IO for: invalid.file"
          );
        }
      });
    }
  );
});

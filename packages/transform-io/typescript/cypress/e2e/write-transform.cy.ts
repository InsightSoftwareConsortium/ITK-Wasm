import { demoServer, verifyTestLinearTransform } from "./common.ts";

describe("write-transform", () => {
  beforeEach(function () {
    cy.visit(demoServer);

    const testPathPrefix = "../test/data/input/";

    const testTransformFiles = ["LinearTransform.iwt.cbor"];
    testTransformFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName);
    });
  });

  it("Writes an transform in the demo", function () {
    cy.get('sl-tab[panel="writeTransform-panel"]').click();

    const testFile = {
      contents: new Uint8Array(this["LinearTransform.iwt.cbor"]),
      fileName: "LinearTransform.iwt.cbor",
    };
    cy.get('#writeTransformInputs input[name="transform-file"]').selectFile(
      [testFile],
      {
        force: true,
      }
    );
    cy.get("#writeTransform-transform-details").should(
      "contain",
      "transformType"
    );
    cy.get('#writeTransformInputs sl-input[name="serialized-transform"]')
      .find("input", { includeShadowDom: true })
      .type("LinearTransform.h5", { force: true });

    cy.get('#writeTransformInputs sl-button[name="run"]').click();

    cy.get("#writeTransform-serialized-transform-details").should(
      "contain",
      "137,72"
    );
  });

  it("Writes an transform to an ArrayBuffer", function () {
    cy.window().then(async (win) => {
      const arrayBuffer = new Uint8Array(this["LinearTransform.iwt.cbor"])
        .buffer;
      const { transform, webWorker } = await win.transformIo.readTransform({
        data: new Uint8Array(arrayBuffer),
        path: "LinearTransform.iwt.cbor",
      });
      const { serializedTransform } = await win.transformIo.writeTransform(
        transform,
        "LinearTransform.h5",
        {
          webWorker,
        }
      );
      const { transform: transformBack } = await win.transformIo.readTransform(
        serializedTransform,
        {
          webWorker,
        }
      );
      webWorker.terminate();
      verifyTestLinearTransform(transformBack);
    });
  });
});

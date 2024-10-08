import { demoServer, verifyPointSet } from "./common.ts";

describe("write-point-set", () => {
  beforeEach(function () {
    cy.visit(demoServer);

    const testPathPrefix = "../test/data/baseline/";

    const testPointSetFiles = ["obj-read-point-set-test.iwm.cbor"];
    testPointSetFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName);
    });
  });

  it("Writes an point set in the demo", function () {
    cy.get('sl-tab[panel="writePointSet-panel"]').click();

    const testFile = {
      contents: new Uint8Array(this["obj-read-point-set-test.iwm.cbor"]),
      fileName: "obj-read-point-set-test.iwm.cbor",
    };
    cy.get('#writePointSetInputs input[name="point-set-file"]').selectFile(
      [testFile],
      {
        force: true,
      },
    );
    cy.get("#writePointSet-point-set-details").should(
      "contain",
      "pointSetType",
    );
    cy.get('#writePointSetInputs sl-input[name="serialized-point-set"]')
      .find("input", { includeShadowDom: true })
      .type("point-set.vtk", { force: true });

    cy.get('#writePointSetInputs sl-button[name="run"]').click();

    cy.get("#writePointSet-serialized-point-set-details").should(
      "contain",
      "35,32",
    );
  });

  it("Writes an point set to an ArrayBuffer", function () {
    cy.window().then(async (win) => {
      const arrayBuffer = new Uint8Array(
        this["obj-read-point-set-test.iwm.cbor"],
      ).buffer;
      const { pointSet, webWorker } = await win.meshIo.readPointSet({
        data: new Uint8Array(arrayBuffer),
        path: "obj-read-point-set-test.iwm.cbor",
      });
      const { serializedPointSet } = await win.meshIo.writePointSet(
        pointSet,
        "point-set.iwm.cbor",
        {
          webWorker,
        },
      );
      const { pointSet: pointSetBack } = await win.meshIo.readPointSet(
        serializedPointSet,
        {
          webWorker,
        },
      );
      webWorker.terminate();
      verifyPointSet(pointSetBack);
    });
  });
});

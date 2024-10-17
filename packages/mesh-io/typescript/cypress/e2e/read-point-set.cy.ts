import { demoServer, verifyPointSet } from "./common.ts";

describe("read-point-set", () => {
  beforeEach(function () {
    cy.visit(demoServer);

    const testPathPrefix = "../test/data/input/";

    const testImageFiles = ["box-points.obj"];
    testImageFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName);
    });
  });

  it("Reads an point set File in the demo", function () {
    cy.get('sl-tab[panel="readPointSet-panel"]').click();

    const testFile = {
      contents: new Uint8Array(this["box-points.obj"]),
      fileName: "box-points.obj",
    };
    cy.get(
      '#readPointSetInputs input[name="serialized-point-set-file"]',
    ).selectFile([testFile], { force: true });
    cy.get("#readPointSet-serialized-point-set-details").should(
      "contain",
      "35,9",
    );

    cy.get('#readPointSetInputs sl-button[name="run"]').click();

    cy.get("#readPointSet-point-set-details").should("contain", "pointSetType");
  });

  it("Reads an pointSet BinaryFile", function () {
    cy.window().then(async (win) => {
      const arrayBuffer = new Uint8Array(this["box-points.obj"]).buffer;
      const { pointSet, webWorker } = await win.meshIo.readPointSet({
        data: new Uint8Array(arrayBuffer),
        path: "box-points.obj",
      });
      webWorker.terminate();
      verifyPointSet(pointSet);
    });
  });

  it("Reads an pointSet File", function () {
    cy.window().then(async (win) => {
      const arrayBuffer = new Uint8Array(this["box-points.obj"]).buffer;
      const cowFile = new win.File([arrayBuffer], "box-points.obj");
      const { pointSet, webWorker } = await win.meshIo.readPointSet(cowFile);
      webWorker.terminate();
      verifyPointSet(pointSet);
    });
  });

  it("Reads re-uses a WebWorker", function () {
    cy.window().then(async (win) => {
      const arrayBuffer = new Uint8Array(this["box-points.obj"]).buffer;
      const cowFile = new win.File([arrayBuffer], "box-points.obj");
      const { webWorker } = await win.meshIo.readPointSet(cowFile);
      const { pointSet } = await win.meshIo.readPointSet(cowFile, {
        webWorker,
      });
      webWorker.terminate();
      verifyPointSet(pointSet);
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
          const { webWorker, pointSet } =
            await win.meshIo.readPointSet(invalidFile);
          webWorker.terminate();
        } catch (error) {
          cy.expect(error.message).to.equal(
            "Could not find IO for: invalid.file",
          );
        }
      });
    },
  );
});

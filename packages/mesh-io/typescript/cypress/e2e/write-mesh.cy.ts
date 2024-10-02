import { demoServer, verifyMesh } from "./common.ts";

describe("write-mesh", () => {
  beforeEach(function () {
    cy.visit(demoServer);

    const testPathPrefix = "../test/data/input/";

    const testMeshFiles = ["cow.iwm.cbor"];
    testMeshFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName);
    });
  });

  it("Writes an mesh in the demo", function () {
    cy.get('sl-tab[panel="writeMesh-panel"]').click();

    const testFile = {
      contents: new Uint8Array(this["cow.iwm.cbor"]),
      fileName: "cow.iwm.cbor",
    };
    cy.get('#writeMeshInputs input[name="mesh-file"]').selectFile([testFile], {
      force: true,
    });
    cy.get("#writeMesh-mesh-details").should("contain", "meshType");
    cy.get('#writeMeshInputs sl-input[name="serialized-mesh"]')
      .find("input", { includeShadowDom: true })
      .type("cow.vtk", { force: true });

    cy.get('#writeMeshInputs sl-button[name="run"]').click();

    cy.get("#writeMesh-serialized-mesh-details").should("contain", "35,32");
  });

  it("Writes an mesh to an ArrayBuffer", function () {
    cy.window().then(async (win) => {
      const arrayBuffer = new Uint8Array(this["cow.iwm.cbor"]).buffer;
      const { mesh, webWorker } = await win.meshIo.readMesh({
        data: new Uint8Array(arrayBuffer),
        path: "cow.iwm.cbor",
      });
      const { serializedMesh } = await win.meshIo.writeMesh(mesh, "cow.vtk", {
        webWorker,
      });
      const { mesh: meshBack } = await win.meshIo.readMesh(serializedMesh, {
        webWorker,
      });
      webWorker.terminate();
      verifyMesh(meshBack);
    });
  });
});

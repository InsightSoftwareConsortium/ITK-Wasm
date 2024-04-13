const demoServer = "http://localhost:5176";

describe("interface type to json functions", () => {
  beforeEach(function () {
    cy.visit(demoServer);

    const testPathPrefix = "../test/data/input/";

    const testFiles = ["cthead1.png", "cow.vtk"];
    testFiles.forEach((fileName) => {
      cy.readFile(`${testPathPrefix}${fileName}`, null).as(fileName);
    });
  });

  it("imageToJson, jsonToImage roundtrips", function () {
    cy.window().then(async (win) => {
      const path = "cthead1.png";
      const imageArrayBuffer = new Uint8Array(this[path]).buffer;
      const { image, webWorker } = await win.imageIo.readImage({
        path,
        data: new Uint8Array(imageArrayBuffer),
      });
      const { encoded } = await win.compressStringify.imageToJson(image, {
        webWorker,
      });
      const jsonImage = await win.compressStringify.jsonToImage(encoded, {
        webWorker,
      });

      const { metrics } = await win.compareImages.compareImages(image, {
        baselineImages: [jsonImage.decoded],
      });
      cy.expect(metrics.almostEqual).to.be.true;
      webWorker.terminate();
    });
  });

  it("meshToJson, jsonToMesh roundtrips", function () {
    cy.window().then(async (win) => {
      const path = "cow.vtk";
      const meshArrayBuffer = new Uint8Array(this[path]).buffer;
      const { mesh, webWorker } = await win.meshIo.readMesh({
        path,
        data: new Uint8Array(meshArrayBuffer),
      });
      const { encoded } = await win.compressStringify.meshToJson(mesh, {
        webWorker,
      });
      const jsonMesh = await win.compressStringify.jsonToMesh(encoded, {
        webWorker,
      });

      const { metrics } = await win.compareMeshes.compareMeshes(mesh, {
        baselineMeshes: [jsonMesh.decoded],
      });
      cy.expect(metrics.almostEqual).to.be.true;
      webWorker.terminate();
    });
  });

  it("polyDataToJson, jsonToPolyData roundtrips", function () {
    cy.window().then(async (win) => {
      const path = "cow.vtk";
      const meshArrayBuffer = new Uint8Array(this[path]).buffer;
      const { mesh, webWorker } = await win.meshIo.readMesh({
        path,
        data: new Uint8Array(meshArrayBuffer),
      });
      const { polyData } = await win.meshToPolyData.meshToPolyData(mesh, {
        webWorker,
      });
      const { mesh: polyDataMesh } = await win.meshToPolyData.polyDataToMesh(
        polyData,
        { webWorker },
      );
      const { encoded } = await win.compressStringify.polyDataToJson(polyData, {
        webWorker,
      });
      const jsonPolyData = await win.compressStringify.jsonToPolyData(encoded, {
        webWorker,
      });

      const { mesh: jsonPolyDataMesh } =
        await win.meshToPolyData.polyDataToMesh(jsonPolyData.decoded, {
          webWorker,
        });

      const { metrics } = await win.compareMeshes.compareMeshes(
        jsonPolyDataMesh,
        {
          baselineMeshes: [polyDataMesh],
        },
      );
      cy.expect(metrics.almostEqual).to.be.true;
      webWorker.terminate();
    });
  });
});

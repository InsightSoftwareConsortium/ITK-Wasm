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
    });
  });
});

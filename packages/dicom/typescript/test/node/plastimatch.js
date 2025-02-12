import fs from "fs";
import test from "ava";
import path from "path";
import { writeRtStructNode } from "../../dist/index-node.js";

const testPathPrefix = "../test/data/input/";
const outputPathPrefix = "../test/data/output/";

test("writeRtStructNode creates an RT Struct Structured Set", async (t) => {
  const fileName = "rt-struct/synth-lung-1.cxt";
  const testFilePath = path.join(testPathPrefix, fileName);
  const outputDicomPath = path.join(
    outputPathPrefix,
    "typescript-sync-lung-1-rtss.dcm"
  );

  await writeRtStructNode(testFilePath, outputDicomPath);

  t.assert(fs.existsSync(outputDicomPath));
});

test("writeRtStructNode creates an RT Struct Structured Set with custom metadata", async (t) => {
  const fileName = "rt-struct/synth-lung-1.cxt";
  const testFilePath = path.join(testPathPrefix, fileName);
  const metadataFileName = "rt-struct/dicom-metadata.json";
  const metadataFilePath = path.join(testPathPrefix, metadataFileName);
  const dicomMetadata = JSON.parse(fs.readFileSync(metadataFilePath, "utf8"));
  const outputDicomPath = path.join(
    outputPathPrefix,
    "typescript-sync-lung-1-rtss-custom-metadata.dcm"
  );

  await writeRtStructNode(testFilePath, outputDicomPath, { dicomMetadata });

  t.assert(fs.existsSync(outputDicomPath));
});

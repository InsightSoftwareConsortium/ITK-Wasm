import test from "ava";

import { sliceMeshNode } from "../../dist/index-node.js";

import { readMeshNode } from "@itk-wasm/mesh-io";
import { compareMeshesNode } from "@itk-wasm/compare-meshes";

import { testBaselinePath } from "./common.js";

test("sliceMeshNode extracts polylines at planes", async (t) => {
  const inputMeshPath = `${testBaselinePath}/suzanne-repair.off`;
  const inputMesh = await readMeshNode(inputMeshPath);

  const planes = [
    {
      origin: [0.0, 0.0, 0.0],
      normal: [0.0, 0.0, 1.0],
    },
    {
      origin: [0.0, 0.0, 1.0],
      normal: [0.0, 0.0, 1.0],
    },
    {
      origin: [0.0, 0.0, 2.0],
      normal: [0.0, 0.0, 1.0],
    },
  ];

  const { polylines } = await sliceMeshNode(inputMesh, planes);

  const baselineMeshPath = `${testBaselinePath}/suzanne-slice.iwm.cbor`;
  const baselineMesh = await readMeshNode(baselineMeshPath);

  const { metrics } = await compareMeshesNode(polylines, {
    baselineMeshes: [baselineMesh],
  });
  t.assert(metrics.almostEqual);
});

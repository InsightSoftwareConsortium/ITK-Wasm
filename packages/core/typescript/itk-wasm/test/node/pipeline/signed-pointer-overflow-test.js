import test from 'ava'
import path from 'path'

import loadEmscriptenModuleNode from '../../../dist/pipeline/internal/load-emscripten-module-node.js'
import runPipelineEmscripten from '../../../dist/pipeline/internal/run-pipeline-emscripten.js'
import InterfaceTypes from '../../../dist/interface-types/interface-types.js'
import FloatTypes from '../../../dist/interface-types/float-types.js'
import PixelTypes from '../../../dist/interface-types/pixel-types.js'

/**
 * Regression test for signed pointer overflow in runPipelineEmscripten.
 *
 * When the WASM heap exceeds 2 GB, Emscripten's ccall returns pointers as
 * signed i32. Values above 2^31 wrap negative, causing:
 *
 *   RangeError: Start offset -N is outside the bounds of the buffer
 *
 * This only happens when a module is REUSED across calls (the browser web
 * worker pattern). runPipelineNode creates a fresh module per call, so the
 * heap never accumulates. We use loadEmscriptenModuleNode +
 * runPipelineEmscripten directly to mirror the real-world scenario:
 * two large image reads on the same worker.
 *
 * Real-world trigger: VolView loading a session with a large NIfTI base
 * image + embedded labelmap on the same ITK-wasm web worker.
 */

const MEDIAN_FILTER_PATH = path.resolve(
  'test',
  'pipelines',
  'emscripten-build',
  'median-filter-pipeline',
  'median-filter-test'
)

const createLargeFloat32Image = (dimX, dimY, dimZ) => ({
  imageType: {
    dimension: 3,
    componentType: FloatTypes.Float32,
    pixelType: PixelTypes.Scalar,
    components: 1
  },
  name: 'large-test-image',
  origin: [0.0, 0.0, 0.0],
  spacing: [1.0, 1.0, 1.0],
  direction: new Float64Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
  size: [dimX, dimY, dimZ],
  data: new Float32Array(dimX * dimY * dimZ),
  metadata: new Map()
})

test('runPipelineEmscripten with reused module — second large image triggers signed pointer overflow', async (t) => {
  t.timeout(300_000)

  const pipelineModule = await loadEmscriptenModuleNode(MEDIAN_FILTER_PATH)

  // Float32 640×640×512 ≈ 800 MB per image buffer.
  // First call grows the heap to ~1.6 GB (input + output).
  // Second call pushes it past 2 GB — output pointers exceed 2^31.
  const image = createLargeFloat32Image(640, 640, 512)

  const args = ['0', '0', '--radius', '1', '--memory-io']
  const desiredOutputs = [{ type: InterfaceTypes.Image }]
  const inputs = [{ type: InterfaceTypes.Image, data: image }]

  // First pipeline run — grows the heap
  const first = runPipelineEmscripten(pipelineModule, args, desiredOutputs, inputs)
  t.is(first.returnValue, 0, 'first pipeline run succeeds')
  t.truthy(first.outputs[0].data.data, 'first run returns image data')

  const heapAfterFirst = pipelineModule.HEAPU8.buffer.byteLength
  t.log(`Heap after first run: ${(heapAfterFirst / 1024 / 1024).toFixed(0)} MB`)

  // Second pipeline run on the SAME module — heap accumulates
  const second = runPipelineEmscripten(pipelineModule, args, desiredOutputs, inputs)
  t.is(second.returnValue, 0, 'second pipeline run succeeds')
  t.truthy(second.outputs[0].data.data, 'second run returns image data')

  const heapAfterSecond = pipelineModule.HEAPU8.buffer.byteLength
  t.log(`Heap after second run: ${(heapAfterSecond / 1024 / 1024).toFixed(0)} MB`)
})

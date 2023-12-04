import * as Comlink from 'comlink'

import WorkerOperations from './worker-operations.js'

type WorkerProxy = Comlink.Remote<WorkerOperations>

export default WorkerProxy

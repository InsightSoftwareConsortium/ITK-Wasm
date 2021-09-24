type WorkerPoolFunctionResult = { webWorker: Worker }

type WorkerPoolFunction = (webWorker: Worker | null, ...args: Array<any>) => Promise<WorkerPoolFunctionResult>

export default WorkerPoolFunction

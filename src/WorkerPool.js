class WorkerPool {
  /* The function, fcn, should accept null or an existing worker as its first argument.
   * It most also return and object with the used worker on the `webWorker`
   * property. Example: runPipelineBrowser. */
  constructor (poolSize, fcn) {
    this.fcn = fcn
    this.workerQueue = new Array(poolSize)
    this.workerQueue.fill(null)
    this.taskQueue = []
    this.results = []
    this.addingTasks = false
    this.runningWorkers = 0
  }

  // todo: change to #addTask(resultIndex, taskArgs) { after private methods
  // proposal accepted and supported by default in Babel.
  addTask (resultIndex, taskArgs) {
    if (this.workerQueue.length > 0) {
      const worker = this.workerQueue.pop()
      this.runningWorkers++
      this.fcn(worker, ...taskArgs).then(({ webWorker, ...result }) => {
        this.workerQueue.push(webWorker)
        this.runningWorkers--
        this.results[resultIndex] = result
        if (this.taskQueue.length > 0) {
          const reTask = this.taskQueue.shift()
          this.addTask(resultIndex, reTask)
        } else if (!this.addingTasks && !this.runningWorkers) {
          this.resolve(this.results)
        }
      })
    } else {
      this.taskQueue.push(taskArgs)
    }
  }

  runTasks (taskArgsArray) {
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.results = new Array(taskArgsArray.length)
      this.addingTasks = true
      taskArgsArray.forEach((taskArg, index) => {
        this.addTask(index, taskArg)
      })
      this.addingTasks = false
    })
  }
}

export default WorkerPool

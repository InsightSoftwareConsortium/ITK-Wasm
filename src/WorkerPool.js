class WorkerPool {
  /* poolSize is the maximum number of web workers to create in the pool.
   *
   * The function, fcn, should accept null or an existing worker as its first argument.
   * It most also return and object with the used worker on the `webWorker`
   * property.  * Example: runPipelineBrowser.
   *
   * An optional progressCallback will be cassed with the number of complete
   * tasks and the total number of tasks as arguments every time a task has
   * completed.
   **/
  constructor (poolSize, fcn, progressCallback) {
    this.fcn = fcn
    this.workerQueue = new Array(poolSize)
    this.workerQueue.fill(null)
    this.taskQueue = []
    this.results = []
    this.addingTasks = false
    this.runningWorkers = 0
    this.progressCallback = progressCallback
  }

  runTasks (taskArgsArray) {
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject

      this.results = new Array(taskArgsArray.length)
      this.completedTasks = 0

      this.addingTasks = true
      taskArgsArray.forEach((taskArg, index) => {
        this.addTask(index, taskArg)
      })
      this.addingTasks = false
    })
  }

  terminateWorkers () {
    for (let index = 0; index < this.workerQueue.length; index++) {
      const worker = this.workerQueue[index]
      if (worker) {
        worker.terminate()
      }
      this.workerQueue[index] = null
    }
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
        this.completedTasks++
        if (this.progressCallback) {
          this.progressCallback(this.completedTasks, this.results.length)
        }

        if (this.taskQueue.length > 0) {
          const reTask = this.taskQueue.shift()
          this.addTask(...reTask)
        } else if (!this.addingTasks && !this.runningWorkers) {
          this.resolve(this.results)
        }
      }).catch((error) => {
        this.reject(error)
      })
    } else {
      this.taskQueue.push([resultIndex, taskArgs])
    }
  }
}

export default WorkerPool

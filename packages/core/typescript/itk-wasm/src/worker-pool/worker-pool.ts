/* eslint-disable  @typescript-eslint/no-non-null-assertion */

import WorkerPoolProgressCallback from './worker-pool-progress-callback.js'
import WorkerPoolRunTasksResult from './worker-pool-run-tasks-result.js'
import WorkerPoolFunctionOption from './worker-pool-function-option.js'

interface RunInfo {
  taskQueue: any[]
  results: any[]
  addingTasks: boolean
  postponed: boolean
  runningWorkers: number
  index: number
  completedTasks: number
  progressCallback: WorkerPoolProgressCallback | null
  canceled: boolean | null
  resolve?: (results: any) => void
  reject?: (error: any) => void
}

class WorkerPool {
  fcn: Function

  workerQueue: Array<Worker | null>

  runInfo: RunInfo[]

  /*
   * poolSize is the maximum number of web workers to create in the pool.
   *
   * The function, `fcn,` must accept in its last argument an options object with a
   * `webWorker` property that is a web worker to use for computation. The
   * function must also return a promise that resolves to an object with the
   * with the results of the computation and the used worker in the `webWorker`
   * property.
   *
   **/
  constructor (poolSize: number, fcn: Function) {
    this.fcn = fcn

    this.workerQueue = new Array(poolSize)
    this.workerQueue.fill(null)

    this.runInfo = []
  }

  /*
   * Run the tasks specified by the arguments in the taskArgsArray that will
   * be passed to the pool fcn.
   *
   * An optional progressCallback will be called with the number of complete
   * tasks and the total number of tasks as arguments every time a task has
   * completed.
   *
   * Returns an object containing a promise ('promise') to communicate results
   * as well as an id ('runId') which can be used to cancel any remaining pending
   * tasks before they complete.
   */
  public runTasks (taskArgsArray: any[], progressCallback: WorkerPoolProgressCallback | null = null): WorkerPoolRunTasksResult {
    const info: RunInfo = {
      taskQueue: [],
      results: [],
      addingTasks: false,
      postponed: false,
      runningWorkers: 0,
      index: 0,
      completedTasks: 0,
      progressCallback,
      canceled: false
    }
    this.runInfo.push(info)
    info.index = this.runInfo.length - 1
    return {
      promise: new Promise((resolve, reject) => {
        info.resolve = resolve
        info.reject = reject

        info.results = new Array(taskArgsArray.length)
        info.completedTasks = 0

        info.addingTasks = true
        taskArgsArray.forEach((taskArg, index) => {
          this.addTask(info.index, index, taskArg)
        })
        info.addingTasks = false
      }),
      runId: info.index
    }
  }

  public terminateWorkers (): void {
    for (let index = 0; index < this.workerQueue.length; index++) {
      const worker = this.workerQueue[index]
      if (worker != null) {
        worker.terminate()
      }
      this.workerQueue[index] = null
    }
  }

  public cancel (runId: number): void {
    const info = this.runInfo[runId]
    if (info !== null && info !== undefined) {
      info.canceled = true
    }
  }

  private addTask<T extends any[]>(infoIndex: number, resultIndex: number, taskArgs: [...T, options: WorkerPoolFunctionOption]): void {
    const info = this.runInfo[infoIndex]

    if (info?.canceled === true) {
      info.reject!('Remaining tasks canceled')
      this.clearTask(info.index)
      return
    }

    if (this.workerQueue.length > 0) {
      const worker = this.workerQueue.pop() as Worker | null
      info.runningWorkers++
      taskArgs[taskArgs.length - 1].webWorker = worker as Worker
      // @ts-expect-error: TS7031: Binding element 'webWorker' implicitly has an 'any' type.
      this.fcn(...taskArgs).then(({ webWorker, ...result }) => {
        this.workerQueue.push(webWorker)
        // Check if this task was canceled while it was getting done
        if (this.runInfo[infoIndex] !== null) {
          info.runningWorkers--
          info.results[resultIndex] = result
          info.completedTasks++
          if (info.progressCallback != null) {
            info.progressCallback(info.completedTasks, info.results.length)
          }

          if (info.taskQueue.length > 0) {
            const reTask = info.taskQueue.shift() as any[]
            this.addTask(infoIndex, reTask[0], reTask[1])
          } else if (!info.addingTasks && info.runningWorkers === 0) {
            const results = info.results
            info.resolve!(results)
            this.clearTask(info.index)
          }
        }
      // @ts-expect-error: TS7006: Parameter 'error' implicitly has an 'any' type.
      }).catch((error) => {
        info.reject!(error)
        this.clearTask(info.index)
      })
    } else {
      if (info.runningWorkers !== 0 || info.postponed) {
        // At least one worker is working on these tasks, and it will pick up
        // the next item in the taskQueue when done.
        info.taskQueue.push([resultIndex, taskArgs])
      } else {
        // Try again later.
        info.postponed = true
        setTimeout(() => {
          info.postponed = false
          this.addTask(info.index, resultIndex, taskArgs)
        }, 50)
      }
    }
  }

  private clearTask (clearIndex: number): void {
    this.runInfo[clearIndex].results = []
    this.runInfo[clearIndex].taskQueue = []
    this.runInfo[clearIndex].progressCallback = null
    this.runInfo[clearIndex].canceled = null
    this.runInfo[clearIndex].reject = () => {}
    this.runInfo[clearIndex].resolve = () => {}
  }
}

export default WorkerPool

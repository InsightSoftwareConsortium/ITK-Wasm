const registerPromiseWorker = require('promise-worker-transferable/register')

registerPromiseWorker(function (inputType, data) {
  console.log(inputType)
  console.log(data)
})
console.log('in the web worker')

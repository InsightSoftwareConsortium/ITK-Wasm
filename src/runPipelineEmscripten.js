const runPipelineEmscripten = (module, args, outputs, inputs) => {
  module.resetModuleStdout()
  module.resetModuleStderr()
  module.callMain(args)
  const stdout = module.getModuleStdout()
  const stderr = module.getModuleStderr()

  return { stdout, stderr }
}

module.exports = runPipelineEmscripten

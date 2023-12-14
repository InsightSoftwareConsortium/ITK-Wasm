function outputOptionsCheck(interfaceJson) {
  interfaceJson.parameters.forEach((parameter) => {
    if (parameter.type.includes('OUTPUT')) {
      console.error(`OUTPUT options are not supported`)
      console.error(`  Violating pipeline: ${interfaceJson.name}`)
      console.error(`    Violating option: ${parameter.name}`)
      process.exit(1)
    }
  })
}

export default outputOptionsCheck

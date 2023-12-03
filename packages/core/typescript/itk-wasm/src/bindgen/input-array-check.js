function inputArrayCheck(interfaceJson) {
  interfaceJson.inputs.forEach((input) => {
    const isArray = input.itemsExpectedMax > 1
    if (isArray) {
      console.error('Positional multi-value inputs are currently not supported -- please use an option instead')
      console.error(`Violating option: ${input.name}`)
      process.exit(1)
    }
  })
}

export default inputArrayCheck

import chalk from 'chalk'

function die(message) {
  console.error(`\n😵  ${chalk.red(message)}`)
  process.exit(1)
}

export default die

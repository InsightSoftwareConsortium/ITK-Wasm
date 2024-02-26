import validatePackageName from 'validate-npm-package-name'

function isValidPackageName(packageName: string): boolean {
  const validationResult = validatePackageName(packageName)
  return validationResult.validForNewPackages
}

export default isValidPackageName

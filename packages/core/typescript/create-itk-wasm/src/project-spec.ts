interface ProjectSpec {
  name: string
  directory: string
  packageDescription: string
  author?: string
  repositoryUrl?: string
  license?: string
  typescriptPackageName?: string
  pythonPackageName?: string
}

export default ProjectSpec

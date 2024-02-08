import inquirer from 'inquirer'

import ProjectSpec from '../project-spec.js'
import isValidPackageName from '../is-valid-package-name.js'

async function inquireProjectSpec(
  project: ProjectSpec,
  askAnswered: boolean
): Promise<ProjectSpec> {
  if (project.name && !project.typescriptPackageName) {
    project.typescriptPackageName = project.name
  }
  if (project.name && !project.pythonPackageName) {
    project.pythonPackageName = project.name
  }

  const questions = [
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      default: project.name,
      askAnswered,
      validate: (input: string) => {
        if (isValidPackageName(input)) {
          return true
        }
        return 'Invalid project name. Must be a valid npm package name (lowercase and hyphens).'
      }
    },
    {
      type: 'input',
      name: 'directory',
      message: 'Output directory:',
      askAnswered,
      default: project.directory
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author:',
      askAnswered,
      default: project.author
    },
    {
      type: 'input',
      name: 'packageDescription',
      message: 'Description:',
      askAnswered,
      default: project.packageDescription
    },
    {
      type: 'input',
      name: 'repositoryUrl',
      message: 'Repository URL:',
      askAnswered,
      default: project.repositoryUrl
    },
    {
      type: 'input',
      name: 'license',
      message: 'License:',
      askAnswered,
      default: project.license
    },
    {
      type: 'input',
      name: 'typescriptPackageName',
      message: 'Typescript package name:',
      askAnswered,
      default: project.typescriptPackageName,
      validate: (input: string) => {
        if (isValidPackageName(input)) {
          return true
        }
        return 'Invalid typescript package name. Must be a valid npm package name (lowercase and hyphens).'
      }
    },
    {
      type: 'input',
      name: 'pythonPackageName',
      message: 'Python package name:',
      askAnswered,
      default: project.pythonPackageName
    }
  ]
  const answers = await inquirer.prompt(questions, project)
  return answers
}

export default inquireProjectSpec

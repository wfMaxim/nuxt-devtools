import type { Dirent } from 'node:fs'
import { lstat, readdir } from 'node:fs/promises'
import { resolve } from 'pathe'

export async function getFolderSize(
  dir: string,
): Promise<number> {
  const dirents = await readdir(dir, {
    withFileTypes: true,
  })

  if (dirents.length === 0)
    return 0

  const files: Dirent[] = []
  const directorys: Dirent[] = []

  for (const dirent of dirents) {
    if (dirent.isFile()) {
      files.push(dirent)
      continue
    }
    if (dirent.isDirectory())
      directorys.push(dirent)
  }

  const sizes = await Promise.all(
    [
      files.map(async (file) => {
        const path = resolve(dir, file.name)
        const { size } = await lstat(path)
        return size
      }),
      directorys.map((directory) => {
        const path = resolve(dir, directory.name)
        return getFolderSize(path)
      }),
    ].flat(),
  )

  return sizes.reduce((total, size) => (total += size), 0)
}

export async function getComponentProps(componentPath: string) {
  let componentOptions

  try {
    const component = await import(`${componentPath}`)
    componentOptions = component.default || component
  }
  catch (error) {
    console.error(`Error while importing component: ${error}`)
    return {}
  }

  const props = componentOptions.props || {}
  const propDetails = {}

  Object.keys(props).forEach((key) => {
    const prop = props[key]
    propDetails[key] = {
      type: prop.type ? prop.type.name || prop.type.toString() : 'Unknown',
      required: prop.required || false,
      default: prop.default,
    }
  })

  return propDetails
}

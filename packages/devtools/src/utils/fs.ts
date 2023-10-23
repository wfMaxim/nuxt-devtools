import type { Dirent } from 'node:fs'
import { lstat, readdir } from 'node:fs/promises'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { resolve } from 'pathe'

import { parse } from '@vue/compiler-sfc'

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

export async function getComponentProps(componentPath) {
  try {
    const filePath = path.resolve(__dirname, componentPath)
    const content = await fs.readFile(filePath, 'utf-8')
    const { descriptor, errors } = parse(content)

    if (errors && errors.length > 0) {
      /* eslint-disable-next-line no-console */
      console.error('Errors while parsing the Vue file:', errors)
      return {}
    }

    if (!descriptor) {
      /* eslint-disable-next-line no-console */
      console.error('Descriptor is undefined. The Vue file may not be correctly formatted.')
      return {}
    }

    if (descriptor.scriptSetup) {
      const scriptContent = descriptor.scriptSetup.content
      // Here you can use scriptContent to get your component props
      // You can either parse the scriptContent manually or try to execute it in a safe environment
      /* eslint-disable-next-line no-console */
      console.log('Script Setup Content:', await extractPropsFromScript(scriptContent))
    }

    if (descriptor.script) {
      const scriptContent = descriptor.script.content
      // Here you can use scriptContent to get your component props
      // You can either parse the scriptContent manually or try to execute it in a safe environment
      /* eslint-disable-next-line no-console */
      console.log('Script Content:', await extractPropsFromScript(scriptContent))
    }
  }
  catch (error) {
    /* eslint-disable-next-line no-console */
    console.error(`Error while importing component: ${error}`)
    return {}
  }
}

async function extractPropsFromScript(scriptContent) {
  const isCompositionAPI = scriptContent.includes('defineProps') || scriptContent.includes('<script setup>')

  if (isCompositionAPI)
    return extractPropsFromCompositionAPI(scriptContent)
  else
    return extractPropsFromOptionsAPI(scriptContent)
};

async function extractPropsFromCompositionAPI(scriptContent) {
  try {
    const propsRegex = /defineProps\(([\s\S]*?)\)/
    const match = scriptContent.match(propsRegex)

    if (match) {
      const propsContent = match[1].trim()
      // TODO: You would need to parse propsContent here to actually extract the prop types.
      // This could be complex depending on how props are defined and might require a full JS parser.
      return propsContent
    }
    else {
      /* eslint-disable-next-line no-console */
      console.log('No props found')
      return []
    }
  }
  catch (error) {
    /* eslint-disable-next-line no-console */
    console.log(error)
    return []
  }
};

function extractPropsFromOptionsAPI(scriptContent) {
  // Find the props property in the exported object
  const propsRegex = /props:\s*({[^}]*})/
  const match = scriptContent.match(propsRegex)

  if (match) {
    const propsContent = match[1].trim()
    /* eslint-disable-next-line no-console */
    return propsContent
  }
  else {
    /* eslint-disable-next-line no-console */
    console.log('No props found in exported object')
  }
}

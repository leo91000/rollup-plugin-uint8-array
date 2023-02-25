import { readFile } from 'node:fs/promises'
import { createFilter } from '@rollup/pluginutils'
import type { Plugin } from 'rollup'
import type { FilterPattern } from '@rollup/pluginutils'

export interface PluginOptions {
  include?: FilterPattern
  exclude?: FilterPattern
}

export function rollupPluginFileUint8Array({ include, exclude }: PluginOptions): Plugin {
  const filter = createFilter(include, exclude)

  return {
    name: 'uint8-array',
    async transform(_code, id) {
      if (!filter(id))
        return null

      const buffer = await readFile(id)

      return {
        code: `const file = new Uint8Array([${buffer.join(',')}]); export default file;`,
        map: { mappings: '' },
      }
    },
  }
}

export function rollupPluginB64({ include, exclude }: PluginOptions): Plugin {
  const filter = createFilter(include, exclude)

  return {
    name: 'b64',
    async transform(_code, id) {
      if (!filter(id))
        return null

      const buffer = await readFile(id, { encoding: 'base64' })

      return {
        code: `const file = "${buffer}"; export default file;`,
        map: { mappings: '' },
      }
    },
  }
}

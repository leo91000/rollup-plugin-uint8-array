import { readFileSync } from 'fs'
import { createFilter } from '@rollup/pluginutils'
import type { Plugin } from 'rollup'
import type { FilterPattern } from '@rollup/pluginutils'

export interface PluginOptions {
  include?: FilterPattern
  exclude?: FilterPattern
}

export function generateUInt8ArrayCode(buffer: Buffer) {
  const bytes: number[] = []

  for (const byte of buffer)
    bytes.push(byte)

  return `export default new Uint8Array(${JSON.stringify(bytes)});`
}

export function rollupPluginFileUint8Array({ include, exclude }: PluginOptions): Plugin {
  const filter = createFilter(include, exclude)

  return {
    name: 'uint8-array',
    transform: (_code, id) => {
      if (!filter(id))
        return null

      const buffer = readFileSync(id)

      return {
        code: generateUInt8ArrayCode(buffer),
        map: { mappings: '' },
      }
    },
  }
}

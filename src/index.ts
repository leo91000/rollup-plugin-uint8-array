import { readFileSync } from 'fs'
import { createFilter } from '@rollup/pluginutils'
import type { Plugin } from 'rollup'
import type { FilterPattern } from '@rollup/pluginutils'

export interface PluginOptions {
  include?: FilterPattern
  exclude?: FilterPattern
}

export function generateUInt8ArrayCode(b64: string) {
  return `
    function b64ToU8Array(base64) {
      let binary;
      if (typeof window !== 'undefined' && window.atob) {
        binary = window.atob(base64);
      } else {
        binary = Buffer.from(base64, 'base64').toString('binary');
      }

      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; ++i) { bytes[i] = binary.charCodeAt(i); }
      return bytes;
    }

    export default b64ToU8Array("${b64}");
  `
}

export function rollupPluginFileUint8Array({ include, exclude }: PluginOptions): Plugin {
  const filter = createFilter(include, exclude)

  return {
    name: 'uint8-array',
    transform: (_code, id) => {
      if (!filter(id))
        return null

      const buffer = readFileSync(id, { encoding: 'base64' })

      return {
        code: generateUInt8ArrayCode(buffer),
        map: { mappings: '' },
      }
    },
  }
}

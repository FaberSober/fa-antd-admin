import { definePreset, Preset } from 'unocss'

export interface MyPresetOptions {}

export default definePreset((options?: MyPresetOptions) => {
  return {
    name: 'fa-preset',
    presets: [],
    shortcuts: [
      // { logo: 'i-logos-react w-6em h-6em transform transition-800 hover:rotate-180' },
    ],
    rules: [
      // ...
    ],
    variants: [
      // ...
    ],
    // it supports most of the configuration you could have in the root config
  }
})

import eslint from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import globals from 'globals'

export default [
  { ignores: ['dist', 'coverage', 'playwright-report', 'test-results'] },
  eslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig(),
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
]

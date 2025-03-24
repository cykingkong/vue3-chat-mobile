import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: false,
    typescript: false,

    // enable UnoCSS support
    // https://unocss.dev/integrations/vscode
    unocss: false,

    formatters: {
      css: false,
    },

  },
  {
    rules: {
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-exports': 'off',
      'perfectionist/sort-named-exports': 'off',
      'no-console': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    ignores: [
      '.github/**',
      'scripts/**',
    ],
  },
)

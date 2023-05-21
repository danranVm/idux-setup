/* eslint-env node */
// eslint-disable-next-line import/no-unassigned-import
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  plugins: ['import'],
  extends: [
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
  rules: {
    // common
    'no-console': 'error',
    'no-debugger': 'error',

    'import/no-duplicates': 'error',
    'import/no-named-as-default': 0,
    'import/no-unused-modules': 'error',
    'import/no-unresolved': 'off',
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc', caseInsensitive: false },
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
        pathGroups: [
          {
            pattern: '{vue,@vue/**,vue-router}',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],

    'vue/attribute-hyphenation': 'off',
    'vue/multi-word-component-names': 'off',

    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
  },
  ignorePatterns: [
    '.husky',
    '.vscode',
    '*.config.js',
    '*.config.ts',
    'dist',
    'node_modules',
    'public',
    'typings',
  ],
}

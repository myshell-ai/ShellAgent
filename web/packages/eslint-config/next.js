const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

module.exports = {
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:prettier/recommended',
    'plugin:@next/next/recommended',
  ],
  plugins: ['react', 'prettier'],
  parserOptions: {
    project: true,
  },
  env: {
    node: true,
    browser: true,
  },
  globals: {
    React: true,
    JSX: true,
  },
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
      node: {
        extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  ignorePatterns: ['node_modules/', 'dist/'],
  rules: {
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/jsx-boolean-value': ['error', 'never'],
    'prettier/prettier': ['error'],
    'import/no-default-export': 'off',
    'prefer-named-capture-group': 'off',
    'import/no-cycle': 'off',
    'react/function-component-definition': 'off',
    'import/prefer-default-export': 'off',
    'lines-around-directive': ['error', { before: 'always', after: 'always' }],
    'no-param-reassign': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/order': [
      'warn',
      {
        alphabetize: { order: 'asc', caseInsensitive: false },
        'newlines-between': 'always',
        groups: ['external', 'internal', ['parent', 'sibling', 'index']],
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: [],
      },
    ],
    // TODO remove
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/media-has-caption': 'off',
  },
};

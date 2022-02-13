module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  globals: {
    JSX: true,
  },
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      tsx: true,
      modules: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint'],
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src/']],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    'no-nested-ternary': [0],
    'react/jsx-filename-extension': [
      2,
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
        jsx: 'never',
        tsx: 'never',
      },
    ],
    'max-len': [0],
    'react/jsx-one-expression-per-line': 0,
    'react/state-in-constructor': 0,
    'react/self-closing-comp': 0,
    'react/prefer-stateless-function': 0,
    'react/static-property-placement': 0,
    'max-classes-per-file': 0,
    'react/sort-comp': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/control-has-associated-label': 0,
    'jsx-a11y/anchor-has-content': 0,
    'react/no-unused-state': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'no-plusplus': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/alt-text': 0,
    'class-methods-use-this': 0,
    'import/prefer-default-export': 0,
    'no-console': 0,
    'react/jsx-props-no-spreading': 0,
    'no-param-reassign': 0,
    'no-shadow': 0,
    'jsx-a11y/media-has-caption': 0,
    'import/no-unresolved': [2, { ignore: ['react', 'react-dom'] }],
    semi: ['error', 'never'],
    'prettier/prettier': ['error', { semi: false, singleQuote: true }],
    '@typescript-eslint/no-empty-function': 'off',
  },
};

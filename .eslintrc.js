module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'no-unused-vars': 1,
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'react/prop-types': [
      1,
      {
        ignore: [
          'location',
          'history',
          'children',
          't',
          'i18n',
        ],
      },
    ],
    'import/no-unresolved': [
      0,
    ],
    'import/no-named-as-default': [
      0,
    ],
    'react/jsx-filename-extension': [
      0,
    ],
  },
};

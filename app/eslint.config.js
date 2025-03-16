import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const _rules = {
  'array-bracket-newline': [1, 'consistent'],
  'array-bracket-spacing': [
    1,
    'never',
    {
      arraysInArrays: true,
      objectsInArrays: false,
    },
  ],
  'array-element-newline': [
    0,
    {
      multiline: true,
      minItems: 2,
    },
  ],
  'arrow-parens': [2, 'always'],
  'comma-dangle': [2, 'always-multiline'],
  curly: [1, 'multi-line'],
  'class-methods-use-this': 0,
  'indent': [0, 4],
  'keyword-spacing': [
    2,
    {
      before: true,
      after: true,
      overrides: {
        function: {
          after: false,
        },
        while: {
          after: false,
        },
      },
    },
  ],
  'jsx-quotes': [2, 'prefer-double'],
  'max-len': 0,
  'no-case-declarations': 0,
  'no-extraneous-imports': 0,
  'no-inner-declarations': 0,
  'no-prototype-builtins': 0,
  'no-use-before-define': 0,
  'no-undef': 1,
  'no-unused-expressions': 0,
  'no-unused-vars': 1,
  'no-useless-escape': 0,
  'object-curly-spacing': [1, 'always'],
  'operator-linebreak': 0,
  'prettier/prettier': 0,
  semi: [2, 'always'],
  'space-before-function-paren': 0,
  'wrap-iife': [2, 'inside'],
};

export default tseslint.config(
  {
    ignores: [
      'dist',
      // '**/*.json'
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{js,ts}'],
    ignores: [
      'build',
      'coverage',
      'dist',
      'node_modules',
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.jest,
        ...globals['shared-node-browser'],
        ...globals.node,
      },
      /**
       * @description The type of JavaScript source code. Possible values are "script"
       *  for traditional script files, "module" for ECMAScript modules (ESM), and
       *  "commonjs" for CommonJS files. (default: "module" for .js and .mjs files;
       *  "commonjs" for .cjs files)
       */
      sourceType: 'module',
    },
    rules: {
      ..._rules,
      '@typescript-eslint/ban-ts-comment': 1,
      '@typescript-eslint/no-explicit-any': 1,
      '@typescript-eslint/no-unused-vars': 1,
      'indent': [0, 2],
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      ..._rules,
      'no-unused-vars': 0,
    },
  },
  {
    files: [
      'eslint.config.js',
      'jest.config.js',
    ],
    rules: {
      ..._rules,
      'no-undef': 0,
    },
  },
  {
    files: ['.prettierrc.js'],
    // languageOptions: {
    //     sourceType: 'commonjs',
    // },
    rules: {
      ..._rules,
      'no-undef': 0,
    },
  },
  // {
  //   files: ['**/*.json'],
  //   rules: {
  //     'comma-dangle': ["error", "never"],
  //     'indent': ['error', 4],
  //   },
  // },
);

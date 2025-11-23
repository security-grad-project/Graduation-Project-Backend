import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/** @type {import("eslint").FlatConfig[]} */
export default [
  // Base TS + JS recommended rules
  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    ignores: ['node_modules/**', 'dist/**'],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      // Prettier
      'prettier/prettier': 'error',

      // Team rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Prettier last
  prettierConfig,
];

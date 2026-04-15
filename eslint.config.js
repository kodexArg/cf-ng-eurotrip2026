// @ts-check
const angularEslint = require('angular-eslint');
const tsEslint = require('typescript-eslint');
const eslint = require('@eslint/js');

module.exports = tsEslint.config(
  // --- TypeScript source files ---
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tsEslint.configs.recommended,
      ...angularEslint.configs.tsRecommended,
    ],
    processor: angularEslint.processInlineTemplates,
    rules: {
      // ADR-004: Standalone components mandatory
      '@angular-eslint/prefer-standalone': 'error',

      // Input/output renaming discouraged
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-output-rename': 'error',

      // Change detection: warn only, some components may legitimately skip OnPush
      '@angular-eslint/prefer-on-push-component-change-detection': 'warn',

      // Type safety: warn, project may have legitimate any usages
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // --- HTML template files ---
  {
    files: ['**/*.html'],
    extends: [...angularEslint.configs.templateRecommended],
    rules: {
      // Type safety in templates: warn only
      '@angular-eslint/template/no-any': 'warn',
    },
  },
);

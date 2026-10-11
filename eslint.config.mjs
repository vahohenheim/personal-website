import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";

export default defineConfig([
  // Next.js, React, React Hooks (with the React Compiler rules) and Core Web Vitals.
  ...nextVitals,

  // TypeScript: strict and stylistic presets, with type information.
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
      reportUnusedInlineConfigs: "error",
    },
    rules: {
      // Accessibility: the full recommended set, not only the six rules Next.js enables.
      ...jsxA11y.flatConfigs.recommended.rules,

      // Language
      curly: ["error", "all"],
      eqeqeq: ["error", "always"],
      "no-console": ["error", { allow: ["warn", "error"] }],

      // Imports: one sorted block, type imports marked as such, no deep "../../" climbing.
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
          pathGroups: [{ pattern: "@/**", group: "internal" }],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "never",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../../*"],
              message: "Use the @/ alias instead of climbing more than one folder.",
            },
          ],
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      // TypeScript
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],

      // React
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-no-useless-fragment": "error",
      "react/no-array-index-key": "error",
      "react/self-closing-comp": "error",
    },
  },

  // Plain JavaScript config files are not part of the TypeScript project.
  {
    files: ["**/*.{js,mjs,cjs}"],
    extends: [tseslint.configs.disableTypeChecked],
  },

  // shadcn/ui Chart is generated code built on Recharts, whose types are loose. It is kept
  // close to the original so that it can be updated with the CLI: the strict type rules
  // are relaxed for this one file only.
  {
    files: ["components/ui/chart.tsx"],
    rules: {
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "react/no-array-index-key": "off",
      eqeqeq: "off",
    },
  },

  // Turns off every rule that would fight with Prettier. Keep it last.
  prettier,

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

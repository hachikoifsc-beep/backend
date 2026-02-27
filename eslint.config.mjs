import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";

const IDENT_SIZE = 2;


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.node } },
  tseslint.configs.recommended,
  { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
  {
    rules: {
      "space-before-blocks": [
        "error",
        {
          "functions": "always",
          "keywords": "always",
          "classes": "always",
        },
      ],
      "no-useless-assignment": "off",
      "eol-last": "error",
      "no-magic-numbers": "warn",
      "no-async-promise-executor": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "switch-colon-spacing": [
        "error",
        {
          "after": true,
          "before": false,
        },
      ],
      "no-dupe-keys": "error",
      "comma-dangle": [
        IDENT_SIZE,
        "always-multiline",
      ],
      "indent": [
        "error",
        IDENT_SIZE,
        {
          "SwitchCase": 1,
        },
      ],
      "linebreak-style": [
        "error",
        "unix",
      ],
      "quotes": [
        "error",
        "double",
      ],
      "semi": [
        "error",
        "always",
      ],
    },
  },
]);

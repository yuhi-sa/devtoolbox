export type Framework = "react" | "vue" | "node";
export type Style = "airbnb" | "standard" | "none";

export interface EslintOptions {
  framework: Framework;
  typescript: boolean;
  style: Style;
  plugins: {
    prettier: boolean;
    importPlugin: boolean;
    unusedImports: boolean;
    a11y: boolean;
  };
}

export function generateEslintConfig(options: EslintOptions): string {
  const imports: string[] = [];
  const configs: string[] = [];
  const rules: Record<string, string> = {};

  // Base JS config
  imports.push('import js from "@eslint/js";');
  configs.push("js.configs.recommended");

  // TypeScript
  if (options.typescript) {
    imports.push('import tseslint from "typescript-eslint";');
    configs.push("...tseslint.configs.recommended");
  }

  // Framework
  if (options.framework === "react") {
    imports.push('import react from "eslint-plugin-react";');
    imports.push('import reactHooks from "eslint-plugin-react-hooks";');
    configs.push("react.configs.flat.recommended");
    configs.push("reactHooks.configs[\"recommended-latest\"]");
    rules["react/react-in-jsx-scope"] = '"off"';
  } else if (options.framework === "vue") {
    imports.push('import vue from "eslint-plugin-vue";');
    if (options.typescript) {
      configs.push("...vue.configs[\"flat/recommended\"]");
    } else {
      configs.push("...vue.configs[\"flat/recommended\"]");
    }
  }

  // Style presets
  if (options.style === "airbnb") {
    imports.push('import airbnb from "eslint-config-airbnb-flat";');
    configs.push("airbnb");
  } else if (options.style === "standard") {
    imports.push('import standard from "eslint-config-standard-flat";');
    configs.push("standard");
  }

  // Plugins
  if (options.plugins.prettier) {
    imports.push('import prettier from "eslint-config-prettier";');
    configs.push("prettier");
  }

  if (options.plugins.importPlugin) {
    imports.push('import importPlugin from "eslint-plugin-import";');
    configs.push("importPlugin.flatConfigs.recommended");
  }

  if (options.plugins.unusedImports) {
    imports.push('import unusedImports from "eslint-plugin-unused-imports";');
  }

  if (options.plugins.a11y && options.framework === "react") {
    imports.push('import jsxA11y from "eslint-plugin-jsx-a11y";');
    configs.push("jsxA11y.flatConfigs.recommended");
  }

  // Build output
  const lines: string[] = [];
  lines.push(...imports);
  lines.push("");
  lines.push("export default [");

  for (const config of configs) {
    lines.push(`  ${config},`);
  }

  // Custom rules / plugin configs
  const hasCustom =
    Object.keys(rules).length > 0 || options.plugins.unusedImports;

  if (hasCustom) {
    lines.push("  {");

    if (options.plugins.unusedImports) {
      lines.push("    plugins: {");
      lines.push('      "unused-imports": unusedImports,');
      lines.push("    },");
    }

    if (Object.keys(rules).length > 0 || options.plugins.unusedImports) {
      lines.push("    rules: {");
      for (const [key, value] of Object.entries(rules)) {
        lines.push(`      "${key}": ${value},`);
      }
      if (options.plugins.unusedImports) {
        lines.push('      "unused-imports/no-unused-imports": "error",');
      }
      lines.push("    },");
    }

    lines.push("  },");
  }

  // File patterns for TypeScript
  if (options.typescript) {
    lines.push("  {");
    lines.push('    files: ["**/*.ts"' + (options.framework === "react" ? ', "**/*.tsx"' : options.framework === "vue" ? ', "**/*.vue"' : "") + "],");
    lines.push("  },");
  }

  lines.push("];");
  lines.push("");

  return lines.join("\n");
}

export function getDefaultOptions(): EslintOptions {
  return {
    framework: "react",
    typescript: true,
    style: "none",
    plugins: {
      prettier: true,
      importPlugin: false,
      unusedImports: false,
      a11y: false,
    },
  };
}

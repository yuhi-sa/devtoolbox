export interface TsconfigOptions {
  target: string;
  module: string;
  moduleResolution: string;
  strict: boolean;
  strictNullChecks: boolean;
  strictFunctionTypes: boolean;
  strictBindCallApply: boolean;
  strictPropertyInitialization: boolean;
  noImplicitAny: boolean;
  noImplicitReturns: boolean;
  noImplicitThis: boolean;
  noUnusedLocals: boolean;
  noUnusedParameters: boolean;
  esModuleInterop: boolean;
  skipLibCheck: boolean;
  forceConsistentCasingInFileNames: boolean;
  resolveJsonModule: boolean;
  declaration: boolean;
  declarationMap: boolean;
  sourceMap: boolean;
  outDir: string;
  rootDir: string;
  baseUrl: string;
  paths: { alias: string; path: string }[];
  jsx: string;
  lib: string[];
  include: string[];
  exclude: string[];
}

export const TARGET_OPTIONS = [
  "ES2020",
  "ES2021",
  "ES2022",
  "ES2023",
  "ESNext",
];

export const MODULE_OPTIONS = [
  "CommonJS",
  "ES2020",
  "ES2022",
  "ESNext",
  "NodeNext",
  "Node16",
];

export const MODULE_RESOLUTION_OPTIONS = [
  "node",
  "node16",
  "nodenext",
  "bundler",
];

export const JSX_OPTIONS = ["", "react", "react-jsx", "react-jsxdev", "preserve"];

export const LIB_OPTIONS = [
  "ES2020",
  "ES2021",
  "ES2022",
  "ES2023",
  "ESNext",
  "DOM",
  "DOM.Iterable",
  "WebWorker",
];

export function getDefaultOptions(): TsconfigOptions {
  return {
    target: "ES2022",
    module: "ESNext",
    moduleResolution: "bundler",
    strict: true,
    strictNullChecks: true,
    strictFunctionTypes: true,
    strictBindCallApply: true,
    strictPropertyInitialization: true,
    noImplicitAny: true,
    noImplicitReturns: true,
    noImplicitThis: true,
    noUnusedLocals: false,
    noUnusedParameters: false,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    resolveJsonModule: true,
    declaration: false,
    declarationMap: false,
    sourceMap: true,
    outDir: "./dist",
    rootDir: "./src",
    baseUrl: ".",
    paths: [],
    jsx: "",
    lib: ["ES2022", "DOM", "DOM.Iterable"],
    include: ["src"],
    exclude: ["node_modules", "dist"],
  };
}

export function generateTsconfig(options: TsconfigOptions): string {
  const compilerOptions: Record<string, unknown> = {
    target: options.target,
    module: options.module,
    moduleResolution: options.moduleResolution,
  };

  if (options.lib.length > 0) {
    compilerOptions.lib = options.lib;
  }

  if (options.jsx) {
    compilerOptions.jsx = options.jsx;
  }

  // Strict options
  compilerOptions.strict = options.strict;
  if (!options.strict) {
    if (options.strictNullChecks) compilerOptions.strictNullChecks = true;
    if (options.strictFunctionTypes) compilerOptions.strictFunctionTypes = true;
    if (options.strictBindCallApply) compilerOptions.strictBindCallApply = true;
    if (options.strictPropertyInitialization) compilerOptions.strictPropertyInitialization = true;
    if (options.noImplicitAny) compilerOptions.noImplicitAny = true;
    if (options.noImplicitThis) compilerOptions.noImplicitThis = true;
  }

  if (options.noImplicitReturns) compilerOptions.noImplicitReturns = true;
  if (options.noUnusedLocals) compilerOptions.noUnusedLocals = true;
  if (options.noUnusedParameters) compilerOptions.noUnusedParameters = true;

  compilerOptions.esModuleInterop = options.esModuleInterop;
  compilerOptions.skipLibCheck = options.skipLibCheck;
  compilerOptions.forceConsistentCasingInFileNames = options.forceConsistentCasingInFileNames;
  compilerOptions.resolveJsonModule = options.resolveJsonModule;

  if (options.declaration) compilerOptions.declaration = true;
  if (options.declarationMap) compilerOptions.declarationMap = true;
  if (options.sourceMap) compilerOptions.sourceMap = true;

  if (options.outDir) compilerOptions.outDir = options.outDir;
  if (options.rootDir) compilerOptions.rootDir = options.rootDir;
  if (options.baseUrl) compilerOptions.baseUrl = options.baseUrl;

  if (options.paths.length > 0) {
    const paths: Record<string, string[]> = {};
    for (const p of options.paths) {
      if (p.alias && p.path) {
        paths[p.alias] = [p.path];
      }
    }
    if (Object.keys(paths).length > 0) {
      compilerOptions.paths = paths;
    }
  }

  const config: Record<string, unknown> = { compilerOptions };

  if (options.include.length > 0) {
    config.include = options.include.filter((s) => s.trim());
  }
  if (options.exclude.length > 0) {
    config.exclude = options.exclude.filter((s) => s.trim());
  }

  return JSON.stringify(config, null, 2) + "\n";
}

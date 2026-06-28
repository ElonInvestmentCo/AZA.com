const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const fs = require("fs");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

/* ── pnpm monorepo: watch workspace lib packages this app imports ────────
   Do NOT add the full monorepoRoot — that causes Metro to crawl all of
   root/node_modules (~1000 packages) and stall.                          */
const workspaceLibs = [
  path.resolve(monorepoRoot, "lib/api-client-react"),
  path.resolve(monorepoRoot, "lib/api-spec"),
  path.resolve(monorepoRoot, "lib/api-zod"),
  path.resolve(monorepoRoot, "lib/db"),
].filter((p) => fs.existsSync(p));

config.watchFolders = workspaceLibs;

/* ── Resolve packages from both project and root node_modules ────────── */
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

/* ── CRITICAL for pnpm: do NOT follow symlinks ───────────────────────────
   pnpm stores real files in root/node_modules/.pnpm (the virtual store).
   Package folders like artifacts/mobile/node_modules/expo-router are
   symlinks into that store. With unstable_enableSymlinks=true, Metro
   follows them to .pnpm which is NOT in watchFolders → "unable to resolve"
   from workspace root. With symlinks disabled, Metro treats the symlink
   path as the canonical directory (within projectRoot) and resolves
   normally without ever leaving the watched tree.                         */
config.resolver.unstable_enableSymlinks = false;

/* ── Prevent Metro walking up past projectRoot to find modules ─────────
   Ensures packages are only resolved from the nodeModulesPaths above,
   not from accidental ancestor directories.                               */
config.resolver.disableHierarchicalLookup = true;

module.exports = config;

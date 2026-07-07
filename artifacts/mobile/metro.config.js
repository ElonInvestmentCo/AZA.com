const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const fs = require("fs");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// ────────────────────────────────────────────────────────────────
// Fix 0: Expo Go compatibility — stub native-only Firebase modules
//
// @react-native-firebase/{auth,firestore} require native code that
// is not included in standard Expo Go. We redirect those imports to
// lightweight no-op stubs so the app loads in Expo Go; the stubs
// return "no user / no snapshot" so callers fall back gracefully to
// the REST API. In a real EAS / custom dev-build these stubs are
// never reached because the real native module resolves first.
// ────────────────────────────────────────────────────────────────
const FIREBASE_STUBS = {
  "@react-native-firebase/auth": path.join(projectRoot, "lib/firebase-auth-stub.ts"),
  "@react-native-firebase/firestore": path.join(projectRoot, "lib/firebase-firestore-stub.ts"),
};

const originalResolveRequest = config.resolver?.resolveRequest;
config.resolver = {
  ...(config.resolver ?? {}),
  resolveRequest: (context, moduleName, platform) => {
    if (Object.prototype.hasOwnProperty.call(FIREBASE_STUBS, moduleName)) {
      return { filePath: FIREBASE_STUBS[moduleName], type: "sourceFile" };
    }
    if (originalResolveRequest) {
      return originalResolveRequest(context, moduleName, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

// ────────────────────────────────────────────────────────────────
// Fix 1: pnpm FallbackWatcher ENOENT crash
// ────────────────────────────────────────────────────────────────
const originalFsWatch = fs.watch;

const noopWatcher = {
  close: () => {},
  on: () => noopWatcher,
  off: () => noopWatcher,
  once: () => noopWatcher,
  emit: () => false,
  addListener: () => noopWatcher,
  removeListener: () => noopWatcher,
};

fs.watch = function (filename, options, listener) {
  try {
    return originalFsWatch.call(this, filename, options, listener);
  } catch (error) {
    if (error.code === "ENOENT") {
      return noopWatcher;
    }
    throw error;
  }
};

// ────────────────────────────────────────────────────────────────
// Fix 2: pnpm monorepo support
// Keep Expo defaults and ADD the workspace root.
// ────────────────────────────────────────────────────────────────
config.watchFolders = [
  ...(config.watchFolders || []),
  monorepoRoot,
];

config.resolver = {
  ...config.resolver,
  nodeModulesPaths: [
    path.join(projectRoot, "node_modules"),
    path.join(monorepoRoot, "node_modules"),
  ],
};

// ────────────────────────────────────────────────────────────────
// Fix 3: Replit CORS support
// ────────────────────────────────────────────────────────────────
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      return middleware(req, res, next);
    };
  },
};

module.exports = config;

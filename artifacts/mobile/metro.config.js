const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const fs = require("fs");

const config = getDefaultConfig(__dirname);

// Fix for pnpm + Metro: Metro's FallbackWatcher crashes when it tries to watch
// node_modules subdirectories inside pnpm packages that don't exist.
// We override the watcher to silently ignore ENOENT errors.
const originalWatch = fs.watch;
fs.watch = function (filename, options, listener) {
  try {
    return originalWatch(filename, options, listener);
  } catch (e) {
    if (e.code === "ENOENT") {
      // Return a no-op watcher
      return { close: () => {} };
    }
    throw e;
  }
};

// Allow all hosts so Replit's proxy can reach the dev server
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

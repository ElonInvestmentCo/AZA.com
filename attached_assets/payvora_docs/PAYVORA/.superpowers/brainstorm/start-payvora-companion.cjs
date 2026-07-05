const path = require("path");
const { spawn } = require("child_process");

const sessionDir = path.join(__dirname, `manual-${Date.now()}`);
const serverPath =
  "C:/Users/Jerri/.codex/plugins/cache/openai-api-curated/superpowers/d6169bef/skills/brainstorming/scripts/server.cjs";

const child = spawn(process.execPath, [serverPath], {
  stdio: "ignore",
  env: {
    ...process.env,
    BRAINSTORM_DIR: sessionDir,
    BRAINSTORM_HOST: "127.0.0.1",
    BRAINSTORM_URL_HOST: "localhost",
    BRAINSTORM_OWNER_PID: "",
  },
});

console.log(sessionDir);

process.on("SIGINT", () => child.kill());
process.on("SIGTERM", () => child.kill());
child.on("exit", (code) => process.exit(code || 0));
setInterval(() => {}, 60_000);

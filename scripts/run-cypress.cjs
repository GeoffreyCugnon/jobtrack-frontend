#!/usr/bin/env node
// Electron checks for the presence of ELECTRON_RUN_AS_NODE, not its value,
// so setting it to an empty string isn't enough — it must be deleted.
delete process.env.ELECTRON_RUN_AS_NODE;

const { spawn } = require("node:child_process");

const cmd = ["npx", "cypress", ...process.argv.slice(2)].join(" ");
const child = spawn(cmd, {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 1));

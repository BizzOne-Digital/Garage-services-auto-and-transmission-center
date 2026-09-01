/**
 * Runs the website and the API together with one command.
 *
 * Both are needed in development: Vite serves the site on :3000 and proxies
 * /api to the Express server on :4000. With only Vite running, every API call
 * fails with ECONNREFUSED and the admin portal cannot log in.
 *
 * Written without a dependency so `npm install` stays unchanged.
 */
import { spawn } from 'node:child_process';

const TASKS = [
  { name: 'web', script: 'dev', color: '\x1b[36m' },
  { name: 'api', script: 'dev:api', color: '\x1b[35m' },
];

const RESET = '\x1b[0m';
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

let shuttingDown = false;
const children = [];

const label = (task) => `${task.color}[${task.name}]${RESET} `;

/** Prefixes every line so the two log streams stay readable side by side. */
const forward = (stream, task, target) => {
  let buffer = '';
  stream.on('data', chunk => {
    buffer += chunk.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) target.write(`${label(task)}${line}\n`);
  });
  stream.on('end', () => {
    if (buffer) target.write(`${label(task)}${buffer}\n`);
  });
};

const stopAll = (code) => {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (child.exitCode === null && child.signalCode === null) child.kill();
  }
  process.exitCode = code;
};

for (const task of TASKS) {
  // shell:true is required for npm.cmd on Windows. The command is passed as a
  // single string because separate args with shell:true trigger DEP0190; every
  // part of it is a hardcoded constant, so there is nothing to escape.
  const child = spawn(`${npm} run ${task.script}`, {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
  });

  forward(child.stdout, task, process.stdout);
  forward(child.stderr, task, process.stderr);

  child.on('exit', code => {
    if (!shuttingDown) {
      console.log(`${label(task)}exited with code ${code ?? 0} — stopping the other process.`);
      stopAll(code ?? 0);
    }
  });

  children.push(child);
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => stopAll(0));
}

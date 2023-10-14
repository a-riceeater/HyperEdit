const { Terminal } = require('xterm');
const { FitAddon } = require('xterm-addon-fit');
const { spawn } = require('node-pty');

// Initialize the terminal
const terminal = new Terminal();
const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);
terminal.open(document.getElementById('term-output'));
fitAddon.fit();

// Create a shell process (you can change the shell to your preference)
const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
const ptyProcess = spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 24,
  cwd: process.env.HOME,
  env: process.env,
});

// Bind the pty process to the terminal
ptyProcess.onData((data) => {
  terminal.write(data);
});

// Send user input to the pty process
terminal.onData((data) => {
  ptyProcess.write(data);
});

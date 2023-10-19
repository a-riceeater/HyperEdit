const { Terminal } = require('xterm');
const { FitAddon } = require('xterm-addon-fit');

// Initialize the xterm terminal
const xterm = new Terminal();
const fitAddon = new FitAddon();
xterm.loadAddon(fitAddon);

// Attach the xterm terminal to the #term-output element
xterm.open(document.getElementById('term-output'));
fitAddon.fit();

// Replace the shell variable with your preferred shell
const shell = process.platform === 'win32' ? 'powershell.exe' : '/bin/zsh';

// Send a request to the main process to start the terminal
ipcRenderer.send('start-terminal', shell);

// Handle data received from the terminal and display it in the xterm.js terminal
ipcRenderer.on('terminal-data', (event, data) => {
  // Write the data to the xterm.js terminal
  xterm.write(data);
});

// Handle user input and send it to the terminal
function sendInput(input) {
    
  ipcRenderer.send('terminal-input', input);
}
xterm.onData((data) => {
    console.dir(data);
    ipcRenderer.send('terminal-input', data);
});
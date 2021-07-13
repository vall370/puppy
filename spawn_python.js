const { spawn } = require('child_process');

let args = ['python_launched_from_nodejs.py'];
args.push('--hello', 'Hello World');

const childProcess = spawn('python', args);

childProcess.stdout.setEncoding('utf8');
childProcess.stdout.on('data', (data) => {
    console.log(`Node output: ${data}`);
})

childProcess.stderr.setEncoding('utf8');
childProcess.stderr.on('data', (err) => {
    console.error(err);
})

childProcess.on('exit', () => {
    console.log('The python script has exited');
})
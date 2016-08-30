const fs = require('fs');
const path = require('path');

try {
  fs.mkdirSync('build');
} catch(err) {
  if (err.code != 'EEXIST') throw err;
}

const spawn = require('child_process').spawn;
const dockcross = path.join('build', 'dockcross');
try {
  fs.statSync(dockcross);
} catch(err) {
  if (err.code == 'ENOENT') {
    const output = fs.openSync(dockcross, 'w');
    const dockerCall = spawn('docker', ['run', '--rm', 'insighttoolkit/bridgejavascript-test'], {
      env: process.env,
      stdio: [ 'ignore', output, null ]
    });
    dockerCall.on('exit', function(code) {
      if(code != 0) {
        process.exit(code);
      }
    });
    fs.chmodSync(dockcross, '755');
  }
  else {
    throw err;
  }
}


webpackCall = spawn('webpack', [], {
  env: process.env,
  stdio: 'inherit'
});

webpackCall.on('close', function(code) {
  process.exit(code);
});


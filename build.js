const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;

// Make the "build" directory to hold build artifacts
try {
  fs.mkdirSync('build');
} catch(err) {
  if (err.code != 'EEXIST') throw err;
}

// Ensure we have the 'dockcross' Docker build environment driver script
const dockcross = path.join('build', 'dockcross');
try {
  fs.statSync(dockcross);
} catch(err) {
  if (err.code == 'ENOENT') {
    const output = fs.openSync(dockcross, 'w');
    dockerCall = spawnSync('docker', ['run', '--rm', 'insighttoolkit/bridgejavascript-test'], {
      env: process.env,
      stdio: [ 'ignore', output, null ]
    });
    if(dockerCall.status != 0) {
      process.exit(dockerCall.status);
    };
    fs.closeSync(output);
    fs.chmodSync(dockcross, '755');
  }
  else {
    throw err;
  }
}

// Perform initial CMake configuration if required
try {
  fs.statSync(path.join('build', 'build.ninja'));
} catch(err) {
  if (err.code == 'ENOENT') {
    console.log('Running CMake configuration...');
    const cmakeCall = spawnSync(dockcross, ['cmake', '-Bbuild', '-H.', '-GNinja', '-DITK_DIR=/usr/src/ITK-build'], {
      env: process.env,
      stdio: 'inherit'
    });
    if(cmakeCall.status != 0) {
      process.exit(cmakeCall.status);
    };
  }
  else {
    throw err;
  }
}

// Build the Emscripten mobules with ninja
console.log('\nRunning ninja...');
const ninjaCall = spawnSync(dockcross, ['ninja', '-Cbuild'], {
  env: process.env,
  stdio: 'inherit'
});
if(ninjaCall.status != 0) {
  process.exit(ninjaCall.status);
};


// Build the Node.js JavaScript code with webpack
console.log('\nRunning webpack...');
webpackCall = spawnSync('webpack', [], {
  env: process.env,
  stdio: 'inherit'
});
process.exit(webpackCall.status);


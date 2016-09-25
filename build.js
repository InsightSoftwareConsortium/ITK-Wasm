const fs = require('fs-extra');
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const Builder = require('systemjs-builder');
const glob = require('glob');
const asyncMod = require('async');

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
console.log('');

// Compile all the ImageIO's into the System.register format
const builder = new Builder();
builder.config({
  packages: {
    'build/ImageIOs': {
      format: 'cjs'
    }
  },
  meta: {
    'fs': {
      build: false
    },
    'path': {
      build: false
    },
    'crypto': {
      build: false
    }
  }
});

try {
  fs.mkdirSync('dist');
} catch(err) {
  if (err.code != 'EEXIST') throw err;
}
try {
  fs.mkdirSync(path.join('dist', 'ImageIOs'));
} catch(err) {
  if (err.code != 'EEXIST') throw err;
}
imageIOFiles = glob.sync(path.join('build', 'ImageIOs', '*.js'));
const buildSystemRegister = function(imageIOFile, callback) {
  let io = path.basename(imageIOFile);
  console.log('Converting ' + io + ' ...');
  let output = path.join('dist', 'ImageIOs', io);

  builder
  .bundle(imageIOFile, output)
  .then(function() {
    console.log(io + ' conversion complete');
  })
  .catch(function(err) {
    console.error('Conversion error');
    console.error(err);
    process.exit(1);
  });

  callback(null, io);
}
const buildSystemRegisterParallel = function (callback) {
  result = asyncMod.map(imageIOFiles, buildSystemRegister);
  callback(null, result);
}

const babelOptions = {
  presets: [
    ["es2015", { "modules": false }]
  ]
}
const babel = require('babel-core');
const babelBuild = function(es6File, callback) {
  let basename = path.basename(es6File);
  console.log('Converting ' + basename + ' ...');
  let output = path.join('dist', basename);
  babel.transformFile(es6File, babelOptions, function(err, result) {
    if(err) {
      console.error(err);
      process.exit(1);
    }
    const outputFD = fs.openSync(output, 'w');
    fs.writeSync(outputFD, result.code);
    fs.closeSync(outputFD);
    console.log(basename + ' conversion complete');
  });
  callback(null, basename);
}
es6Files = glob.sync(path.join('src', '*.js'));
const babelBuildParallel = function (callback) {
  result = asyncMod.map(es6Files, babelBuild);
  callback(null, result);
}

asyncMod.parallel([
  buildSystemRegisterParallel,
  babelBuildParallel,
]);

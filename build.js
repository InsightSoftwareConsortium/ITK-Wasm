const spawn = require('child_process').spawn;

webpack_call = spawn('webpack', [], {
  env: process.env,
  stdio: 'inherit'
});

webpack_call.on('close', function(code) {
  process.exit(code);
});


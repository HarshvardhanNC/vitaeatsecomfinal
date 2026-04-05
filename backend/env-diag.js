const fs = require('fs');
const path = require('path');

const report = [];

report.push('Diagnostic Report - ' + new Date().toISOString());
report.push('Node Version: ' + process.version);
report.push('Platform: ' + process.platform);

try {
  const pkg = require('./package.json');
  report.push('Package Name: ' + pkg.name);
  report.push('Mongoose Version (pkg): ' + (pkg.dependencies.mongoose || 'Not found'));
} catch (e) {
  report.push('Error reading package.json: ' + e.message);
}

try {
  const mongoose = require('mongoose');
  report.push('Mongoose Version (actual): ' + mongoose.version);
} catch (e) {
  report.push('Error loading mongoose: ' + e.message);
}

report.push('Env Variables Check:');
report.push('PORT: ' + (process.env.PORT || 'Not set'));
report.push('MONGO_URI exists: ' + (process.env.MONGO_URI ? 'Yes' : 'No'));

fs.writeFileSync('diagnostic.txt', report.join('\n'));
console.log('Diagnostic report created at diagnostic.txt');

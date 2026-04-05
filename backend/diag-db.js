const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

try {
  dotenv.config();
  fs.writeFileSync('error.log', 'Starting connection test...\n', { flag: 'a' });
  fs.writeFileSync('error.log', 'URI: ' + process.env.MONGO_URI + '\n', { flag: 'a' });

  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      fs.writeFileSync('error.log', 'Successfully connected!\n', { flag: 'a' });
      process.exit(0);
    })
    .catch((err) => {
      fs.writeFileSync('error.log', 'Connection failed: ' + err.message + '\n', { flag: 'a' });
      process.exit(1);
    });
} catch (e) {
  fs.writeFileSync('error.log', 'System error: ' + e.message + '\n', { flag: 'a' });
  process.exit(1);
}

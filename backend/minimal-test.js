const fs = require('fs');
fs.writeFileSync('test.txt', 'Node is working at ' + new Date().toISOString());
console.log('Test file created');

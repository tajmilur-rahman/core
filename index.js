const {series} = require('async');
const {exec} = require('child_process');

series([
    () => exec('npm run start'),
]);
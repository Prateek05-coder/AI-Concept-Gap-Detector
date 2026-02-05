
const { exec } = require('child_process');
const fs = require('fs');

exec('npx tsc client/src/services/geminiService.ts --noEmit --esModuleInterop --skipLibCheck', (error, stdout, stderr) => {
    const output = stdout + '\n' + stderr;
    fs.writeFileSync('tsc_output.txt', output);
    if (error) {
        console.log('Error found, output written to tsc_output.txt');
    } else {
        console.log('No errors.');
    }
});

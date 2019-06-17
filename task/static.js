const exec = require('child_process').exec;
module.exports = function (pid, script_src) {
    return new Promise((resolve, reject) => {
        exec(`cd ${script_src} && npm run build`,  (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return 
            }
            resolve(stdout); 
        });
    })
    
}
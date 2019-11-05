const exec = require('child_process').exec;
module.exports = function (task_content) {
    return new Promise((resolve, reject) => {
        exec(task_content,  (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return 
            }
            resolve(stdout); 
        });
    })
    
}
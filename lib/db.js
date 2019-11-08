const mysql = require('mysql');
const {
    ANT_MYSQL_HOST,
    ANT_MYSQL_PORT,
    ANT_MYSQL_USER,
    ANT_MYSQL_PASSWORD
} = process.env;

module.exports = function (sql, data) {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: ANT_MYSQL_HOST,
            port: ANT_MYSQL_PORT || 3306,
            user: ANT_MYSQL_USER,
            password: ANT_MYSQL_PASSWORD,
            database: 'ant'
        });

        connection.connect();

        const query = connection.query(sql, data, function (error, results, fields) {
            if (error) {
                console.log('当前错误的sql: %s | 错误信息: %s', query.sql, error.message);
                reject(error);
                return 
            }
            const data = JSON.parse(JSON.stringify(results));
            console.log('sql执行成功: sql:%s | 返回值:%j', query.sql, data);
            resolve(data); 
        });
        console.log('当前正在执行的sql:%s', query.sql);
        connection.end();
    })
    
}
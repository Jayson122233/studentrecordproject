const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '*****',
    database: 'stdrecord',
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to MYSQL Database');
    }
    });


module.exports = connection;

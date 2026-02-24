import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'course_advising'

})

export {connection};
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
    host: localhost,
    user: 'root',
    database: 'course_advising'

})

export {connection};
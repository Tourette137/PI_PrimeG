const mysql = require('mysql')

const config = {
  db:{
    host: 'localhost',
    user: 'root',
    password: 'fofinha',
    database: 'primeg',
    multipleStatements: true
  }
}

module.exports = config;
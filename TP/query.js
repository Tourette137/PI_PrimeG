const mysql = require('mysql');
const config = require('./config');

function query(sql) {
  const connection = mysql.createConnection(config.db);
  return new Promise((resolve, reject) => {
    connection.query(sql, function(error,data){
      if(error)
        reject(error)
      else
        resolve(data);
    })
  })
  connection.end();
}

module.exports = {
  query
}
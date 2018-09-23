const mysql = require('mysql');

const db_config = {
  connectionLimit : 1500,
  host     : '34.251.96.85',
  user     : 'romas_dev',
  password : 'romas_dev',
  database : 'wallets',
  debug    :  false
};

exports.db_config = db_config;
const mysql = require('mysql');

const db_config = {
  host     : '192.168.0.3',
  user     : 'tradeum',
  password : 'tradeum',
  database : 'wallets'
};

function handleDisconnect(myconnection) {
  myconnection.on('error', function(err) {
    console.log('Re-connecting lost connection');
    connection.destroy();
    connection = mysql.createConnection(config.mysql);
    handleDisconnect(connection);
    connection.connect();
  });
}

module.exports = handleDisconnect;
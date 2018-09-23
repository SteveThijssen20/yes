const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const mysql_config = require('../config/mysql_connection');
// const config = require('../config/database');
const bodyParser = require('body-parser');
// const Eth = require('../models/eth');
const lightwallet = require('eth-lightwallet');
const axios = require('axios');
const CoinMarketCap = require("node-coinmarketcap");
const Web3 = require("web3");
const Eos = require('eosjs');

/*  DB connection part */
  
let connection;
  
function handleDisconnect() {
  connection = mysql.createPool(mysql_config.db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.getConnection(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect(), 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

/*  DB connection part end */

const config = {
    chainId: null, // 32 byte (64 char) hex string
    keyProvider: ['5J19wz7UPcQHePjbb4JwHHSjhWMbHgu7qncPTJQJcMvCg3nRUek'], // WIF string or array of keys..
    httpEndpoint: 'http://127.0.0.1:8888',
    expireInSeconds: 1000,
    broadcast: true,
    verbose: false, // API activity
    sign: true
  }
  
const eos = Eos(config);

// router.post('/start', (req, res, next) => {
//     eos.getInfo({}).then(result => res.json(result));
// });

router.post('/data_input_eos', (req, res, next) => {
    const username = req.body.username;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const gender = req.body.gender;
    const phone = req.body.phone;
    eos.contract('scm').then(myaccount => {
        const options = { authorization: [ `scm` ] };
        myaccount.create({username, firstname, lastname, email, gender, phone}, options).then(result => res.json(result));
        // console.log(myaccount);
        // console.log(myaccount.fc.structs.user);
    });
});

router.post('/data_output_eos', (req, res, next) => {
    eos.getTableRows(({json:true, scope: "scm", code: "scm", table: "user"})).then(res => {
        return res.json(res);
        // console.log(myaccount.fc.structs.user);
    });
});

router.post('/data_input', (req, res, next) => {
    const username = req.body.username;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const gender = req.body.gender;
    const phone = req.body.phone;

    const values  = {username: username, firstname: firstname, lastname: lastname, email: email, gender: gender, phone: phone};

    handleDisconnect();

    connection.query('INSERT INTO user_data SET ?', values, function (error, results, fields) {
        if (error) {
            console.log(error);
            return res.json({
                error: true,
                msg: "retrying connection"
            });
        }
        connection.end();
    });

    return res.json({username: username});
});

router.post('/data_output', (req, res, next) => {
    handleDisconnect();

    connection.query("SELECT * FROM user_data", function (err, result, fields) {
        if (err) {
            console.log(err);
            return res.json({
                error: true,
                msg: "retrying connection"
            });
        }
        connection.end();
        // console.log(result);
        return res.json(result);
    });
});

module.exports = router;
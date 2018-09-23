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

router.post('/start', (req, res, next) => {
    eos.contract('sc.code', true).then(myaccount => {
        // const options = { authorization: [ `test.code@active` ] };
        // myaccount.hi({"user": "abc"}, options).then(result => res.json(result));
        console.log(myaccount);
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

// router.post('/get_price', (req, res, next) => {
//     // axios.get(option_etherscan_api + '/api?module=stats&action=ethprice&apikey=' + option_etherscan_api_key)
//     //     .then(function (response) {
//     //         return res.json({price: response.data.result.ethusd});
//     //     })
//     //     .catch(function (error) {
//     //         return res.json({success: false, msg: 'error'});
//     //     });
//     const coinmarketcap = new CoinMarketCap();
//     coinmarketcap.get("ethereum", coin => {
//         return res.json({price: coin.price_usd});
//     });
// });

// router.post('/get_tx_history', (req, res, next) => {
//     const addr = req.body.addr;
//     axios.get(option_etherscan_api + '/api?module=account&action=txlist&address=' + addr + '&startblock=0&endblock=99999999&sort=desc&apikey=' + option_etherscan_api_key)
//         .then(function (response) {
//             const obj = response.data.result;
//             for (let i = obj.length - 1; i > -1; i--){
//                 if (obj[i].input.length == 138 && (obj[i].from == erc20contract_address || obj[i].to == erc20contract_address)){
//                     const hex_value = obj[i].input.substr(obj[i].input.length - 40);
//                     obj[i].input = parseInt(hex_value, 16) /1000000;
//                 }
//                 else {
//                     obj.splice(i, 1);
//                 }
//             }
//             return res.json(obj);
//         })
//         .catch(function (error) {
//             return res.json({success: false, msg: 'Bad Address'});
//         });
// });

// router.post('/send_tx', (req, res, next) => {
//     const addr = req.body.addr;
//     const keystroage = req.body.keystroage;
//     const password = req.body.password;
//     const to = req.body.to;
//     const value = req.body.value * 1000000;
//     axios.get(option_etherscan_api + '/api?module=proxy&action=eth_gasPrice&apikey=' + option_etherscan_api_key)
//         .then(function (response) {
//             const gasPrice = response.data.result;
//             const ks = lightwallet.keystore.deserialize(keystroage);
//             axios.post(option_etherscan_api + '/api?module=proxy&action=eth_getTransactionCount&address=' + addr + '&tag=latest&apikey=' + option_etherscan_api_key)
//                 .then(function (res_nonce) {
//                     let options = {};
//                     options.nonce = res_nonce.data.result;
//                     options.to = erc20contract_address;
//                     options.gasPrice = gasPrice;
//                     options.gasLimit = 0x33450; //web3.toHex('210000');
//                     options.value = 0;
//                     const registerTx = lightwallet.txutils.functionTx(ABI, "transfer", [to, value], options);
//                     ks.keyFromPassword(password, function (err, pwDerivedKey) {
//                         if (err) {
//                             return res.send(err);
//                         }
//                         else {
//                             const signedTx = lightwallet.signing.signTx(ks, pwDerivedKey, registerTx, addr);
//                             axios.get(option_etherscan_api + '/api?module=proxy&action=eth_sendRawTransaction&hex=' + '0x' + signedTx + '&apikey=' + option_etherscan_api_key)
//                                 .then(function (res_tx) {
//                                     // return res.json(res_tx.data.result);
//                                     const tx_hash = res_tx.data.result;
//                                     if (res_tx.data.error){
//                                         if (res_tx.data.error.message.indexOf(0) > -1){
//                                             return res.json({success: false, msg: 'The account you tried to send transaction from does not have enough funds. Required ETH gas. Please check your ethereum balance.'});
//                                         }
//                                         else {
//                                             return res.json({success: false, msg: 'The previous transaction has not completed yet. Please wait and try again'});
//                                         }
//                                     }
//                                     else{
//                                         return res.json({success: true, msg: 'The request sent successfully', hash: tx_hash});
//                                     }
//                                     // const interval = setInterval(function() {
//                                     //     axios.get(option_etherscan_api + '/api?module=transaction&action=gettxreceiptstatus&txhash=' + tx_hash + '&apikey=' + option_etherscan_api_key)
//                                     //         .then(function (check_tx) {
//                                     //             // return res.send(check_tx.data.result.status);
//                                     //             if (check_tx.data.result.status == 1){
//                                     //                 clearInterval(interval);
//                                     //                 return res.json({success: true, hash: tx_hash, msg: 'Transaction success!'});
//                                     //                 // return res.send(res_tx.data.result);
//                                     //             }
//                                     //         })
//                                     //         .catch(function (error) {
//                                     //             return res.json({success: false, msg: 'Transaction checking error!'});
//                                     //         });
//                                     // }, 10000);
//                                 })
//                                 .catch(function (error) {
//                                     return res.json({success: false, msg: 'The account you tried to send transaction from does not have enough funds'});
//                                 });
//                         }
//                     });
//                     // return res.json(ks);
//                 })
//                 .catch(function (error) {
//                     return res.json({success: false, msg: 'error!'});
//                 });
//         })
//         .catch(function (error) {
//             return res.json({success: false, msg: 'Could not get gas price!'});
//         });
// });
//the price must be got from etherscan API. because coinmarketcap doesn't support the comsa API.
// router.post('/get_price', (req, res, next) => {
//     // axios.get(option_etherscan_api + '/api?module=stats&action=ethprice&apikey=' + option_etherscan_api_key)
//     //     .then(function (response) {
//     //         return res.json({price: response.data.result.ethusd});
//     //     })
//     //     .catch(function (error) {
//     //         return res.json({success: false, msg: 'error'});
//     //     });
//     const coinmarketcap = new CoinMarketCap();
//     coinmarketcap.get("cms", coin => {
//         return res.json({price: coin.price_usd});
//     });
// });

module.exports = router;
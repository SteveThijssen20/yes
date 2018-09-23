const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const ethSchema = mongoose.Schema({
    addr: {
      type: String,
      required: true
    },
    prv_key: {
      type: String,
      required: true
    },
    keystorage: {
      type: String,
      required: true
    },
    isreg: {
      type: Number,
      required: true
    },
    d12keys: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

ethSchema.index({ password: 1, addr: 1 });

const Eth = module.exports = mongoose.model('eth', ethSchema);

module.exports.addAddr = function(newAddr, callback){
    newAddr.save(callback);
}

module.exports.getWalletByPassword = function(password, callback){
    const query = {password: password}
    Eth.findOne(query, callback);
  }
  
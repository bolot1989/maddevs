'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let wallet = new Schema({ 
     moneyAmount: { type: Number, required: true },
     dev: {type: Schema.Types.ObjectId, ref: 'Developer'}
});

wallet.methods.addMoney = (sum) => {
    this._doc.moneyAmount += sum;
}

let Wallet = mongoose.model('Wallet', wallet);

module.exports = Wallet;
'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let client = new Schema({ 
     name: String
});


let Client = mongoose.model('Client', client);

module.exports = Client;

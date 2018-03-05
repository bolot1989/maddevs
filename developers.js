'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let developer = new Schema({ 
     name: { type: String, required: true, unique: true }
});


let Developer = mongoose.model('Developer', developer);

module.exports = Developer;
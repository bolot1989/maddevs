'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let task = new Schema({ 
     description: { type: String, required: true, unique: true },
     price: { type: Number, required: true},
     status: {type: String, enum: ['DONE', 'NEW', 'ASSIGNED'], required: true},
     client: {type: Schema.Types.ObjectId, ref: 'Client'}
});


let Task = mongoose.model('Task', task);

module.exports = Task;
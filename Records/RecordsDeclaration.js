var mongoose = require('mongoose');

//Creating record Schema
var recordSchema = new mongoose.Schema({
    key: String,
    createdAt: Date,
    counts: [Number]
})

var RecordsModel = mongoose.model('records', recordSchema);
module.exports = RecordsModel;
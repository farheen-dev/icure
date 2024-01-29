// factorModel.js for Modeling the user database
var mongoose = require('mongoose');

// Setup schema
var dataSchema = mongoose.Schema({
    keyword: String,
    Description: String
});

var Data = module.exports = mongoose.model('factors', dataSchema);
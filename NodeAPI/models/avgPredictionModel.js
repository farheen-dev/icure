// trackingModel.js for Modeling the user database
var mongoose = require('mongoose');
// Setup schema
var avgSchema = mongoose.Schema({
    UserID: String,
    AveragePrediction: Number
});


var  AvgPrediction = module.exports = mongoose.model('avgPrediction', avgSchema); 
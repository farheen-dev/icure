// trackingModel.js for Modeling the user database
var mongoose = require('mongoose');
// Setup schema
var trackSchema = mongoose.Schema({
    UserID: String,
    Age: Number,
    BMI: Number,
    Marital_Status: Number,
    Breast_Cancer_History: Number,
    Smoking: Number,
    Alcohol: Number,
    BreastFeeding: Number,
    Age_at_first_period: Number,
    Menstrual_Cycle: Number
});


var Track = module.exports = mongoose.model('contact', trackSchema);   // lets get the contact database as the main database where includes all the data from every users


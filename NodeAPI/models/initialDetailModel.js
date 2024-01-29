const mongoose = require('mongoose');

//Creating a Schema
const initialDetailSchema = mongoose.Schema({

    UserID: {
        type : String,
        required : true
    },

    Age: {
        type : Number,
        required : true
    },

    BMI: {
        type : Number,
        required : true
    },

    Breast_Feeding : {
        type : Number,
        required : true
    },

    Marital_Status : {
        type : Number,
        required : true
    },

    Alcohol : {
        type : Number,
        required : true
    },

    Smoking : {
        type : Number,
        required : true
    },

    Breast_Cancer_History : {
        type : Number,
        required : true
    },

    Age_at_first_period : {
        type : Number,
        required : true
    },

    Menstrual_Cycle : {
        type : Number,
        required : true
    },
    Prediction : {
        type : Number,
        required : true
    }

});

const test = module.exports = mongoose.model('formData', initialDetailSchema); // formData is collection name
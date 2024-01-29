const express = require("express");
const router = express.Router();
const Post = require("../models/initialDetailModel");
const Model = require("../models/trackingModel");
var bmi = require("bmi-calculator-function");
const axios = require("axios");

/*ROUTES------------------------------------------------------------------*/

/*GET ROUTE-------------------------------------*/

//GET Back all the posts
exports.getAll = async function (req, res) {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

//GET Back a specific post
exports.getById = async function (req, res) {
  try {
    var allData = await Post.find({});

    for (let x = 0; x <= allData.length - 1; x++) {
      if (allData[x].UserID == req.params.user_id) {
        var post = allData[x];
        return res.json(post);
      }
    }
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

/*POST ROUTE-------------------------------------*/

//POST Route to send the form data to the database

exports.postInitialDetails = function (req, res) {
  //console.log(req.body);

  let postData = {
    Age: age(req.body.DOB),
    BMI: Number.parseFloat(bmi.bmi(req.body.Height, req.body.Weight).bmi),
    Breast_Feeding: yesNoConversion(req.body.Breast_Feeding),
    Marital_Status: maritalStatus(req.body.Marital_Status),
    Alcohol: yesNoConversion(req.body.Alcohol),
    Smoking: yesNoConversion(req.body.Smoking),
    Breast_Cancer_History: yesNoConversion(req.body.Breast_Cancer_History),
    Age_at_first_period: req.body.Age_at_first_period,
    Menstrual_Cycle: menstrualCycle(req.body.Menstrual_Cycle),
  };

  const data = postData;
  let predictionValue;

  let prediction = getPrediction(data)
    .then((response) => {
      console.log(response.data);

      const post = new Post({
        UserID: req.body.Id,
        Age: age(req.body.DOB),
        BMI: bmi.bmi(req.body.Height, req.body.Weight).bmi,
        Breast_Feeding: yesNoConversion(req.body.Breast_Feeding),
        Marital_Status: maritalStatus(req.body.Marital_Status),
        Alcohol: yesNoConversion(req.body.Alcohol),
        Smoking: yesNoConversion(req.body.Smoking),
        Breast_Cancer_History: yesNoConversion(req.body.Breast_Cancer_History),
        Age_at_first_period: req.body.Age_at_first_period,
        Menstrual_Cycle: menstrualCycle(req.body.Menstrual_Cycle),
        Prediction: response.data,
      });

      var Track = new Model();

      Track.UserID = req.body.Id;
      Track.Age = age(req.body.DOB);
      Track.BMI = bmi.bmi(req.body.Height, req.body.Weight).bmi;
      Track.Marital_Status = maritalStatus(req.body.Marital_Status);
      Track.Breast_Cancer_History = yesNoConversion(
        req.body.Breast_Cancer_History
      );
      Track.Smoking = yesNoConversion(req.body.Smoking);
      Track.Alcohol = yesNoConversion(req.body.Alcohol);
      Track.BreastFeeding = yesNoConversion(req.body.Breast_Feeding);
      Track.Age_at_first_period = req.body.Age_at_first_period;
      Track.Menstrual_Cycle = menstrualCycle(req.body.Menstrual_Cycle);

      const savedPost = post.save().catch((err) => {
        return res.status(400).json({ message: err });
      });

      const save = Track.save().catch((err) => {
        return res.status(400).json({ message: err });
      });

      return res.send({ result: predictionRange(response.data) });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send("Something went wrong");
    });
};

/*DELETE ROUTE-------------------------------------*/

//Delete a specific post
exports.deleteInitialDetails = async function (req, res) {
  try {
    console.log(req.params.user_id);
    const removedPost = await Post.remove({ UserID: req.params.user_id });
    return res.json(removedPost);
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

/*UPDATE ROUTE-------------------------------------*/

exports.updateInitialDetails = async function (req, res) {
  try {
    const updatedPost = await Post.updateOne(
      { UserID: req.params.user_id },
      {
        $set: {
          Age: age(req.body.DOB),
          BMI: bmi.bmi(req.body.Height, req.body.Weight).bmi,
          Breast_Feeding: yesNoConversion(req.body.Breast_Feeding),
          Marital_Status: maritalStatus(req.body.Marital_Status),
          Alcohol: yesNoConversion(req.body.Alcohol),
          Smoking: yesNoConversion(req.body.Smoking),
          Breast_Cancer_History: yesNoConversion(
            req.body.Breast_Cancer_History
          ),
          Age_at_first_period: req.body.Age_at_first_period,
          Menstrual_Cycle: menstrualCycle(req.body.Menstrual_Cycle),
        },
      }
    );

    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

/*Using AXIOS to get HTTP request------------------------------------*/

const getPrediction = (data) => {
  try {
    return axios.post("http://localhost:5000/predict", data);
  } catch (error) {
    console.log(error);
  }
};

/*FUNCTION FOR CALCULATING THE AGE------------------------------------*/

function getYears(x) {
  return Math.floor(x / 1000 / 60 / 60 / 24 / 365);
}
function age(doc) {
  //  console.log(doc);
  let n = Date.now();
  let d = new Date(doc);
  doc = getYears(n - d);
  return doc;
}

/*FUNCTION FOR CONVERSION OF INPUTS------------------------------------*/

//Function for conversion of YES - NO inputs
function yesNoConversion(doc) {
  if (doc.toString().toLowerCase() === "yes") {
    doc = 1;
  } else {
    doc = 0;
  }
  return doc;
}

//Function for conversion of HAS-CYCLE - NO-CYCLE inputs
function menstrualCycle(doc) {
  if (doc.toString().toLowerCase() === "hascycle") {
    doc = 1;
  } else {
    doc = 0;
  }
  return doc;
}

//Function for conversion of MARRIED-TOGETHER-SINGLE inputs
function maritalStatus(doc) {
  if (doc.toString().toLowerCase() === "married") {
    doc = 1;
  } else if (doc.toString().toLowerCase() === "together") {
    doc = 2;
  } else {
    doc = 3;
  }
  return doc;
}

function predictionRange(doc) {
  val = Number.parseFloat(doc);
  let status;
  if (0 <= val && val <= 20) {
    status = 1;
  } else if (21 <= val && val <= 40) {
    status = 2;
  } else if (41 <= val && val <= 60) {
    status = 3;
  } else if (61 <= val && val <= 80) {
    status = 4;
  } else if (81 <= val && val <= 100) {
    status = 5;
  }
  return status;
}

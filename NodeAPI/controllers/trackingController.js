// trackingController.js
const axios = require("axios");

Model = require('../models/trackingModel');

Factor = require('../models/factorModel');

AveragePrediction = require('../models/avgPredictionModel');


exports.new = function (req, res) {
    console.log(req.body);


    var weight = Number(req.body.weight);
    var height = Number(req.body.height);

    var BMI = (weight / Math.pow((height * 0.01), 2));


    var Track = new Model();

    Track.UserID = req.body.UserID;
    Track.Age = req.body.Age;
    Track.BMI = BMI;
    Track.Marital_Status = req.body.Marital_Status;
    Track.Breast_Cancer_History = req.body.Breast_Cancer_History;
    Track.Smoking = req.body.Smoking;
    Track.Alcohol = req.body.Alcohol;
    Track.BreastFeeding = req.body.BreastFeeding;
    Track.Age_at_first_period = req.body.Age_at_first_period;
    Track.Menstrual_Cycle = req.body.Menstrual_Cycle;
    //Track.AveragePrediction = req.body.AveragePrediction;

    Model.find({}, function (err, docs) {
        if (!err) {
            allData = docs;

            userData = [];

            for (let x = 0; x <= allData.length - 1; x++) {
                if (allData[x].UserID === req.body.UserID) {
                    userData.push(allData[x]);
                }
            }

            var last = userData[userData.length - 1];
            console.log(last);

            var day = new Date();
            if (last._id.getTimestamp().getDate() + "-" + last._id.getTimestamp().getMonth() + "-" + last._id.getTimestamp().getFullYear() === day.getDate() + "-" + day.getMonth() + "-" + day.getFullYear()) {
                console.log("same day");
                Model.deleteOne({ _id: last._id }, function (err, result) {
                    if (err) {
                        console.log(err);;
                    }
                });
            }

            if (isNaN(req.body.Age)) { console.log("age is null"); Track.Age = last.Age; }

            if (isNaN(req.body.Marital_Status)) { console.log("marital is null"); Track.Marital_Status = last.Marital_Status; }

            if (isNaN(req.body.Breast_Cancer_History)) { console.log("medicalHistory is null"); Track.Breast_Cancer_History = last.Breast_Cancer_History; }

            if (isNaN(req.body.BreastFeeding)) { console.log("breasfeed is null"); Track.BreastFeeding = last.BreastFeeding; }

            if (isNaN(req.body.Age_at_first_period)) { console.log("firstperiod is null"); Track.Age_at_first_period = last.Age_at_first_period; }

            if (isNaN(req.body.Menstrual_Cycle)) { console.log("menopause is null"); Track.Menstrual_Cycle = last.Menstrual_Cycle; }

            if (isNaN(req.body.AveragePrediction)) { console.log("age is null"); Track.AveragePrediction = last.AveragePrediction; }

            // save the contact and check for errors
            Track.save(function (err) {
                // Check for validation error
                if (err)
                    res.json(err);
                else
                    res.json({
                        message: 'New contact created!',
                        data: Track
                    });
            });

        }
        else {
            throw err;
        }
    });

};


exports.view = function (req, res) {
    Model.findById(req.params.track_id, function (err, track) {
        if (err)
            res.send(err);
        res.json({
            message: 'Contact details loading..',
            data: track
        });
    });
};


exports.call = function (req, res) {

    console.log(req.body);

    var ID = req.body.UserID;

    Model.find({}, function (err, docs) {
        if (!err) {
            allData = docs;

            userData = [];

            for (let x = 0; x <= allData.length - 1; x++) {
                if (allData[x].UserID === ID) {
                    userData.push(allData[x]);
                }
            }

            var last = userData[userData.length - 1];
            console.log(last);

            Factor.find({}, function (err, docs) {
                if (!err) {
                    des = docs;

                    // console.log(des);

                    var Artical = [];

                    if (last.Age > 45) {
                        Artical.push(des[0]);
                    }
                    if (last.BMI >= 25) {
                        Artical.push(des[2]);
                    }
                    if (last.Marital_Status === 3) {
                        Artical.push(des[6]);
                    }
                    if (last.Breast_Cancer_History === 1) {
                        Artical.push(des[4]);
                    }
                    if (last.Smoking === 1) {
                        Artical.push(des[8]);
                    }
                    if (last.Alcohol === 1) {
                        Artical.push(des[1]);
                    }
                    if (last.BreastFeeding === 0) {
                        Artical.push(des[3]);
                    }
                    if (last.Age_at_first_period < 12 || last.Age_at_first_period > 16) {
                        Artical.push(des[4]);
                    }
                    if (last.Menstrual_Cycle === 0) {
                        Artical.push(des[7]);
                    }

                    res.json({
                        Artical: Artical
                    });
                }
                else {
                    throw err;
                }
            });

        }
        else {
            throw err;
        }
    });

};


// Handle delete contact
exports.delete = function (req, res) {
    Model.remove({
        _id: req.params.track_id
    }, function (err, track) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: "Contact deleted"
        });
    });
};


exports.index = async function (req, res) {
    console.log(req.body);

    var ID = req.body.UserID;

    var predictData = await getTrackingModel(ID);
    console.log(predictData);

    let prediction = getPrediction(predictData)
        .then((response) => {
            console.log(response.data);

            var Track = new AveragePrediction({
                UserID: ID,
                AveragePrediction: response.data
            });

            const savedPost = Track.save().catch((err) => {         //============================================
                return res.status(400).json({ message: err });
            });

            return res.send({
                result:predictionRange(response.data)
            });
        })
        .catch((error) => {
            console.log(error);
            return res.send("Something went wrong");
        });

};

const getPrediction = (data) => {
    try {
        return axios.post("http://localhost:5000/predict", data);
    } catch (error) {
        console.log(error);
    }
};

const getTrackingModel = async (id) => {
    var ID = id;
    var data;

    var allData = await Model.find({});

    userData = [];

    for (let x = 0; x <= allData.length - 1; x++) {
        if (allData[x].UserID === ID) {
            userData.push(allData[x]);
        }
    }

    var last = userData[userData.length - 1];

    var avgBMI = 0;
    var avgAlcohol = 0;
    var avgSmoking = 0;

    for (let y = 0; y <= userData.length - 1; y++) {
        avgBMI += userData[y].BMI;
        avgAlcohol += userData[y].Alcohol;
        avgSmoking += userData[y].Smoking;
    }

    avgBMI = avgBMI / userData.length;
    avgAlcohol = avgAlcohol / userData.length;
    avgSmoking = avgSmoking / userData.length;

    if (avgAlcohol >= 0.5) {
        avgAlcohol = 1;
    }
    else {
        avgAlcohol = 0;
    }
    if (avgSmoking >= 0.5) {
        avgSmoking = 1;
    }
    else {
        avgSmoking = 0;
    }


    let predictData = {
        Age: last.Age,
        BMI: avgBMI,
        Breast_Feeding: last.BreastFeeding,
        Marital_Status: last.Marital_Status,
        Alcohol: avgAlcohol,
        Smoking: avgSmoking,
        Breast_Cancer_History: last.Breast_Cancer_History,
        Age_at_first_period: last.Age_at_first_period,
        Menstrual_Cycle: last.Menstrual_Cycle,
    };

    data = predictData;

    console.log(data);


    return data;
};

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
  
  
// entry point of app

// Import express
let express = require('express');
// Import Body parser
let bodyParser = require('body-parser');
// Import Mongoose
let mongoose = require('mongoose');
// Initialize the app
let app = express();

// Import routes
let apiRoutes = require("./routes/api-routes");
// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


const httpErr = require('./models/httpErr');



//middleware for error handling
app.use((err, req, res, next) => {
    if (res.headerSend) {
        return next(err);
    }
    res.status(err.code || 500);
    res.json({ message: err.message || "An unknown error occured" });
})

// Connect to Mongoose and set connection variable
mongoose.connect('mongodb://localhost/DataBase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});


var db = mongoose.connection;

// Added check for DB connection

if (!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

// Setup server port
var port = process.env.PORT || 8000;

// Send message for default URL
app.get('/', (req, res) => res.send('Weekly tracking page is loaded'));

// Use Api routes in the App
app.use('/api', apiRoutes);

// httperr
app.use((req, res, next) => {
    return next(new httpErr("Could not find route", 404));
});

// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running Database on port " + port);
});

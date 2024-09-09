var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

const app = express();

// Middleware for parsing request bodies and serving static files
app.use(bodyParser.json());
app.use(express.static('public'));  // Ensure the 'public' directory contains index.html
app.use(bodyParser.urlencoded({
    extended: true
}));

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/moneyTracker', { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', () => console.log("Error in connecting to the Database"));
db.once('open', () => console.log("Connected to Database"));

// POST request to add data to the MongoDB collection
app.post("/add", (req, res) => {
    var category_select = req.body.category_select;
    var amount_input = req.body.amount_input;
    var info = req.body.info;
    var date_input = req.body.date_input;

    var data = {
        "Category": category_select,
        "Amount": amount_input,
        "Info": info,
        "Date": date_input
    };

    db.collection('users').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Record Inserted Successfully");
        res.redirect('/');
    });
});

// GET request for serving the index.html
app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('index.html');  // Ensure this file exists in the 'public' directory
});

// Listen on port 5000
app.listen(5000, () => {
    console.log("Listening on port 5000");
});

const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const todoRoutes = require("./api/routes/todos");

mongoose.connect(
  "mongodb+srv://aniket06:" +
    process.env.MONGO_ATLAS_PW +
    "@node-rest-shop-8yu0f.mongodb.net/node-rest-shop?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
mongoose.Promise = global.Promise;
//Handles morgan
app.use(morgan("dev"));

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS error Handling before sending the routes because we want to include these headers in all of our requests
//The asterisk used is for allowing access to all sorts of websites
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//Route which should handle requests
app.use("/todos", todoRoutes); // middleware

//Handling Error
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;

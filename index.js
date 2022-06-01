const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
const users = require("./routes/user");
require("dotenv/config");


// Body Parser
app.use(express.json());

// Middlewares
app.use(cors());
// Define Routes
app.use("/v1", users);

app.get("/", (req, res) => {
  // Health Check
  res.send("Hello World, the endpoint is up and healthy!");
});

// Unspecified endpoints
app.get("*", (req, res) => {
  res.status(404).json({
    error: 404,
    message: "The resource you requested does not exist.",
  });
});



// Conect to Database

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      autoIndex: true,
    });
    console.log("MongoDB Connected.");
    // Listening port
    server.listen(process.env.PORT || 8080, () => {
      console.log(
        `This application is running on port ${process.env.PORT || 8080} `
      );
    });
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

connectDB();

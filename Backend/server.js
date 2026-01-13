require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const  userRoutes  = require("./routes/user");
const resumeRoutes = require('./routes/resume');
const jobSearchRoutes = require('./routes/jobSearch');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.json())
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use('/api/user',userRoutes);
app.use('/api/resume',resumeRoutes);
app.use('/api/searchjobs',jobSearchRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
    app.listen(process.env.PORT, () => {
      console.log("Server connected at the Port 2000!");
    });
  })
  .catch((err) => {
    console.log("Error in server.js: ", err);
  });

require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Routes
const userRoutes = require("./routes/user");
const resumeRoutes = require("./routes/resume");
const jobSearchRoutes = require("./routes/jobSearch");
const applicationRoutes = require("./routes/application");
const sessionRoutes = require("./routes/session_routes");
const aiRoutes = require("./routes/ai_routes");

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running on port " + process.env.PORT);
});

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/", jobSearchRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/ai", aiRoutes);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully!");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
  });

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const contactRoutes = require("./routes/contact");

const app = express();

// ✅ FINAL, CORRECT CORS CONFIG
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://live-rootops-technologies-project.vercel.app",
      /^https:\/\/live-rootops-technologies-project-.*\.vercel\.app$/,
      "https://rootopstechnologies.in",
      "https://www.rootopstechnologies.in",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

app.use("/api/contact", contactRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

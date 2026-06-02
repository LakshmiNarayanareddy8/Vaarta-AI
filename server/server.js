require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const predictRoutes = require("./routes/predict");
const historyRoutes = require("./routes/history");
const authMiddleware = require("./middleware/auth");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", predictRoutes);
app.use("/api", historyRoutes);
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(console.log);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
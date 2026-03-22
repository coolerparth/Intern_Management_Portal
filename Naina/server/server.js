const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/intern", require("./routes/internRoutes"));
app.use("/api/task", require("./routes/taskRoutes"));
app.use("/api/report", require("./routes/reportRoutes"));
app.use("/api/evaluation", require("./routes/evaluationRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.get("/", (req, res) => {
  res.send("API running...");
});

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then((conn) =>
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  )
  .catch((err) => console.log(err));

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
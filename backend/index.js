const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const connectDb = require("./config/db");
connectDb();

const tasksRoutes = require("./routes/tasksRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/", express.static(path.join(__dirname, "build")));

// Routes
app.use("/api/tasks", tasksRoutes);
app.use("/api/users", userRoutes);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

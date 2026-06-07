const express = require("express");
const cors = require("cors");
require("dotenv").config();

const apiRoutes = require("./src/routes/apiRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", apiRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "LeadFlow AI API",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 LeadFlow AI API running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health\n`);
});

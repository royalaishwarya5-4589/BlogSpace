
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication Routes
app.use("/api/auth", authRoutes);

// Blog Routes
app.use("/api/blogs", blogRoutes);

// Home Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Blogging Platform API!"
    });
});

// Health Check Route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date()
    });
});

// Start Server
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log("--------------------------------");
            console.log("Blogging Platform Backend");
            console.log(`Server running: http://localhost:${PORT}`);
            console.log("--------------------------------");
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();


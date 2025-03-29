const express = require("express");
const { googleAuth } = require("../controllers/authController");

const Router = express.Router();

// For google oauth 2.0 user authentication
Router.get("/google", googleAuth);

module.exports = Router;

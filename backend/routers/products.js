// thư viện ở đây
const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const queryDatabase = require("@mySQLConfig");
const suid = require("@suid");
const getVNDate = require("@dateVN");

// biến ở đây
const router = express.Router();

module.exports = router;

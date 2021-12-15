var express = require("express");
var controller = require("../controllers/authv1.controller");
var router = express.Router();
var multer = require("multer");

router.post("/cultyvateffogenerateOTPnaccesskey", controller.cultyvateffogenerateOTPnaccesskey);
module.exports = router;

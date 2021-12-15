
var express = require("express");
var controller = require("../controllers/userinfo2.controller");
var router = express.Router();
var multer = require("multer");

router.post("/cultyvatejoinuserinfo", controller.cultyvatejoinuserinfo);


module.exports = router;

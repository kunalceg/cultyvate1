var express = require("express");
var controller = require("../controllers/userinfo.controller");
var router = express.Router();
var multer = require("multer");

router.post("/cultyvateffosaveuserinfo", controller.cultyvateffosaveuserinfo);


module.exports = router;

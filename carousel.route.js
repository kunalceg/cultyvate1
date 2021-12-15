var express = require("express");
var controller = require("../controllers/carousel.controller");
var router = express.Router();
var multer = require("multer");

router.post("/cultyvateffogetcarouseldetails", controller.cultyvateffogetcarouseldetails);
module.exports = router;

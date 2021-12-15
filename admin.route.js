var express = require("express");
var controller = require("../controllers/admin.controller");
var router = express.Router();
var multer = require("multer");

router.get("/cultyvateffogettncdetails", controller.cultyvateffogettncdetails);

router.get("/cultyvateffogetprivacydetails", controller.cultyvateffogetprivacydetails);

router.get("/cultyvateffogethelpdetails", controller.cultyvateffogethelpdetails);

module.exports = router;

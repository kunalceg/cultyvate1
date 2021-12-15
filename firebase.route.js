var express = require("express");
var controller = require("../controllers/firebase.controller");
var router = express.Router();

router.post("/pushNotify", controller.notify);

module.exports = router;

var config = require('../config/db.config.json');
var dbModel = null;
var dbmodel = null;
//var dbmodel1= null;

dbmodel = require("./mssqldata.db.js");
//dbmodel1 = require("./pulldata.db");

exports.DBMODEL2 = dbmodel;
//exports.DBMODEL2 = dbmodel1;

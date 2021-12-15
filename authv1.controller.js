const DBMODEL = require("../database/db.js").DBMODEL2;
const shortid = require("shortid");

exports.cultyvateffogenerateOTPnaccesskey = async (request, response, next) => {
  let clientModel = request.body;
  // generate accesskey
  let apikey = shortid.generate(6,{alphabets: false, specialChars: false });
    try {
    resultdb = await DBMODEL.dbvalidateaccesskey(clientModel, apikey);
    let respsending = {
      status: resultdb.status,
      message: resultdb.message,
      accessKey: apikey,
      
    };
    response.status(200).json(respsending);
  } catch (err) {
    response.status(200).json({
      status: "Error",
      message: `Error: Unable to Validate User`,
      details: err.message,
    });
  }
};

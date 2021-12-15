const DBMODEL = require("../database/db.js").DBMODEL2;

exports.cultyvateffosaveuserinfo = async (request, response, next) => {
  let clientModel = request.body
  console.log(" Save User Info ");
  try {
    saveresult = await DBMODEL.dbsaveuserdetails(clientModel);

    if (saveresult.status == "Success") {
      response.status(200).json({
        status: "Success",
      });
    } else {
      response.status(200).json({
        status: "Error",
        Message: "Access Key did not Match",
      });
    }
  } catch (err) {
    response.status(200).json({
      status: "Error",
      message: `Error: Unable to save user info Details`,
      details: err.message,
    });
  }
};



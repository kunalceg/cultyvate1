const DBMODEL = require("../database/db.js").DBMODEL2;

exports.cultyvateffogettncdetails = async (request, response, next) => {
  let clientModel = request.query;
  console.log(" Get tnc ");
  try {
    tncresult = await DBMODEL.dbgettncdetails(clientModel);

    var tncUrl = tncresult.Url;
    console.log(tncUrl);
    if (tncresult.status == "Success") {
      response.status(200).json({
        status: "Success",
        tncUrl: tncUrl,
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
      message: `Error: Unable to get TnC Details`,
      details: err.message,
    });
  }
};

exports.cultyvateffogetprivacydetails = async (request, response, next) => {
  let clientModel = request.query;
  console.log(" Get privacy ");
  try {
    privacyresult = await DBMODEL.dbgetprivacydetails(clientModel);

    var prvcyUrl = privacyresult.Url;
    console.log(prvcyUrl);
    if (privacyresult.status == "Success") {
      response.status(200).json({
        status: "Success",
        privacyUrl: prvcyUrl,
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
      message: `Error: Unable to get TnC Details`,
      details: err.message,
    });
  }
};


exports.cultyvateffogethelpdetails = async (request, response, next) => {
  let clientModel = request.query;
  console.log(" Get help details ");
  try {
    var helpresult = await DBMODEL.dbgethelpdetails(clientModel);

    var helpData = helpresult.helpdata;
    console.log(helpData);
    if (helpresult.status == "Success") {
      response.status(200).json({
        status: "Success",
        details: helpData,
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
      message: `Error: Unable to get Attendance Details`,
      details: err.message,
    });
  }
};


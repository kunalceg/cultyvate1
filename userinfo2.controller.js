const DBMODEL = require("../database/db.js").DBMODEL2;

exports.cultyvatejoinuserinfo = async (request, response, next) => {
  //response.send(request.param.contactn);
  let clientModel = request.body
  console.log(" Save User Info ");
  try {
    pullresult = await DBMODEL.dbpulluserdetails(clientModel);

    if (pullresult.status == "Success")
    {
           response.status(200).json({ 

        
            status: "Success",
                infoData : pullresult.data


                
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



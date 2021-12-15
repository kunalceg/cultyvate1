const DBMODEL2 = require("../database/db.js").DBMODEL2;

var { google } = require("googleapis");
var MESSAGING_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
var SCOPES = [MESSAGING_SCOPE];
const request = require("request-promise");

var admin = require("firebase-admin");
var serviceAccount = require("../config/firebase.config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://xxxxx-mobile.firebaseio.com",
});

exports.notify = async (req, res) => {
  datanotify = req.body;
  if (
    req.body.title == null ||
    req.body.title == undefined ||
    req.body.title == 0
  ) {
    res.send({
      Error: "Please provide title of message for sending notification",
    });
  } else if (
    req.body.body == null ||
    req.body.body == undefined ||
    req.body.body == 0
  ) {
    res.send({
      Error: "Please provide body of message for sending notification",
    });
  } else if (
    req.body.app_name == null ||
    req.body.app_name == undefined ||
    req.body.app_name == 0
  ) {
    res.send({ Error: "Please provide Name of APP for sending notification" });
  } else if (
    req.body.token == null ||
    req.body.token == undefined ||
    req.body.token == 0
  ) {
    res.send({ Error: "Please provide registration token" });
  } else {
    try {
      getAccessToken().then(function (accessToken) {
        var title = req.body.title;
        var body = req.body.body;
        var token = req.body.token;
        console.log("access_token :", accessToken);
        request.post(
          {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
            url: "https://fcm.googleapis.com/v1/projects/xxxxx-mobile/messages:send",
            body: JSON.stringify({
              message: {
                token: token,
                notification: {
                  body: body,
                  title: title,
                },
              },
            }),
          },
          function (error, response, body) {
            res.send({ status: "Success", body });

            console.log(body);
          }
        );
      });
    } catch (err) {
      res.status(200).json({
        status: "Error",
        message: `Error: Unable to get token and send message`,
        details: err.message,
      });
    }
  }
};

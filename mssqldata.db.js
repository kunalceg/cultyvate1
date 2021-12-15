const { sql } = require("googleapis/build/src/apis/sql");
const DB = require("mssql");
const { clear } = require("winston");
var db_config = require("../config/db.config.json");

const comp = require("../controllers/authv1.controller");
const config = {
  user: db_config.user,
  password: db_config.password,
  server: db_config.server,
  database: db_config.database,
  options: {
    encrypt: db_config.options["encrypt"],
    enableArithAbort: db_config.options["enableArithAbort"],
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 70000,
    acquireTimeoutMillis: 40000,
    reapIntervalMillis: 1000,
  },
};

DB.on("error", (err) => {
  console.log("MSSQL exception raised ");
});

const poolPromise = new DB.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to MSSQL");
    return pool;
  })
  .catch((err) =>
    console.log("Database Connection Failed! Bad Config: " + err)
  );
exports.dbvalidateaccesskey = async function (clientModel, apikey) {
  let pool = await poolPromise;
  let selectReq1 = await pool.request();
  let selectReq2 = await pool.request();
  let updatreq1 = await pool.request();
  let insertreq1 = await pool.request();
  let selectreq2 = await pool.request();
  

//-------------------------------------------------------------------------------------------------------------------------------
let resp = await selectReq1
.input("contactnumber", DB.VarChar, clientModel.contactnumber)
.query(
  "Select * from useraccessinfo where contactnumber=@contactnumber"
);

  if (
        resp.recordset == null ||
        resp.recordset[0] == undefined ||
        resp.recordset[0].length == 0
) {
  let resp1 = await insertreq1

  .input("contactnumber", DB.VarChar, clientModel.contactnumber)
  .input("accessKey", DB.VarChar,apikey)
  .input("createdate", DB.Date, clientModel.createdate)
  .query(`Insert into useraccessinfo  (contactnumber,accessKey,createdate)  values(@contactnumber,@accessKey,GETDATE())`);
  console.log("input data : " + JSON.stringify(clientModel));

    return {
      status: "Success",
      Message: " Data already exists"
        };
} else {
      if (resp.recordset[0].apikey == clientModel.apikey) {
        let userrecord = await selectReq2
          .input("contactnumber", DB.VarChar, clientModel.contactnumber)
          .query(
      "Select * from useraccessinfo where contactnumber=@contactnumber");

          if (userrecord.recordset.length > 0) {

            let resp = await updatreq1 //s

            .input("contactnumber", DB.VarChar, clientModel.contactnumber)
            .input("apikey", DB.VarChar,apikey)
            .input("modifieddate", DB.Date, clientModel.modifieddate)
            .query(`update useraccessinfo set accessKey=@apikey ,modifieddate=GETDATE()  where contactnumber=@contactnumber`);
            console.log("input data : " + JSON.stringify(clientModel));
            return {
                status: "Success",
                Message: " Data already exists"
                  };
            } 
        else {
              let resp1 = await insertreq1

                .input("contactnumber", DB.VarChar, clientModel.contactnumber)
                .input("accessKey", DB.VarChar,apikey)
                .query(`Insert into useraccessinfo  (contactnumber,accessKey)  values(@contactnumber,@accessKey)`);
                console.log("input data : " + JSON.stringify(clientModel));

                  return {
                    status: "Success",
                    Message: " Data already exists"
                      };
             }

      }

    }
      
};

exports.dbgetcarouseldetails = async function (clientModel) {
  let pool = await poolPromise;
  let selectReq1 = await pool.request();
  let selectReq2 = await pool.request();

  console.log("input data : " + JSON.stringify(clientModel));

  let resp = await selectReq1
    .input("gId", DB.VarChar, "1")
    .input("u_id", DB.VarChar, clientModel.uid)
    .query(
      "Select * from unikulmobileaccesskeytbl where gid=@gId and U_ID=@u_id"
    );

  var carouselImageList = [];

  if (
    resp.recordset == null ||
    resp.recordset[0] == undefined ||
    resp.recordset[0].length == 0
  ) {
    return {
      status: "Failure",
      Message: "Access Key did not Match",
    };
  } else {
    if (resp.recordset[0].accessKey == clientModel.accessKey) {
      let carouselData = await selectReq2
        .input("gid", DB.Int, "1")
        .query(
          "Select imageurl from unikulmobilecarouseltbl where gid=@gid order by prority Asc"
        );

      console.log("carousel data : " + JSON.stringify(carouselData));
      if (carouselData.recordset.length > 0) {
        for (var i = 0; i < carouselData.recordset.length; i++) {
          carouselImageList.push(carouselData.recordset[i].imageurl);
        }
        return {
          status: "Success",
          imageList: carouselImageList,
        };
      }
    } else {
      console.log("accesskey doesnot match");
      return {
        status: "Failure",
        Message: "Access Key did not Match",
        imageList: carouselImageList,
      };
    }
  }
};

exports.dbsaveuserdetails = async function (clientModel) {
  let pool = await poolPromise;
  let selectReq1 = await pool.request();
  let selectReq2 = await pool.request();
  let selectReq3 = await pool.request();// 
  let selectReq4 = await pool.request();
  let insertReq1 = await pool.request();
  let insertReq2 = await pool.request();
  let insertReq3 = await pool.request();
  let insertReq4 = await pool.request();
  let updatereq1 = await pool.request();
  let updatereq2 = await pool.request();
  let displayReq = await pool.request();

  let resp = await selectReq1
    .input("contactnumber", DB.VarChar, clientModel.contactnumber)
    .query(
      "Select * from useraccessinfo where contactnumber=@contactnumber"
    );

  if (
    resp.recordset == null ||
    resp.recordset[0] == undefined ||
    resp.recordset[0].length == 0
  ) {
    return {
      status: "Failure",
      Message: "Access Key did not Match",
    };
  } else {
    if (resp.recordset[0].accessKey == clientModel.accessKey) {
      let userrecord = await selectReq2
        .input("contactnumber", DB.VarChar, clientModel.userdetails.personal.contactnumber)
        .query(
          "Select * from farmerinfo where contactnumber=@contactnumber"
        );

      if (userrecord.recordset.length > 0) {
        
        
        // update value

        //update landinfo

        let userrecord1 = await selectReq3
        .input("farmercontactnun", DB.VarChar, clientModel.userdetails.personal.contactnumber)
        .query(`select farmerid from farmerinfo where contactnumber= @farmercontactnun`);
        console.log(userrecord1.recordset[0].farmerid)
        console.log(userrecord1)
        temp_var=userrecord1.recordset.farmerid
         

           let resp1= updatereq1
            .input("totalareaacres", DB.VarChar, clientModel.userdetails.land.totalareaacres)
            .input("soiltype", DB.VarChar, clientModel.userdetails.land.soiltype)
            .input("soiltexture", DB.VarChar, clientModel.userdetails.land.soiltexture)
            .input("cropgrown", DB.VarChar, clientModel.userdetails.land.cropgrown)
            .input("varietyofcrop", DB.VarChar, clientModel.userdetails.land.varietyofcrop)
            .input("sourceofirrigationwater", DB.VarChar, clientModel.userdetails.land.sourceofirrigationwater)
            .input("farmerid", DB.Int, userrecord1.recordset[0].farmerid)
            .query(`update landinfo set totalareaacres=@totalareaacres,soiltype=@soiltype,soiltexture=@soiltexture,
            cropgrown=@cropgrown,varietyofcrop=@varietyofcrop,sourceofirrigationwater=@sourceofirrigationwater  where farmerid=@farmerid`);
             // console.log("update data : " + JSON.stringify(clientModel));

      // update deviceinfo
     // let userrecord2 = await selectReq4
      let resp2= updatereq2
      .input("No_of_borewells", DB.Int, clientModel.userdetails.device.No_of_borewells)
      .input("No_of_pumps", DB.Int, clientModel.userdetails.device.No_of_pumps)
      .input("capacity_of_each_pump", DB.Float, clientModel.userdetails.device.capacity_of_each_pump)
      .input("design_of_drip_irrigation", DB.VarChar, clientModel.userdetails.device.design_of_drip_irrigation)
      .input("emiter_capacity_in_liter_per_hr", DB.Float, clientModel.userdetails.device.emiter_capacity_in_liter_per_hr)
      .input("main_pipeline_size_inches", DB.Float, clientModel.userdetails.device.main_pipeline_size_inches)
      .input("sub_main_pipeline_size_inches", DB.Float, clientModel.userdetails.device.sub_main_pipeline_size_inches)
      .input("no_of_main_valves_its_size_ininches", DB.Int, clientModel.userdetails.device.no_of_main_valves_its_size_ininches)
      .input("no_of_submain_main_valves_its_size_ininches", DB.Int, clientModel.userdetails.device.no_of_submain_main_valves_its_size_ininches)
      .input("no_of_valves_opened_at_once_for_watering", DB.Int, clientModel.userdetails.device.no_of_valves_opened_at_once_for_watering)
      .input("is_filter_available", DB.VarChar, clientModel.userdetails.device.is_filter_available)
      .input("if_yes_filtername", DB.VarChar, clientModel.userdetails.device.if_yes_filtername)
      .input("driplayout", DB.VarChar, clientModel.userdetails.device.driplayout)
      .input("network_service_provider", DB.VarChar, clientModel.userdetails.device.network_service_provider)
      .input("infrastructure_available", DB.VarChar, clientModel.userdetails.device.infrastructure_available)
             .input("farmerid", DB.Int, userrecord1.recordset[0].farmerid)

             .query(`update deviceinfo set No_of_borewells=@No_of_borewells,No_of_pumps=@No_of_pumps,capacity_of_each_pump=@capacity_of_each_pump,design_of_drip_irrigation=@design_of_drip_irrigation, emiter_capacity_in_liter_per_hr=@emiter_capacity_in_liter_per_hr,
             main_pipeline_size_inches=@main_pipeline_size_inches,sub_main_pipeline_size_inches=@sub_main_pipeline_size_inches,no_of_main_valves_its_size_ininches=@no_of_main_valves_its_size_ininches,no_of_submain_main_valves_its_size_ininches=@no_of_submain_main_valves_its_size_ininches,no_of_valves_opened_at_once_for_watering=@no_of_valves_opened_at_once_for_watering,
             is_filter_available=@is_filter_available,if_yes_filtername=@if_yes_filtername,driplayout=@driplayout,network_service_provider=@network_service_provider,infrastructure_available=@infrastructure_available  where farmerid=@farmerid`)

      
      
             return {
              status: "Success",
              Message: "Updated data",
            };
            }

      // insert  data to table 
      else {
       // insert personal data to table   
        let insertResp1 = await insertReq2
          .input("farmercontactnun", DB.VarChar, clientModel.userdetails.personal.contactnumber)
          .input("farmername", DB.VarChar, clientModel.userdetails.personal.farmername)
          .input("pincode", DB.Int, clientModel.userdetails.personal.pincode)
          .input("villagename", DB.VarChar, clientModel.userdetails.personal.name_of_village)
          .input("createdby", DB.VarChar, clientModel.contactnumber)
          .query(`Insert into farmerinfo (contactnumber,farmername,name_of_village,pincode, 
            created_at_date,modified_date,createby)
                  values(@farmercontactnun, @farmername, @villagename, @pincode,GETDATE(), GETDATE(), @createdby)`);

// pull user id from userinfo
        let userrecord1 = await selectReq3
        .input("farmercontactnun", DB.VarChar, clientModel.userdetails.personal.contactnumber)
        .query(`select farmerid from farmerinfo where contactnumber= @farmercontactnun`);
        console.log(userrecord1.recordset[0].farmerid)
        console.log(userrecord1)
        temp_var=userrecord1.recordset.farmerid
    
		    let insertResp2 = await insertReq3 
		      .input("totalareaacres", DB.VarChar, clientModel.userdetails.land.totalareaacres)
          .input("soiltype", DB.VarChar, clientModel.userdetails.land.soiltype)
          .input("soiltexture", DB.VarChar, clientModel.userdetails.land.soiltexture)
          .input("cropgrown", DB.VarChar, clientModel.userdetails.land.cropgrown)
          .input("varietyofcrop", DB.VarChar, clientModel.userdetails.land.varietyofcrop)
          .input("dateofsowing", DB.Date, clientModel.userdetails.land.dateofsowing)
          .input("sourceofirrigationwater", DB.VarChar, clientModel.userdetails.land.sourceofirrigationwater)
          .input("createdate", DB.Date, clientModel.userdetails.land.createdate)
          .input("farmerid", DB.Int, userrecord1.recordset[0].farmerid)
          //.input("farmerid", DB.Int, clientModel.userdetails.land.temp_var)
          .query(`Insert into landinfo (farmerid,totalareaacres,soiltype,soiltexture,cropgrown, varietyofcrop, dateofsowing, sourceofirrigationwater,createdate)
                              values(@farmerid,@totalareaacres, @soiltype, @soiltexture, @cropgrown,@varietyofcrop, GETDATE(), @sourceofirrigationwater,GETDATE())`);          
            
       
        //deviceinfo     
        let insertResp3 = await insertReq4
            .input("No_of_borewells", DB.Int, clientModel.userdetails.device.No_of_borewells)
            .input("No_of_pumps", DB.Int, clientModel.userdetails.device.No_of_pumps)
            .input("capacity_of_each_pump", DB.Float, clientModel.userdetails.device.capacity_of_each_pump)
            .input("design_of_drip_irrigation", DB.VarChar, clientModel.userdetails.device.design_of_drip_irrigation)
            .input("emiter_capacity_in_liter_per_hr", DB.Float, clientModel.userdetails.device.emiter_capacity_in_liter_per_hr)
            .input("main_pipeline_size_inches", DB.Float, clientModel.userdetails.device.main_pipeline_size_inches)
            .input("sub_main_pipeline_size_inches", DB.Float, clientModel.userdetails.device.sub_main_pipeline_size_inches)
            .input("no_of_main_valves_its_size_ininches", DB.Int, clientModel.userdetails.device.no_of_main_valves_its_size_ininches)
            .input("no_of_submain_main_valves_its_size_ininches", DB.Int, clientModel.userdetails.device.no_of_submain_main_valves_its_size_ininches)
            .input("no_of_valves_opened_at_once_for_watering", DB.Int, clientModel.userdetails.device.no_of_valves_opened_at_once_for_watering)
            .input("is_filter_available", DB.VarChar, clientModel.userdetails.device.is_filter_available)
            .input("if_yes_filtername", DB.VarChar, clientModel.userdetails.device.if_yes_filtername)
            .input("driplayout", DB.VarChar, clientModel.userdetails.device.driplayout)
            .input("network_service_provider", DB.VarChar, clientModel.userdetails.device.network_service_provider)
            .input("infrastructure_available", DB.VarChar, clientModel.userdetails.device.infrastructure_available)
            .input("createdate", DB.Date, clientModel.userdetails.device.createdate)
            .input("farmerid", DB.Int, userrecord1.recordset[0].farmerid)
            .query(`Insert into deviceinfo (farmerid,No_of_borewells,No_of_pumps,capacity_of_each_pump,design_of_drip_irrigation, emiter_capacity_in_liter_per_hr,
                   main_pipeline_size_inches,sub_main_pipeline_size_inches,no_of_main_valves_its_size_ininches,no_of_submain_main_valves_its_size_ininches,no_of_valves_opened_at_once_for_watering,
                   is_filter_available,if_yes_filtername,driplayout,network_service_provider,infrastructure_available,createdate)
                    values(@farmerid,@No_of_borewells,@No_of_pumps,@capacity_of_each_pump,@design_of_drip_irrigation, @emiter_capacity_in_liter_per_hr,
                   @main_pipeline_size_inches,@sub_main_pipeline_size_inches,@no_of_main_valves_its_size_ininches,@no_of_submain_main_valves_its_size_ininches,@no_of_valves_opened_at_once_for_watering,
                   @is_filter_available,@if_yes_filtername,@driplayout,@network_service_provider,@infrastructure_available,GETDATE())`); 
        return {
          status: "Success",
          Message: " Data Inserted"};}

    } else {
      console.log("accesskey doesnot match");
      return {
        status: "Failure",
        Message: "Access Key did not Match",
      };
    }
  }
};

// pull the data

exports.dbpulluserdetails = async function (clientModel,contactnumber) {
  let pool = await poolPromise;
  let selectReq1 = await pool.request();
  let selectReq2 = await pool.request();
  let selectReq3 = await pool.request();
  let pullResp   = await pool.request();
  let sqlRequest = await pool.request();

  
  let resp = await selectReq1
  .input("Contactnumber", DB.VarChar, clientModel.contactnumber)
  .query(
    "Select * from useraccessinfo where contactnumber=@contactnumber"
  );

if (
  resp.recordset == null ||
  resp.recordset[0] == undefined ||
  resp.recordset[0].length == 0
) {
  return {
    status: "Failure",
    Message: "contactnumber did not Match",
  };
} else {
  if (resp.recordset[0].contactnumber == clientModel.contactnumber) {
    let userrecord = await selectReq2
      .input("contactnumber", DB.VarChar, clientModel.userdetails.personal.contactnumber)
      .query(
        "Select * from farmerinfo where contactnumber=@contactnumber"
      );

    if (userrecord.recordset.length > 0) {
      
        let pullrecord1 = await selectReq3
        .input("contactnumber", DB.VarChar, clientModel.userdetails.personal.contactnumber)
        .query(`select farmerid from farmerinfo where contactnumber= @contactnumber`);
        console.log(pullrecord1.recordset[0].farmerid)
        console.log(pullrecord1)
        temp_var=pullrecord1.recordset.farmerid

        let pullreq1 = await pullResp
        .input("contactnumber", DB.VarChar, clientModel.userdetails.personal.contactnumber)
        .query(`select farmerinfo.farmerid,useraccessinfo.contactnumber,farmerinfo.farmername,farmerinfo.name_of_village,
        landinfo.totalareaacres,landinfo.soiltype,landinfo.soiltexture,landinfo.cropgrown,landinfo.varietyofcrop,landinfo.dateofsowing,landinfo.sourceofirrigationwater,
        deviceinfo.No_of_borewells,deviceinfo.No_of_pumps,deviceinfo.capacity_of_each_pump,deviceinfo.design_of_drip_irrigation,deviceinfo.emiter_capacity_in_liter_per_hr,deviceinfo.main_pipeline_size_inches,deviceinfo.sub_main_pipeline_size_inches,deviceinfo.no_of_main_valves_its_size_ininches,deviceinfo.no_of_valves_opened_at_once_for_watering,
        deviceinfo.is_filter_available,deviceinfo.if_yes_filtername,deviceinfo.driplayout,deviceinfo.network_service_provider,deviceinfo.infrastructure_available,deviceinfo.createdate
        from farmerinfo
        join useraccessinfo
        on farmerinfo.contactnumber=useraccessinfo.contactnumber
                join landinfo
        on farmerinfo.farmerid=landinfo.farmerid
        		join deviceinfo
	     	on landinfo.farmerid=deviceinfo.farmerid
	     	where farmerinfo.contactnumber=@contactnumber
         `)
        console.log(pullreq1.recordset[0])
    let result = {
      "infodata" : pullreq1.recordset
    };
  return {
    status: "Success",
        data : result

            };}

} else {
  console.log("accesskey doesnot match");
  return {
    status: "Failure",
    Message: "Access Key did not Match"
  };
}
}
};


exports.dbgettncdetails = async function (clientModel) {
  let pool = await poolPromise;
  let selectReq1 = await pool.request();
  let selectReq2 = await pool.request();

  console.log("input data : " + JSON.stringify(clientModel));

  let resp = await selectReq1
    .input("gId", DB.VarChar, "1")
    .input("u_id", DB.VarChar, clientModel.uid)
    .query(
      "Select * from unikulmobileaccesskeytbl where gid=@gId and U_ID=@u_id"
    );

  if (
    resp.recordset == null ||
    resp.recordset[0] == undefined ||
    resp.recordset[0].length == 0
  ) {
    return {
      status: "Failure",
      Message: "Access Key did not Match",
    };
  } else {
    if (resp.recordset[0].accessKey == clientModel.accessKey) {
      let TncData = await selectReq2
        .input("gid", DB.Int, "1")
        .input("settingName", DB.VarChar, "TnCUrl")
        .query(
          "Select settingValue from [unikuladminsetting] where gid=@gid and settingName=@settingName"
        );
      if (TncData.recordset.length > 0) {
        console.log("TnC details : " + JSON.stringify(TncData.recordset));
        return {
          status: "Success",
          Url: TncData.recordset[0].settingValue,
        };
      }
    } else {
      console.log("accesskey doesnot match");
      return {
        status: "Failure",
        Message: "Access Key did not Match",
      };
    }
  }
};

exports.dbgetprivacydetails = async function (clientModel) {
  let pool = await poolPromise;
  let selectReq1 = await pool.request();
  let selectReq2 = await pool.request();

  console.log("input data : " + JSON.stringify(clientModel));

  let resp = await selectReq1
    .input("gId", DB.VarChar, "1")
    .input("u_id", DB.VarChar, clientModel.uid)
    .query(
      "Select * from unikulmobileaccesskeytbl where gid=@gId and U_ID=@u_id"
    );

  if (
    resp.recordset == null ||
    resp.recordset[0] == undefined ||
    resp.recordset[0].length == 0
  ) {
    return {
      status: "Failure",
      Message: "Access Key did not Match",
    };
  } else {
    if (resp.recordset[0].accessKey == clientModel.accessKey) {
      let prvcyData = await selectReq2
        .input("gid", DB.Int, "1")
        .input("settingName", DB.VarChar, "PrivacyPolicy")
        .query(
          "Select settingValue from [unikuladminsetting] where gid=@gid and settingName=@settingName"
        );
      if (prvcyData.recordset.length > 0) {
        console.log(
          "prvcyData details : " + JSON.stringify(prvcyData.recordset)
        );
        return {
          status: "Success",
          Url: prvcyData.recordset[0].settingValue,
        };
      }
    } else {
      console.log("accesskey doesnot match");
      return {
        status: "Failure",
        Message: "Access Key did not Match",
      };
    }
  }
};


exports.dbgethelpdetails = async function (clientModel) {
  let pool = await poolPromise;
  let selectReq1 = await pool.request();
  let selectReq2 = await pool.request();

  console.log("input data : " + JSON.stringify(clientModel));

  let resp = await selectReq1
    .input("gId", DB.VarChar, "1")
    .input("u_id", DB.VarChar, clientModel.uid)
    .query(
      "Select * from unikulmobileaccesskeytbl where gid=@gId and U_ID=@u_id"
    );

  if (
    resp.recordset == null ||
    resp.recordset[0] == undefined ||
    resp.recordset[0].length == 0
  ) {
    return {
      status: "Failure",
      Message: "Access Key did not Match",
    };
  } else {
    if (resp.recordset[0].accessKey == clientModel.accessKey) {
      let helpData = await selectReq2.query(
        `select question, answer from [dbo].[unikulhelpdetailstbl] where isactive='Yes' and isdelete = 'No'`
      );
      if (helpData.recordset.length > 0) {
        console.log("helpData details : " + JSON.stringify(helpData.recordset));

        return {
          status: "Success",
          helpdata: helpData.recordset,
        };
      } else {
        return {
          status: "Failure",
          helpdata: helpData.recordset,
        };
      }
    } else {
      console.log("accesskey doesnot match");
      return {
        status: "Failure",
        Message: "Access Key did not Match",
      };
    }
  }
};
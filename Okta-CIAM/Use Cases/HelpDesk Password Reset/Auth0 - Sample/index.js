var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");
const axios = require('axios');

var useraccount = null;

require('dotenv').config();


var app = express();

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use("/public", express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");

app.post("/lookup", function (request, response) {
  var phonenumber = request.body.phone;
  var token = process.env.API_TOKEN;
  if (phonenumber) {
    headers = {'authorization': 'Bearer ' + token};
    axios.get(process.env.BASE_URL + '/api/v2/users?q=user_metadata.telephone%3A' + phonenumber + '&search_engine=v3', {'headers':headers})
    .then((resp) => {
        //console.log(resp);
        useraccount  = (resp.data)[0];
        response.render('lookupdetails',{user: useraccount})
    });
  } else {
    response.send("Please enter Phone Number!");
    response.end();
  }
});

app.post("/genotp", function (request, response) {
  var data = {
    "client_id": process.env.CLIENT_ID,
    "client_secret": process.env.CLIENT_SECRET,
    "connection": "email",
    "email": useraccount.email,
    "send": "code", 
    "authParams": {}
  };

  axios.post(process.env.BASE_URL + '/passwordless/start', data)
    .then((resp) => {
        //console.log(resp);
        response.render('inputotp')
    });
  
});

app.post("/validateotp", function (request, response) {

  var data = {
    "grant_type" : "http://auth0.com/oauth/grant-type/passwordless/otp",
    "client_id": process.env.CLIENT_ID,
    "client_secret": process.env.CLIENT_SECRET,
    "username":useraccount.email,
    "otp": request.body.otp,
    "realm": "email",
    "scope": "openid profile email"  
  };

  axios.post(process.env.BASE_URL + '/oauth/token', data)
    .then((resp) => {
        console.log(resp.data.access_token);
        if (resp.data.access_token){
          response.render('resetpassword', {otpvalid: true})
        }
        else {
          response.send("OTP invalid!");
          response.end();
        }
        
    }).catch(
      function (error) {
        console.log(error)
        response.send("OTP invalid!");
        response.end();
    });

});

app.post("/resetpassword", function (request, response) {

  //Cleanup Passwordless JIT account
  let headers = {'authorization': 'Bearer ' + process.env.API_TOKEN};
  axios.get(process.env.BASE_URL + '/api/v2/users?q=email%3A' + useraccount.email + '  AND identities.connection%3Aemail&search_engine=v3', {'headers':headers})
  .then((resp) => {
    //console.log(resp.data);
    axios.delete(process.env.BASE_URL + '/api/v2/users/'+ (resp.data)[0].user_id, {'headers':headers})
      .then((resp2) => {
          console.log(resp2.data);
      }).catch(
        function (error2) {
          console.log(error2)
      });
  });
  

  var data = {
    "client_id": process.env.CLIENT_ID,
    "email": useraccount.email,
    "connection": process.env.CONNECTION,
  };

  axios.post(process.env.BASE_URL + '/dbconnections/change_password', data)
    .then((resp) => {
        //console.log(resp);
        response.render('complete')
    });
  
});

app.get("/", function (request, response) {
  response.render("index", { title: "HelpDesk Tool", message: "Helpdesk Password Reset Tool" });
});

app.listen(process.env.PORT || 3000);

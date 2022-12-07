var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");
require('dotenv').config();

const provider = require('./authenticators/' + process.env.PROVIDER)

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

// Fetch the public keys for verification at startup
var key ;
provider.getKeys()
  .then((data) => {
    key = data;
});

// Authorize endpoint called from Okta. Initial authorization call when infound fed operation is triggered
// Show the custom login page
app.get("/authorize", (request, response) => {
  console.log("Start authorization");
  response.render("login", {
    error: false,
    url: request.query.redirect_uri,
    state: request.query.state,
  });
});

// Token endpoint called from Okta. Get the signed token for IDP verification
app.post("/token", (request, response) => {
  console.log("Get Token");
  response.send(provider.getToken(request.body.code));
});

// JWKS endpoint called from Okta. Get the public keys for IDP verification 
app.get("/keys", (request, response) => {
  console.log("Get Keys");
  response.send(key);
});

// External authentication implementation. Redirect to Okta with the authorization code after successful authentication. 
app.post("/auth", function (request, response) {
  var username = request.body.username;
  var password = request.body.password;
  if (username && password) {
    const result = provider.validateLogin(username, password)
      .then((code) => {
          response.redirect(
            request.body.url + "?code=" + code + "&state=" + request.body.state
          );
      })
      .catch((error) => {
        response.send("Login Failed: " + error);
        response.end();
      });
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
});

app.get("/", function (request, response) {
  response.render("index", { title: "Hey", message: "This is a Sample OpenID Connect Login Provider!" });
});

app.listen(process.env.PORT || 3000);

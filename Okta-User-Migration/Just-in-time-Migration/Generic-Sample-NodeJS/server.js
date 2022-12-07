
const express = require('express');
const basicAuth = require('express-basic-auth')
const { body, validationResult } = require('express-validator');
const bodyParser = require('body-parser');

const users = require('./users');

const app = express();

app.use(bodyParser.json());

app.use(basicAuth({
  users: { 'admin': 'supersecret' },
  unauthorizedResponse: req => 'Unauthorized'
}));

const passwordImportValidation = [
    body('data.context.credential.username', 'Must be a non empty string').exists().bail().isString().bail().notEmpty(),
    body('data.context.credential.password', 'Must be a non empty string').exists().bail().isString().bail().notEmpty(),
  ];

app.post('/passwordimport', passwordImportValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
}

//console.log(req.body)
//console.log(JSON.stringify(req.headers));

const credentials = req.body.data.context.credential;

if (users.validate(credentials.username, credentials.password)) {
    console.log("Valid")
    return res.status(200).json({
      "commands": [
        {
          "type": "com.okta.action.update",
            "value": {
            "credential": "VERIFIED"
          }
        }
      ]
    });
  }
  return res.status(204).send();
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}!`));
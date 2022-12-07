# HelpDesk Password Reset Tool (Auth0)

This app implements a sample HelpDesk Password Reset tool. 

> The app has been tested on private cloud instance. Still needs to be verified on public cloud tenant.

![HelpDesk Password Reset](public/images/HelpDeskPasswordReset.png)

## Setup

* Get a management API token manually for testing - [Instructions here](https://auth0.com/docs/secure/tokens/access-tokens/management-api-access-tokens)

* Create a regular web application. Add the **Passwordless OTP** grant type to the application ([Reference](https://auth0.com/docs/authenticate/passwordless/implement-login/embedded-login/native)).

* Enable **email** Passwordless connection. Add the web application created to the connection.

* Ensure test user profile has the following attributes on the **user_metadata** section -

```
{
  "telephone": <Phone Number>,
  "address": "<Address data>"
}

```

*Note*: Telephone number should be numeric, not string

## Sample application

* Create a Glitch account if you already do not have one. 
  
* Remix the following app - https://glitch.com/edit/#!/hdauthotool

* Click on the **.env** file

* Add the following values to the **.env** file -

```
BASE_URL: https://<your auth0 tenant>
CLIENT_ID: <Client ID of the web application>
CLIENT_SECRET: <Client Secret of the web application>
CONNECTION: <Auth0 database Connection the user is in>
API_TOKEN: <management API token>

```

* Access the application through preview
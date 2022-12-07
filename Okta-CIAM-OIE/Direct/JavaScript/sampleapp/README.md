# Direct Authentication - JavaScript and HTML

This is a plain vanilla **JavaScript** and **HTML** implementation of direct authentication scenarios using **Okta Identity Engine** Pipeline.

The sample is for illustrative purpose to help navigate technical flow of Okta Identity Engine *authentication pipeline*. Not recommended for production use. For production, using high level frameworks such as *Angular*, *React*, *VueJS* along with server side *Node.js*, is recommended.

This sample app uses [Okta Auth JS](https://github.com/okta/okta-auth-js) library from CDN, and illustrates the following features:

1. **Login with password**
2. **Login with Email**
3. **Logout**
4. **Self-service registration**

### Configure Okta Application

* Create an Okta **OIDC** application with the following details:

```
Application type - Native
Grant type - Authorization Code, Interaction Code
Sign-in redirect URIs - http://localhost:3000/callback
Sign On Policy -> Catch-all Rule -> 
	User must authenticate with: Any 1 factor type
```

* Ensure `Interaction Code` is enabled in `default` authorization server access policy

```
From Okta Admin console, go to Security -> API -> Authorization Servers
Open the "default" server
Go to "Access Policies" tab
Edit the applicable "Rule"
Ensure "Interaction Code" is checked for "Grant type" 
```

* Change the [index.html]() to include application details:

```
var config = {
    issuer: 'https://<yourtenant>.okta[preview].com/oauth2/default',
    clientId: '<application client id>',
    redirectUri: 'http://localhost:3000/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    useInteractionCodeFlow: true
  };
```

* Ensure `Email authentication` is enabled

```
From Okta Admin console, go to Authenticators 
Edit "Actions" against the "Email" authenticator from the list
Ensure "Authentication and recovery" is checked
```


### Deploy Sample Application

Install [Node.js](https://nodejs.org/en/download/) on the system

Move to the App directory - `cd sampleapp`

Run - `npm install`

Run - `node app.js`

Access the application at - [http://localhost:3000](http://localhost:3000)
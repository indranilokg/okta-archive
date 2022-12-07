# Okta - Just-in-time Password Migration


You can leverage Okta's [Password Import Inline Hook](https://developer.okta.com/docs/concepts/inline-hooks/) feature to perform a just-in-time password migration. 

The **Password Import Inline Hook** enables migration of users from another data store in a case where you wish the users to retain their current passwords. 

The **Password Import Inline Hook** is triggered when the end user tries to sign in to **Okta** for the first time. **Okta** sends your external service the password that the user supplied. Your external service then needs to send a response to **Okta** indicating whether the password supplied by the end user is valid or not.

If the password is valid, **Okta** can authenticate the user independently from then on.

[Generic sample - NodeJS](Generic-Sample-NodeJS): Sample application leveraging a local file based user store
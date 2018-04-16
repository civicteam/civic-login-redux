## Civic Login Redux

A simple Redux Library that enables integration of Civic Login into a react front-end.

## Installation

run `npm install civic-login-redux --save`
## Usage
```bash
const LoginService = require('civic-login-redux');
const config = {
  civicSip: {
    // civicSip Options
  },
};
const loginService = new LoginService(config);
```
See [Civic Docs](https://docs.civic.com/#GettingStarted) for details on setting civicSip options.

Remember to include the civic.sip.js script on your page. This exposes a single global object, civic



## Available Methods
``` bash
// Login action to be dispatched from the main application
loginService.login() - This action displays the QR code iframe that can be scanned using the mobile app

// logout action to be dispached from the main application
loginService.logout() - Action to log out of the application

// login reducer function
loginService.reducer - This should be included in the list of reducers of the main application
Example code :
import { combineReducers } from 'redux';
combineReducers({
  loginService : loginService.reducer,
});

// Action to be defined in main application to process login request
loginService.apiProcessLogin(authToken)

loginService.apiProcessLogin = function(authToken) {
  return dispatch => fetch('LOGIN_URL', {headers}) // body should include the authtoken
    .then(handleErrors) // write how you want errors to be handled
    .then(response => response.json())
    .then(body => dispatch(apiLoginSuccess(body.sessionToken, loginService.appService.getExpiry())));
}


// Method to set token expirty date (to be defined in the application)
loginService.appExpiry.getExpiry()

// Action to be dispatched after apiProcessLogin is successful 
loginService.apiLoginSuccess(token, expires)  // expires is the value returned from loginService.appExpiry.getExpiry()
```


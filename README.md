## Civic Login Redux

A simple Redux Library that enables integration of Civic Login into a react front-end.

## Installation

run `npm i civic-login-redux --save-dev`
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

## Available Methods
``` bash
// Login action to be dispatched from the main application
loginService.login()

// logout action to be dispached from the main application
loginService.logout()

// login reducer function
loginService.reducer

// Action to be defined in main application to process login request
loginService.apiProcessLogin(authToken)

// Method to set token expirty date (to be defined in the application)
loginService.appExpiry.getExpiry()

// Action to be dispatched after apiProcessLogin is successful 
// expires is the value returned from loginService.appExpiry.getExpiry()
loginService.apiLoginSuccess(token, expires) 
```
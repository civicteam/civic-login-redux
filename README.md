## Civic Login Redux

A simple Redux Library that enables integration of Civic Login into a react front-end.

## Installation

npm i civic-login-redux --save-dev
## Usage

const LoginService = require('civic-login-redux');
const config = {
  civicSip: {
    // civicSip Options
  },
};
const loginService = new LoginService(config);

##Available Constructors

loginService.login() // Login action to be dispatched from the main application
loginService.logout() // logout action to be dispached from the main application
loginService.reducer  // login reducer function
loginService.processLogin() // Action to be defined in main application to process login request
loginService.apiLoginSuccess(token, expires) //Action to be dispatched upon successful processLogin
## Civic Login Redux

A simple Redux Library that enables integration of Civic Login into a react front-end.

## Installation

Run `npm install civic-login-redux --save`

## Usage

```javascript
const LoginService = require('civic-login-redux');
const config = {
  civicSip: {
    // civicSip parameters
    appId: '...',
  },
  keepAliveInterval: 60000 // optional
};
const loginService = new LoginService(config);
```

See [Civic Docs](https://docs.civic.com/#GettingStarted) for details on setting `civicSip` options.

Remember to include the `civic.sip.js` script on your page. This exposes a single global object `civic`.

## Available Methods

```javascript
// Login action to be dispatched from the main application
// This action displays the QR code iframe that can be scanned using the mobile app
loginService.login()

// logout action to be dispached from the main application
loginService.logout()

// Action to be dispatched after apiProcessLogin is successful
loginService.apiLoginSuccess(authToken)

// login reducer function
// This should be included in the list of reducers of the main application
loginService.reducer
```

## Sample code

```javascript
import { combineReducers } from 'redux';

combineReducers({
  loginService : loginService.reducer,
});

/**
 * Methods implemented in the main application
 */

// Example function that calls a back-end service which handles the auth token and generates a session token
loginService.apiProcessLogin = function(authToken) {
  return dispatch => fetch('LOGIN_URL', {headers, method: 'POST', body: JSON.stringify({authToken})})
    .then(response => response.json())
    .then(({sessionToken}) => dispatch(loginService.apiLoginSuccess(sessionToken)));
}

// Optional function to handle keep-alive sessions
// This will run on every `keepAliveInterval` milliseconds after the login is successful
// If the `keepAliveInterval` parameter is omitted from the `LoginService` config, this function will not be called 
loginService.keepAlive = function() {
  return dispatch => fetch('KEEP_ALIVE_URL', {headers})
    .then(response => response.json())
    .then(({sessionToken}) => dispatch(loginService.apiLoginSuccess(sessionToken)));
}
```


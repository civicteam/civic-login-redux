## Civic Login Redux

A simple Redux Library that enables integration of Civic Login into a react front-end.

## Installation

Run `npm install civic-login-redux --save`

Note: civic-login-redux includes the [redux-thunk](https://www.npmjs.com/package/redux-thunk) middleware.

## Usage

```javascript
const LoginService = require('civic-login-redux');
const config = {
  civicSip: {
    // civicSip parameters
    appId: '...',
  },
  apiProcessLogin: // function called when Civic login is complete (see below)
  keepAlive: // optional function used to refresh a session token (see below)
  keepAliveInterval: 60000 // optional token refresh time in ms
};
const loginService = new LoginService(config);
const loginReducer = loginService.reducer;  // include this in your redux root reducer
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
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import LoginService from 'civic-login-redux';

/**
 * Methods implemented in the main application
 */

// Example function that calls a back-end service which handles the auth token and generates a session token
const apiProcessLogin = function(authToken) {
  return dispatch => fetch('LOGIN_URL', {headers, method: 'POST', body: JSON.stringify({authToken})})
    .then(response => response.json())
    .then(({sessionToken}) => dispatch(loginService.apiLoginSuccess(sessionToken)));
}

// Optional function to handle keep-alive sessions
// This will run on every `keepAliveInterval` milliseconds after the login is successful
// If the `keepAliveInterval` parameter is omitted from the `LoginService` config, this function will not be called
const keepAlive = function() {
  return dispatch => fetch('KEEP_ALIVE_URL', {headers})
    .then(response => response.json())
    .then(({sessionToken}) => dispatch(loginService.apiLoginSuccess(sessionToken)));
}

const config = {
  civicSip: {
    // civicSip parameters
    appId: '...',
  },
  apiProcessLogin,
  keepAlive,
  keepAliveInterval: 60000 // optional
};
const loginService = new LoginService(config);

const rootReducer = combineReducers({
  login: loginService.reducer,
  // your app's other reducers
});

const store = createStore(
  rootReducer,
  {},
  applyMiddleware(thunk)
);
```

## KYC Customers

For Civic customers that are enabled for KYC, you have more options on the types of information you can request from your users.
The default is CivicBasic (available to everyone). To configure this, set the scopeRequest property on the config object.

e.g. for proof of age:

```
const config = {
  civicSip: {
    appId: '...',
    scopeRequest: LoginService.scopeRequests.PROOF_OF_AGE
  }
};
```

The choice of available scope requests is available at https://github.com/civicteam/civic-sip-js/blob/master/lib/scopeRequests.js

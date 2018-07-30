'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global civic */

var LoginService =
// Library Constructor initialized with civicSip configuration options
function LoginService(config) {
  var _this = this;

  _classCallCheck(this, LoginService);

  this.config = config;
  var civicSip = new civic.sip(config.civicSip); // eslint-disable-line new-cap
  var scopeRequest = config.scopeRequest || civicSip.ScopeRequests.BASIC_SIGNUP;

  var unimplementedFunctionPlaceholder = function unimplementedFunctionPlaceholder() {};

  this.apiProcessLogin = config.apiProcessLogin || unimplementedFunctionPlaceholder;
  this.keepAlive = config.keepAlive || unimplementedFunctionPlaceholder;

  // Actions
  var CIVIC_SIP_LOGIN = 'civic-login/CIVIC_SIP_LOGIN';
  var LOGIN_SUCCESS = 'civic-login/LOGIN_SUCCESS';
  var LOGIN_KEEP_ALIVE = 'civic-login/LOGIN_KEEP_ALIVE';
  var LOG_OUT = 'civic-login/LOG_OUT';
  var CIVIC_SIP_CANCELLED = 'civic-login/CIVIC_SIP_CANCELLED';
  var CIVIC_SIP_ADD_EVENT_LISTENERS = 'civic-login/CIVIC_SIP_ADD_EVENT_LISTENERS';
  var CIVIC_SIP_SUCCESS = 'civic-login/CIVIC_SIP_SUCCESS';
  var CIVIC_SIP_ERROR = 'civic-login/CIVIC_SIP_ERROR';

  this.actionType = {
    CIVIC_SIP_LOGIN: CIVIC_SIP_LOGIN,
    LOGIN_SUCCESS: LOGIN_SUCCESS,
    LOGIN_KEEP_ALIVE: LOGIN_KEEP_ALIVE,
    LOG_OUT: LOG_OUT,
    CIVIC_SIP_CANCELLED: CIVIC_SIP_CANCELLED,
    CIVIC_SIP_ADD_EVENT_LISTENERS: CIVIC_SIP_ADD_EVENT_LISTENERS,
    CIVIC_SIP_SUCCESS: CIVIC_SIP_SUCCESS,
    CIVIC_SIP_ERROR: CIVIC_SIP_ERROR
  };

  // Initial Login State
  var INITIAL_STATE = {
    session: {}
  };

  // Login Reducer
  this.reducer = function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
    var action = arguments[1];

    switch (action.type) {
      case CIVIC_SIP_LOGIN:
        return _extends({}, state, {
          apiBusy: true,
          apiError: ''
        });
      case LOGIN_SUCCESS:
      case CIVIC_SIP_CANCELLED:
        return _extends({}, state, {
          apiBusy: false,
          session: {
            token: action.sessionToken
          }
        });
      case LOG_OUT:
        return _extends({}, state, {
          session: undefined,
          apiError: '',
          apiBusy: false
        });
      default:
        return state;
    }
  };

  // CivicSip Event Listerners
  var addEventListeners = function addEventListeners(success, cancelled, error) {
    civicSip.removeAllListeners('auth-code-received');
    civicSip.removeAllListeners('user-cancelled');
    civicSip.removeAllListeners('civic-sip-error');
    civicSip.addEventListener('auth-code-received', function (e) {
      success(e.response);
    });
    civicSip.addEventListener('user-cancelled', function (e) {
      cancelled(e.response);
    });
    civicSip.addEventListener('civic-sip-error', function (e) {
      error(e);
    });
  };

  // CivicSip Login Function
  var civicSipLogin = function civicSipLogin() {
    return Promise.resolve(civicSip.signup({ scopeRequest: scopeRequest }));
  };

  // Action Creators

  var civicSipCancelled = function civicSipCancelled(dispatch) {
    return function (response) {
      return dispatch({
        type: CIVIC_SIP_CANCELLED,
        response: response
      });
    };
  };

  this.apiLoginSuccess = function (sessionToken) {
    return function (dispatch) {
      dispatch({
        type: LOGIN_SUCCESS,
        sessionToken: sessionToken
      });
    };
  };

  var civicSipSuccess = function civicSipSuccess(dispatch) {
    return function (authToken) {
      var dispatchIfExists = function dispatchIfExists(action) {
        return action && dispatch(action);
      };

      dispatch({
        type: CIVIC_SIP_SUCCESS,
        authToken: authToken
      });
      dispatchIfExists(_this.apiProcessLogin(authToken));

      clearInterval(_this.keepAliveIntervalID);

      if (_this.config.keepAliveInterval) {
        _this.keepAliveIntervalID = setInterval(function () {
          dispatch({ type: LOGIN_KEEP_ALIVE });
          dispatchIfExists(_this.keepAlive());
        }, _this.config.keepAliveInterval);
      }
    };
  };

  var civicSipError = function civicSipError(dispatch) {
    return function (error) {
      return dispatch({
        type: CIVIC_SIP_ERROR,
        error: error
      });
    };
  };

  // Login Action creator
  this.login = function () {
    return function (dispatch) {
      dispatch({
        type: CIVIC_SIP_ADD_EVENT_LISTENERS
      });
      addEventListeners(civicSipSuccess(dispatch), civicSipCancelled(dispatch), civicSipError(dispatch));
      dispatch({
        type: CIVIC_SIP_LOGIN
      });
      return civicSipLogin();
    };
  };

  // Logout Action creator
  this.logout = function () {
    return function (dispatch) {
      dispatch({
        type: LOG_OUT
      });
    };
  };
};

// mirror the scopeRequests map from civicSip so that
// clients can choose the type of scope request they wish to use
// Note - civic-sip requires an appId, so add a dummy value here
// eslint-disable-next-line new-cap


LoginService.scopeRequests = new civic.sip({
  appId: 'dummy'
}).ScopeRequests;

module.exports = LoginService;

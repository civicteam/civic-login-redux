import config from './config';
import { handleErrors } from './common';

const options = {
  stage: config.stage,
  ...config.civicSip,
};

const LOGIN_URL = `${config.endpoint}/login`;

// civic is imported in index.html
const civicSip = new civic.sip(options); // eslint-disable-line no-undef, new-cap

// TODO
const sessionService = {
  getExpiry: () => {},
};

// Actions
const MAIN_REFRESH = 'civic-login/login/MAIN_REFRESH';
const CIVIC_SIP_LOGIN = 'civic-login/login/CIVIC_SIP_LOGIN';
const SESSION_SUCCESS = 'civic-login/login/SESSION_SUCCESS';
const LOGIN_SUCCESS = 'civic-login/login/LOGIN_SUCCESS';
const LOG_OUT = 'civic-login/login/LOG_OUT';
const CIVIC_SIP_CANCELLED = 'civic-login/login/CIVIC_SIP_CANCELLED';
const CIVIC_SIP_ADD_EVENT_LISTENERS = 'civic-login/login/CIVIC_SIP_ADD_EVENT_LISTENERS';

const INITIAL_STATE = {
  session: {},
};

// exportable events
export { LOGIN_SUCCESS };

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case MAIN_REFRESH:
    case CIVIC_SIP_LOGIN:
      return {
        ...state,
        apiBusy: true,
        apiError: '',
      };
    case CIVIC_SIP_CANCELLED:
    case LOGIN_SUCCESS:
    case SESSION_SUCCESS:
      return {
        ...state,
        apiBusy: false,
        session: {
          token: action.sessionToken,
          expires: action.expires,
        },
      };
    case LOG_OUT:
      return {
        ...state,
        session: undefined,
        apiError: '',
        apiBusy: false,
      };
    default:
      return state;
  }
}

const addEventListeners = (success, cancelled, error) => {
  civicSip.removeAllListeners('auth-code-received');
  civicSip.removeAllListeners('user-cancelled');
  civicSip.removeAllListeners('civic-sip-error');

  civicSip.addEventListener('auth-code-received', (e) => {
    success(e.response);
  });
  civicSip.addEventListener('user-cancelled', (e) => {
    cancelled(e.response);
  });
  civicSip.addEventListener('civic-sip-error', (e) => {
    error(e);
  });
};

const civicSipCancelled = dispatch => response => dispatch({
  type: CIVIC_SIP_CANCELLED,
  response,
});

const civicSipLogin = () => Promise.resolve(civicSip.signup({ scopeRequest: civicSip.ScopeRequests.BASIC_SIGNUP }));

const CIVIC_SIP_SUCCESS = 'CIVIC_SIP_SUCCESS';

const apiLoginSuccess = (sessionToken, expires) => (dispatch) => {
  dispatch({
    type: LOGIN_SUCCESS,
    sessionToken,
    expires,
  });
};

export function sessionLogin(authToken) {
  return dispatch => fetch(LOGIN_URL, {
    body: JSON.stringify({ authToken }),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    mode: 'cors',
  }).then(handleErrors)
    .then(response => response.json())
    .then(body => dispatch(apiLoginSuccess(body.sessionToken, sessionService.getExpiry())));
}

const civicSipSuccess = dispatch => (authToken) => {
  dispatch({
    type: CIVIC_SIP_SUCCESS,
    authToken,
  });
  dispatch(sessionLogin(authToken));
};

const CIVIC_SIP_ERROR = 'CIVIC_SIP_ERROR';

// Action creators
const civicSipError = dispatch => error => dispatch({
  type: CIVIC_SIP_ERROR,
  error,
});

export const login = () => (dispatch) => {
  dispatch({
    type: CIVIC_SIP_ADD_EVENT_LISTENERS,
  });
  addEventListeners(civicSipSuccess(dispatch), civicSipCancelled(dispatch), civicSipError(dispatch));
  dispatch({
    type: CIVIC_SIP_LOGIN,
  });
  return civicSipLogin();
};

export const logout = () => (dispatch) => {
  dispatch({
    type: LOG_OUT,
  });
};


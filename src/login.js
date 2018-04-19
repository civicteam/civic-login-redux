class LoginService {
  // Library Constructor initialized with civicSip configuration options
  constructor(config) {
    this.config = config;
    const civicSip = new civic.sip(this.config.civicSip); // eslint-disable-line no-undef, new-cap

    // Actions
    const CIVIC_SIP_LOGIN = 'civic-login/CIVIC_SIP_LOGIN';
    const LOGIN_SUCCESS = 'civic-login/LOGIN_SUCCESS';
    const LOG_OUT = 'civic-login/LOG_OUT';
    const CIVIC_SIP_CANCELLED = 'civic-login/CIVIC_SIP_CANCELLED';
    const CIVIC_SIP_ADD_EVENT_LISTENERS = 'civic-login/CIVIC_SIP_ADD_EVENT_LISTENERS';
    const CIVIC_SIP_SUCCESS = 'civic-login/CIVIC_SIP_SUCCESS';
    const CIVIC_SIP_ERROR = 'civic-login/CIVIC_SIP_ERROR';

    // Initial Login State
    const INITIAL_STATE = {
      session: {},
    };

    // Login Reducer
    this.reducer = (state = INITIAL_STATE, action) => {
      switch (action.type) {
        case CIVIC_SIP_LOGIN:
          return {
            ...state,
            apiBusy: true,
            apiError: '',
          };
        case LOGIN_SUCCESS:
        case CIVIC_SIP_CANCELLED:
          return {
            ...state,
            apiBusy: false,
            session: {
              token: action.sessionToken,
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
    };

    // CivicSip Event Listerners
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

    // CivicSip Login Function
    const civicSipLogin = () => Promise.resolve(civicSip.signup({ scopeRequest: civicSip.ScopeRequests.BASIC_SIGNUP }));

    // Action Creators

    const civicSipCancelled = dispatch => response => dispatch({
      type: CIVIC_SIP_CANCELLED,
      response,
    });

    this.apiLoginSuccess = sessionToken => (dispatch) => {
      dispatch({
        type: LOGIN_SUCCESS,
        sessionToken,
      });
    };

    this.apiProcessLogin = function apiProcessLogin() {
    };

    const civicSipSuccess = dispatch => (authToken) => {
      dispatch({
        type: CIVIC_SIP_SUCCESS,
        authToken,
      });
      dispatch(this.apiProcessLogin(authToken));
    };

    const civicSipError = dispatch => error => dispatch({
      type: CIVIC_SIP_ERROR,
      error,
    });

    // Login Action creator
    this.login = () => (dispatch) => {
      dispatch({
        type: CIVIC_SIP_ADD_EVENT_LISTENERS,
      });
      addEventListeners(civicSipSuccess(dispatch), civicSipCancelled(dispatch), civicSipError(dispatch));
      dispatch({
        type: CIVIC_SIP_LOGIN,
      });
      return civicSipLogin();
    };

    // Logout Action creator
    this.logout = () => (dispatch) => {
      dispatch({
        type: LOG_OUT,
      });
    };
  }
}

module.exports = LoginService;

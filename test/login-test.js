/* eslint no-unused-expressions:  */
/* global civic */

const LoginService = require('../src/login');
const { expect } = require('chai');
const thunk = require('redux-thunk').default;
const sinon = require('sinon');

const { registerMiddlewares, registerInitialStoreState } = require('redux-actions-assertions');
const { registerAssertions } = require('redux-actions-assertions/chai');

const config = {
  civicSip: {
    stage: '',
    appId: '',
    api: '',
  },
  keepAliveInterval: null,
};

describe('The Login Service class', () => {
  it('should expose the scopeRequests from civicSip', () => {
    // eslint-disable-next-line new-cap
    expect(LoginService.scopeRequests).to.equal((new civic.sip()).ScopeRequests);
  });
});

describe('Configuring the Login Service', () => {
  it('should pass the apiProcessLogin function from the configuration', () => {
    const apiProcessLogin = () => {};

    const configPlusApiProcessLogin = {
      ...config,
      apiProcessLogin,
    };

    const loginService = new LoginService(configPlusApiProcessLogin);

    expect(loginService.apiProcessLogin).to.equal(apiProcessLogin);
  });

  it('should pass the keepAlive function from the configuration', () => {
    const keepAlive = () => {};

    const configPlusKeepAlive = {
      ...config,
      keepAlive,
    };

    const loginService = new LoginService(configPlusKeepAlive);

    expect(loginService.keepAlive).to.equal(keepAlive);
  });

  it('should allow you to configure the scope request type', () => {
    const proofOfAge = 'proofOfAge';
    // eslint-disable-next-line new-cap
    const signupSpy = (new civic.sip()).signup;
    const dummyDispatch = () => {};

    const configPlusScopeRequest = {
      ...config,
      scopeRequest: proofOfAge,
    };

    const loginService = new LoginService(configPlusScopeRequest);

    loginService.login()(dummyDispatch);

    expect(signupSpy.calledWith({ scopeRequest: proofOfAge })).to.equal(true);
  });
});

const loginService = new LoginService(config);
const {
  CIVIC_SIP_LOGIN,
  LOGIN_SUCCESS,
  LOG_OUT,
  CIVIC_SIP_SUCCESS,
  CIVIC_SIP_CANCELLED,
  CIVIC_SIP_ADD_EVENT_LISTENERS,
  LOGIN_KEEP_ALIVE,
} = loginService.actionType;

function callLoginEventListenerWithSuccessEvent() {
  // the addEventListener in civic.sip is a stub - (see init-test.js).
  // after calling login, event listeners are added we can retrieve the event listener that was sent
  // to this stub and call it.
  const eventListener = civic.sip.prototype.addEventListener.withArgs('auth-code-received').getCall(0).args[1];
  const successEvent = { response: 'some token' };
  eventListener(successEvent);
  return successEvent;
}

function resetSipEventListeners() {
  civic.sip.prototype.addEventListener.resetHistory();
}

describe('The Login Service', () => {
  registerInitialStoreState({ login: loginService.reducer });
  registerMiddlewares([thunk]);
  registerAssertions();

  beforeEach(resetSipEventListeners);
  beforeEach(() => {
    loginService.keepAliveIntervalID = undefined;
  });

  it('should dispatch login action', (done) => {
    expect(loginService.login()).to.dispatch.actions([{ type: CIVIC_SIP_ADD_EVENT_LISTENERS }], done);
  });

  it('should dispatch civic sip login action', (done) => {
    expect(loginService.login()).to.dispatch.actions([{ type: CIVIC_SIP_LOGIN }], done);
  });

  it('should dispatch login success action', (done) => {
    expect(loginService.apiLoginSuccess()).to.dispatch.actions([{ type: LOGIN_SUCCESS }], done);
  });

  it('should dispatch logout action', (done) => {
    expect(loginService.logout()).to.dispatch.actions([{ type: LOG_OUT }], done);
  });

  it('should support an apiProcessLogin function', () => {
    expect(() => loginService.apiProcessLogin()).to.not.throw();
  });

  it('should support a keepAlive function', () => {
    expect(() => loginService.keepAlive()).to.not.throw();
  });

  it('should dispatch a civic sip success', () => {
    const stubDispatch = sinon.stub();

    // login registers an event callback triggered when civic sends a successful login response
    loginService.login()(stubDispatch);

    // artificially call the login success event callback
    const successEvent = callLoginEventListenerWithSuccessEvent();

    // verify the action was dispatched by the event callback
    expect(stubDispatch.withArgs({ type: CIVIC_SIP_SUCCESS, authToken: successEvent.response }).calledOnce).to.be.true;
  });

  it('should start a keepAlive process if an interval is set', () => {
    // configure civic-login-redux to keepalive every second
    config.keepAliveInterval = 1000;

    const stubDispatch = sinon.stub();

    // login registers an event callback triggered when civic sends a successful login response
    loginService.login()(stubDispatch);

    // verify there is not yet a keepalive process
    expect(loginService.keepAliveIntervalID).to.be.undefined;

    // artificially call the login success event callback, that starts a keepalive process
    callLoginEventListenerWithSuccessEvent();

    // stop the regular keep alive process that has just been created, from being triggered
    clearInterval(loginService.keepAliveIntervalID);

    // verify a keepalive process was created
    expect(loginService.keepAliveIntervalID).not.to.be.undefined;
  });

  it('should start dispatching keepAlive events if an interval is set', (done) => {
    // configure civic-login-redux to keepalive every millisecond
    config.keepAliveInterval = 1;

    const stubDispatch = sinon.stub();

    // login registers an event callback triggered when civic sends a successful login response
    loginService.login()(stubDispatch);

    // verify there is not yet a keepalive process
    expect(loginService.keepAliveIntervalID).to.be.undefined;

    // artificially call the login success event callback, that starts a keepalive process
    callLoginEventListenerWithSuccessEvent();

    // do the rest of this test after waiting 5 milliseconds
    setTimeout(() => {
      // stop the regular keep alive process that has just been created, from being triggered
      clearInterval(loginService.keepAliveIntervalID);

      // verify at least one keepalive event was sent
      expect(stubDispatch.withArgs({ type: LOGIN_KEEP_ALIVE }).called).to.be.true;
      done();
    }, 5);
  });
});

describe('Login Service Reducer', () => {
  const { reducer } = new LoginService(config);

  const initialState = {
    session: {},
  };

  const stateAfterLogout = reducer(initialState, {
    type: LOG_OUT,
  });
  const stateAfterCivicSipLogin = reducer(initialState, {
    type: CIVIC_SIP_LOGIN,
  });

  const stateAfterLoginSuccess = reducer(initialState, {
    type: LOGIN_SUCCESS,
    sessionToken: 'myNewToken',
  });

  const stateAfterCivicSipCancelled = reducer(initialState, {
    type: CIVIC_SIP_CANCELLED,
    sessionToken: 'mySuccessNewToken',
  });

  const stateAfterRandomAction = reducer(initialState, {
    type: 'random type',
    sessionToken: 'mySuccessNewToken',
  });


  it('should change state when passed specific actions', () => {
    expect(stateAfterLogout.session).to.be.undefined;
    expect(stateAfterLogout).to.deep.equal({ session: undefined, apiError: '', apiBusy: false });
    expect(stateAfterCivicSipLogin).to.deep.equal({ apiBusy: true, apiError: '', session: {} });
    expect(stateAfterLoginSuccess).to.deep.equal({ apiBusy: false, session: { token: 'myNewToken' } });
    expect(stateAfterCivicSipCancelled).to.deep.equal({ apiBusy: false, session: { token: 'mySuccessNewToken' } });
    expect(stateAfterRandomAction).to.deep.equal({ session: {} });
  });
});


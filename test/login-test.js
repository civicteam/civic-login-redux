/* eslint no-unused-expressions:  */
const LoginService = require('../src/login');
const { expect } = require('chai');
const thunk = require('redux-thunk').default;

const { registerMiddlewares, registerInitialStoreState } = require('redux-actions-assertions');
const { registerAssertions } = require('redux-actions-assertions/chai');

const CIVIC_SIP_LOGIN = 'civic-login/CIVIC_SIP_LOGIN';
const LOGIN_SUCCESS = 'civic-login/LOGIN_SUCCESS';
const LOG_OUT = 'civic-login/LOG_OUT';
const CIVIC_SIP_CANCELLED = 'civic-login/CIVIC_SIP_CANCELLED';
const CIVIC_SIP_ADD_EVENT_LISTENERS = 'civic-login/CIVIC_SIP_ADD_EVENT_LISTENERS';

const config = {
  civicSip: {
    stage: '',
    appId: '',
    api: '',
  },
};
const loginService = new LoginService(config);
registerInitialStoreState({ login: loginService.reducer });
registerMiddlewares([thunk]);
registerAssertions();

describe('Login Service actions', () => {
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
});

const { reducer } = loginService;

describe('Login Service Reducer', () => {
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


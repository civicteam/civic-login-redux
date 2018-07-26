// Define CivicSip and Create Stubs for civicSip methods
const sinon = require('sinon');

function sip() {
}

sip.prototype.addEventListener = sinon.stub();
sip.prototype.removeAllListeners = sinon.spy();
sip.prototype.signup = sinon.spy();
sip.prototype.ScopeRequests = sinon.spy();

global.civic = {
  sip,
};


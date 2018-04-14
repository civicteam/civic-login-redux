// console.log('whatever whatever');
const sinon = require('sinon');

function sip() {
}

function dispatch() {
}

sip.prototype.addEventListener = sinon.stub().returns(sinon.spy());
sip.prototype.removeAllListeners = sinon.spy();
sip.prototype.signup = sinon.spy();
sip.prototype.ScopeRequests = sinon.spy();

dispatch.prototype = sinon.spy();

global.civic = {
  sip,
};

global.dispatch = () => {
};


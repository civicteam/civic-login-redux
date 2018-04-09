/**
 * 'Ducks' module for Temp
 */

import config from './config';
import { handleErrors, headers } from './common';

// Actions
const UPDATE = 'marketplace-monitor/payments/UPDATE';

// Other constants
// Source of the payment information
const PAYMENTS_URL = `${config.endpoint}/payments`;

const paymentUrl = id => `${PAYMENTS_URL}/${id}`;

const INITIAL_STATE = [];

// Reducer
export default function reducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case UPDATE:
      return action.payload;
    default:
      return state;
  }
}

// Action Creators
export function updatePayments(payments) {
  return {
    type: UPDATE,
    payload: payments,
  };
}

// side-effects

export function loadPayments() {
  return (dispatch) => {
    console.log('Loading Payments');
    return fetch(PAYMENTS_URL, { headers: headers() })
      .then(handleErrors)
      .then(response => response.json())
      .then(body => dispatch(updatePayments(body)));
  };
}

export function removeEntry(payment) {
  return dispatch => fetch(paymentUrl(payment.scopeRequestId), { method: 'DELETE', headers: headers() })
    .then(handleErrors)
    .then(() => dispatch(loadPayments()));
}

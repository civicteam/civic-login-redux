import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import rootReducer from '../src';

// history allows us to manipulate the browser location history - necessary for react-router
export const history = createHistory();

const initialState = {};
const enhancers = [];
const middleware = [
  thunk, // to allow asynchronous actions
  routerMiddleware(history), // integrate history with react-router
];

// enables interaction with http://extension.remotedev.io/
if (process.env.NODE_ENV === 'development') {
  const { devToolsExtension } = window;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

// combine the enhancers and middleware
const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

// generate a store from the enhancers, middleware, initial state and rootReducer (combined from all reducers in the services folder)
export default createStore(rootReducer, initialState, composedEnhancers);

import store from './store';

export function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}


export function headers() {
  const headers = {};

  const token = store.getState().login ? store.getState().login.session.token : null;

  if (token) {
    headers.Authorization = token;
  }

  return headers;
}

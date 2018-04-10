

module.exports = function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

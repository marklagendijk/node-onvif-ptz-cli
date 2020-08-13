const _ = require("lodash");

module.exports = {
  getProfileToken,
  getData,
};

function getProfileToken(device) {
  return device.getCurrentProfile().token;
}

function getData(path) {
  return (response) => (path ? _.get(response.data, path) : response.data);
}

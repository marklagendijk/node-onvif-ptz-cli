import _ from "lodash";

export function getProfileToken(device) {
  return device.getCurrentProfile().token;
}

export function getData(path) {
  return (response) => (path ? _.get(response.data, path) : response.data);
}

import onvif from "node-onvif";

export async function createDevice({ baseUrl, path, username, password }) {
  const device = new onvif.OnvifDevice({
    xaddr: baseUrl + path,
    user: username,
    pass: password,
  });
  await device.init();

  return device;
}

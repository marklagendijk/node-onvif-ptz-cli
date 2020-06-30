const onvif = require('node-onvif');

module.exports = {
    createDevice
};

async function createDevice({ baseUrl, path, username, password}){
    const device = new onvif.OnvifDevice({
        xaddr: baseUrl + path,
        user: username,
        pass: password
    });
    await device.init();

    return device;    
}
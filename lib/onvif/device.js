const onvif = require('node-onvif');

module.exports = {
    createDevice
};

async function createDevice({ host, port, path, username, password}){
    port = port || 80;
    path = path || '/onvif/device_service';
    const device = new onvif.OnvifDevice({
        xaddr: `http://${host}:${port}${path}`,
        user: username,
        pass: password
    });
    await device.init();

    return device;    
}
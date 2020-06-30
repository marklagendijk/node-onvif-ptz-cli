const { getData, getProfileToken } = require('./utils');

module.exports = {
    getPresets,
    setPreset,
    gotoPreset,
    gotoHomePosition,
    relativeMove
};

function getPresets(device) {
    return device.services.ptz.getPresets({
        ProfileToken: getProfileToken(device)
    }).then(getData('GetPresetsResponse.Preset'));
}

function setPreset(device, { preset, name }) {
    return device.services.ptz.setPreset({
        ProfileToken: getProfileToken(device),
        PresetToken: preset.toString(),
        PresetName: name
    }).then(getData);
}

function gotoPreset(device, { preset }) {
    return device.services.ptz.gotoPreset({
        ProfileToken: getProfileToken(device),
        PresetToken: preset.toString()
    }).then(getData);
}

function gotoHomePosition(device) {
    return device.services.ptz.gotoHomePosition({
        ProfileToken: getProfileToken(device),
        Speed: 1
    }).then(getData);
}

function relativeMove(device, { movementX, movementY, movementZ, speedX, speedZ, speedY }) {
    return device.services.ptz.relativeMove({
        ProfileToken: getProfileToken(device),
        Translation: {
            x: movementX,
            y: movementY,
            z: movementZ
        },
        Speed: {
            x: speedX,
            y: speedY,
            z: speedZ
        }
    }).then(getData);
}
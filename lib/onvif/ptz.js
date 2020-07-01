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
        PresetToken: preset
    }).then(getData);
}

function gotoHomePosition(device) {
    return device.services.ptz.gotoHomePosition({
        ProfileToken: getProfileToken(device),
        Speed: 1
    }).then(getData);
}

function relativeMove(device, movement, speed) {
    return device.services.ptz.relativeMove({
        ProfileToken: getProfileToken(device),
        Translation: {
            x: movement.x,
            y: movement.y,
            z: movement.z
        },
        Speed: {
            x: speed.x,
            y: speed.y,
            z: speed.z
        }
    }).then(getData);
}
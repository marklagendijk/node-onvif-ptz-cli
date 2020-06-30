#! /usr/bin/env node
const _ = require('lodash');
const { createDevice } = require('../lib/onvif/device');
const ptz = require('../lib/onvif/ptz');

const argv = require('yargs')
    .scriptName('')
    .usage('Usage: onvif-ptz <command>')
    .options({
        baseUrl: {
            describe: 'The baseUrl of the camera.',
            demandOption: true,
            type: 'string',
        },
        path: {
            describe: 'The onvif path of the camera.',
            type: 'string',
            default: '/onvif/device_service'
        },
        username: {
            alias: 'u',
            describe: 'The username of the camera.',
            demandOption: true,
            type: 'string'
        },
        password: {
            alias: 'p',
            describe: 'The password of the camera.',
            demandOption: true,
            type: 'string'
        }
    })
    .command('goto-preset', 'Load a preset.', {
        preset: {
            describe: 'The preset which should be loaded.',
            demandOption: true,
            type: 'string'
        }
    })
    .example(
        'onvif-ptz goto-preset --baseUrl=http://192.168.0.123 -u=admin -p=admin --preset=1',
        'Load preset "1".'
    )
    .example(
        'onvif-ptz goto-preset --baseUrl=http://192.168.0.123:8080 -u=admin -p=admin --preset=1',
        'Load preset "1" on a camera that uses port 8080 as onvif port.'
    )
    .demandCommand()
    .env('ONVIF')
    .wrap(null)
    .argv;


(async () => {
    try {
        const command = argv._[0];
        const device = await createDevice({
            baseUrl: argv.baseUrl,
            path: argv.path,
            username: argv.username,
            password: argv.password
        })
        switch (command) {
            case 'goto-preset':
                await ptz.gotoPreset(device, {
                    preset: argv.preset
                });
                break;
            case 'goto-home':
                await ptz.gotoHomePosition(device);
                break;
            case 'relative-move':
                ptz.relativeMove(device, {
                    movementX: argv.movementX,
                    movementY: argv.movementY,
                    movementZ: argv.movementZ,
                    speedX: argv.speedX,
                    speedY: argv.speedY,
                    speed: argv.speedZ,
                });
                break;
            case 'get-presets':
                const presets = await ptz.getPresets(device);
                console.log(presets);
                break;
            case 'set-preset':
                await ptz.setPreset(device, {
                    preset: argv.preset,
                    name: argv.name
                });
                break;
        }
    }
    catch (e) {
        console.error(e);
    }
})();



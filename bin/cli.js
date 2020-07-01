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
    .command('goto-preset', 'Move the camera to a preset.', {
        preset: {
            describe: 'The preset which should be loaded.',
            demandOption: true,
            type: 'string'
        }
    })
    .command('goto-home', 'Move the camera to the home position.')
    .command('move', 'Move relatively to the current camera position.', {
        x: {
            describe: 'Movement on the x-axis. Left: between -1 and 0. Right: between 0 and 1. Optionally add \':NUMBER\' for speed (between 0 and 1).',
            type: 'string',
            default: '0'
        },
        y: {
            describe: 'Movement on the y-axis. Down: between -1 and 0. Up: between 0 and 1. Optionally add \':NUMBER\' for speed (between 0 and 1).',
            type: 'string',
            default: '0'
        },
        z: {
            describe: 'Movement on the z-axis (zoom). Zoom out: between -1 and 0. Zoom in: between 0 and 1. Optionally add \':NUMBER\' for speed (between 0 and 1).',
            type: 'string',
            default: '0'
        }
    })
    .command('get-presets', 'List all camera presets. Note: for some cameras the ONVIF presets are separate from the normal presets. If that is the case, you may have to re-create your presets using the set-preset command.')
    .command('set-preset', 'Store the current location/settings in a preset.', {
        preset: {
            describe: 'The token of the preset. Usually just a number.',
            demandOption: true,
            type: 'string'
        },
        name: {
            describe: 'The name of the preset.',
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
    .example(
        'onvif-ptz goto-home --baseUrl=http://192.168.0.123 -u=admin -p=admin',
        'Move the camera to the home position.'
    )
    .example(
        'onvif-ptz move --baseUrl=http://192.168.0.123:8080 -u=admin -p=admin -x=0.01',
        'Move the camera 0.01 to the right.'
    )
    .example(
        'onvif-ptz move --baseUrl=http://192.168.0.123:8080 -u=admin -p=admin -x=0.01:0.5',
        'Move the camera 0.01 to the right with half speed.'
    )
    .example(
        'onvif-ptz move --baseUrl=http://192.168.0.123:8080 -u=admin -p=admin -x=0.01 -y=0.02 -z=0.03',
        'Move the camera 0.01 to the right, 0.02 to the top and zoom in 0.03.'
    )
    .example(
        'onvif-ptz get-presets --baseUrl=http://192.168.0.123 -u=admin -p=admin',
        'List all camera presets.'
    )
    .example(
        'onvif-ptz set-preset --baseUrl=http://192.168.0.123 -u=admin -p=admin --preset=1 --name=Overview',
        'Create a preset with preset token 1 and name Overview.'
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
            case 'move':
                const x = argv.x.split(':');
                const y = argv.y.split(':');
                const z = argv.z.split(':');
                await ptz.relativeMove(device, {
                    movement: {
                        x: x[0],
                        y: y[0],
                        z: z[0],
                    },
                    speed: {
                        x: x[1] || 1,
                        y: y[1] || 1,
                        z: z[1] || 1
                    }
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


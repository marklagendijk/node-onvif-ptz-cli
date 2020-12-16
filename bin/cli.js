#! /usr/bin/env node
const _ = require("lodash");
const fs = require("fs");
const { createDevice } = require("../lib/onvif/device");
const ptz = require("../lib/onvif/ptz");
const { printTable } = require("../lib/table");

const argv = require("yargs")
  .scriptName("")
  .usage("Usage: onvif-ptz <command>")
  .options({
    baseUrl: {
      describe: "The baseUrl of the camera.",
      demandOption: true,
      type: "string",
    },
    path: {
      describe: "The onvif path of the camera.",
      type: "string",
      default: "/onvif/device_service",
    },
    username: {
      alias: "u",
      describe: "The username of the camera.",
      demandOption: true,
      type: "string",
    },
    password: {
      alias: "p",
      describe: "The password of the camera.",
      demandOption: true,
      type: "string",
    },
  })
  .command("goto-preset", "Move the camera to a preset.", {
    preset: {
      describe: "The preset which should be loaded.",
      demandOption: true,
      type: "string",
    },
  })
  .command("goto-home", "Move the camera to the home position.")
  .command("move", "Move relatively to the current camera position.", {
    x: {
      describe:
        "Movement on the x-axis. Left: between -1 and 0. Right: between 0 and 1. Optionally add ':NUMBER' for speed (between 0 and 1).",
      type: "string",
      default: "0",
    },
    y: {
      describe:
        "Movement on the y-axis. Down: between -1 and 0. Up: between 0 and 1. Optionally add ':NUMBER' for speed (between 0 and 1).",
      type: "string",
      default: "0",
    },
    z: {
      describe:
        "Movement on the z-axis (zoom). Zoom out: between -1 and 0. Zoom in: between 0 and 1. Optionally add ':NUMBER' for speed (between 0 and 1).",
      type: "string",
      default: "0",
    },
  })
  .command(
    "get-presets",
    "List all camera presets. Note: for some cameras the ONVIF presets are separate from the normal presets. If that is the case, you may have to re-create your presets using the set-preset command."
  )
  .command("set-preset", "Store the current location/settings in a preset.", {
    preset: {
      describe: "The token of the preset. Usually just a number.",
      demandOption: true,
      type: "string",
    },
    name: {
      describe: "The name of the preset.",
      type: "string",
    },
  })
  .command("fetch-snapshot", "Fetch a snapshot and safe it to disk.", {
    file: {
      describe: "The output path for the snapshot jpg file.",
      default: "snapshot.jpg",
      type: "string",
    },
    name: {
      describe: "The name of the preset.",
      type: "string",
    },
  })
  .example(
    "onvif-ptz goto-preset --baseUrl=http://192.168.0.123 -u=admin -p=admin --preset=1",
    'Load preset "1".'
  )
  .example(
    "onvif-ptz goto-preset --baseUrl=http://192.168.0.123:8080 -u=admin -p=admin --preset=1",
    'Load preset "1" on a camera that uses port 8080 as onvif port.'
  )
  .example(
    "onvif-ptz goto-home --baseUrl=http://192.168.0.123 -u=admin -p=admin",
    "Move the camera to the home position."
  )
  .example(
    "onvif-ptz move --baseUrl=http://192.168.0.123:8080 -u=admin -p=admin -x=0.01",
    "Move the camera 0.01 to the right."
  )
  .example(
    "onvif-ptz move --baseUrl=http://192.168.0.123:8080 -u=admin -p=admin -x=0.01:0.5",
    "Move the camera 0.01 to the right with half speed."
  )
  .example(
    "onvif-ptz move --baseUrl=http://192.168.0.123:8080 -u=admin -p=admin -x=0.01 -y=0.02 -z=0.03",
    "Move the camera 0.01 to the right, 0.02 to the top and zoom in 0.03."
  )
  .example(
    "onvif-ptz get-presets --baseUrl=http://192.168.0.123 -u=admin -p=admin",
    "List all camera presets."
  )
  .example(
    "onvif-ptz set-preset --baseUrl=http://192.168.0.123 -u=admin -p=admin --preset=1 --name=Overview",
    "Create a preset with preset token 1 and name Overview."
  )
  .demandCommand()
  .env("ONVIF")
  .wrap(null).argv;

(async () => {
  try {
    const command = argv._[0];
    const device = await createDevice({
      baseUrl: argv.baseUrl,
      path: argv.path,
      username: argv.username,
      password: argv.password,
    });
    switch (command) {
      case "goto-preset":
        await gotoPresetCommand(device, argv);
        break;
      case "goto-home":
        await gotoHomePositionCommand(device);
        break;
      case "move":
        await moveCommand(device, argv);
        break;
      case "get-presets":
        await getPresetsCommand(device);
        break;
      case "set-preset":
        await setPresetCommand(device, argv);
        break;
      case "fetch-snapshot":
        await fetchSnapshotCommand(device, argv);
        break;
    }
  } catch (e) {
    console.error(e);
  }
})();

async function gotoPresetCommand(device, argv) {
  await ptz.gotoPreset(device, {
    preset: argv.preset,
  });
}

async function gotoHomePositionCommand(device) {
  await ptz.gotoHomePosition(device);
}

async function moveCommand(device, argv) {
  const x = argv.x.split(":");
  const y = argv.y.split(":");
  const z = argv.z.split(":");
  await ptz.relativeMove(device, {
    movement: {
      x: parseFloat(x[0]),
      y: parseFloat(y[0]),
      z: parseFloat(z[0]),
    },
    speed: {
      x: parseFloat(x[1] || 1),
      y: parseFloat(y[1] || 1),
      z: parseFloat(z[1] || 1),
    },
  });
}

async function getPresetsCommand(device) {
  const presets = (await ptz.getPresets(device)).map((item) => ({
    token: _.get(item, "$.token"),
    name: item.Name,
    x: _.get(item, "PTZPosition.PanTilt.$.x"),
    y: _.get(item, "PTZPosition.PanTilt.$.y"),
    z: _.get(item, "PTZPosition.Zoom.$.x"),
  }));
  printTable(presets);
}

async function setPresetCommand(device, argv) {
  await ptz.setPreset(device, {
    preset: argv.preset,
    name: argv.name,
  });
}

async function fetchSnapshotCommand(device, argv) {
  const result = await device.fetchSnapshot();
  fs.writeFileSync(argv.file, result.body, { encoding: "binary" });
}

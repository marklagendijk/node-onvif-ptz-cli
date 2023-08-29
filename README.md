# node-onvif-ptz-cli [![GitHub license](https://img.shields.io/github/license/marklagendijk/node-onvif-ptz-cli)](https://github.com/marklagendijk/node-onvif-ptz-cli/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/onvif-ptz-cli)](https://www.npmjs.com/package/onvif-ptz-cli) [![Docker Pulls](https://img.shields.io/docker/pulls/marklagendijk/onvif-ptz-cli)](https://hub.docker.com/r/marklagendijk/onvif-ptz-cli)

## Installation

### NPM

1. Install Node.js 18.x or higher ([Windows](https://nodejs.org/en/download/current/) | [Linux](https://github.com/nodesource/distributions#debinstall) | [OSx](https://nodejs.org/en/download/current/)).
2. `npm i -g onvif-ptz-cli`
3. Run `onvif-ptz --help` to show the documentation.

### Docker Run
Note: the Docker image is a multiarch image. So it will also work on Raspberry Pi's.

```
sudo docker run \
 --name onvif-ptz \
 --rm \
 marklagendijk/onvif-ptz-cli goto-preset \
 --baseUrl=http://192.168.0.123 \
 -u=admin \
 -p=admin \
 --preset=1
```

## CLI Documenation

### Environment variables

All args can also be specified as environment variables, with the `ONVIF_` prefix. This is mostly useful for specifying the url and credentials, so you don't have to enter them for each command.

```bash
ONVIF_BASE_URL=http://192.168.0.123
ONVIF_USERNAME=admin
ONVIF_PASSWORD=admin
```

### Commands

```
Usage: onvif-ptz <command>

Commands:
   goto-preset  Move the camera to a preset.
   goto-home   Move the camera to the home position.
   move        Move relatively to the current camera position.
   get-presets  List all camera presets. Note: for some cameras the ONVIF presets are separate from the normal presets. If that is the case, you may have to re-create your presets using the set-preset command.
   set-preset  Store the current location/settings in a preset.

Options:
  --help          Show help  [boolean]
  --version       Show version number  [boolean]
  --baseUrl       The baseUrl of the camera.  [string] [required]
  --path          The onvif path of the camera.  [string] [default: "/onvif/device_service"]
  --username, -u  The username of the camera.  [string] [required]
  --password, -p  The password of the camera.  [string] [required]

Examples:
  onvif-ptz goto-preset --baseUrl=http://192.168.0.123 -u=admin -p=admin --preset=1                 Load preset "1".
  onvif-ptz goto-preset --baseUrl=http://192.168.0.123:8080 -u=admin -p=admin --preset=1            Load preset "1" on a camera that uses port 8080 as onvif port.
  onvif-ptz goto-home --baseUrl=http://192.168.0.123 -u=admin -p=admin                              Move the camera to the home position.
  onvif-ptz move --baseUrl=http://192.168.0.123:8080 -u=admin -p=admin -x=0.01                      Move the camera 0.01 to the right.
  onvif-ptz move --baseUrl=http://192.168.0.123:8080 -u=admin -p=admin -x=0.01:0.5                  Move the camera 0.01 to the right with half speed.
  onvif-ptz move --baseUrl=http://192.168.0.123:8080 -u=admin -p=admin -x=0.01 -y=0.02 -z=0.03      Move the camera 0.01 to the right, 0.02 to the top and zoom in 0.03.
  onvif-ptz get-presets --baseUrl=http://192.168.0.123 -u=admin -p=admin                            List all camera presets.
  onvif-ptz set-preset --baseUrl=http://192.168.0.123 -u=admin -p=admin --preset=1 --name=Overview  Create a preset with preset token 1 and name Overview.
```

#### goto-preset

```
onvif-ptz goto-preset

Move the camera to a preset.

Options:
  --help          Show help  [boolean]
  --version       Show version number  [boolean]
  --baseUrl       The baseUrl of the camera.  [string] [required]
  --path          The onvif path of the camera.  [string] [default: "/onvif/device_service"]
  --username, -u  The username of the camera.  [string] [required]
  --password, -p  The password of the camera.  [string] [required]
  --preset        The preset which should be loaded.  [string] [required]
```

#### goto-home

```
onvif-ptz goto-home

Move the camera to the home position.

Options:
  --help          Show help  [boolean]
  --version       Show version number  [boolean]
  --baseUrl       The baseUrl of the camera.  [string] [required]
  --path          The onvif path of the camera.  [string] [default: "/onvif/device_service"]
  --username, -u  The username of the camera.  [string] [required]
  --password, -p  The password of the camera.  [string] [required]
```

#### move

```
onvif-ptz move

Move relatively to the current camera position.

Options:
  --help          Show help  [boolean]
  --version       Show version number  [boolean]
  --baseUrl       The baseUrl of the camera.  [string] [required]
  --path          The onvif path of the camera.  [string] [default: "/onvif/device_service"]
  --username, -u  The username of the camera.  [string] [required]
  --password, -p  The password of the camera.  [string] [required]
  -x              Movement on the x-axis. Left: between -1 and 0. Right: between 0 and 1. Optionally add ':NUMBER' for speed (between 0 and 1).  [string] [default: "0"]
  -y              Movement on the y-axis. Down: between -1 and 0. Up: between 0 and 1. Optionally add ':NUMBER' for speed (between 0 and 1).  [string] [default: "0"]
  -z              Movement on the z-axis (zoom). Zoom out: between -1 and 0. Zoom in: between 0 and 1. Optionally add ':NUMBER' for speed (between 0 and 1).  [string] [default: "0"]
```

#### get-presets

```
onvif-ptz get-presets

List all camera presets. Note: for some cameras the ONVIF presets are separate from the normal presets. If that is the case, you may have to re-create your presets using the set-preset command.

Options:
  --help          Show help  [boolean]
  --version       Show version number  [boolean]
  --baseUrl       The baseUrl of the camera.  [string] [required]
  --path          The onvif path of the camera.  [string] [default: "/onvif/device_service"]
  --username, -u  The username of the camera.  [string] [required]
  --password, -p  The password of the camera.  [string] [required]
```

#### set-preset

```
onvif-ptz set-preset

Store the current location/settings in a preset.

Options:
  --help          Show help  [boolean]
  --version       Show version number  [boolean]
  --baseUrl       The baseUrl of the camera.  [string] [required]
  --path          The onvif path of the camera.  [string] [default: "/onvif/device_service"]
  --username, -u  The username of the camera.  [string] [required]
  --password, -p  The password of the camera.  [string] [required]
  --preset        The token of the preset. Usually just a number.  [string] [required]
  --name          The name of the preset.  [string] [required]
```

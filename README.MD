# QPOP Desktop Client

The QPOP Desktop client is used to connect to the QPOP Android application. The desktop client analyzes the League of Legends client for when the waiting queue accept button appears and notifies the app. From the app, the user must tap the accept button, which will accept the game on the desktop.

## Installation
Click the releases tab and choose the latest release. There are two ways to install QPOP:
Download and run the installer (`Installer.exe`) or the download the unpacked files (`QPOP.zip`)
## Usage
Start the client when you wish to step away from your computer during queue. There are three possible states of the program.

![UI Example](https://user-images.githubusercontent.com/13967957/37259088-40f00c60-253f-11e8-832d-132ddda4c800.PNG)

### Found League of Legends Process
QPOP has found a running League of Legends client
### Mobile App Detected
QPOP has recongized a connection the QPOP Android application
### Processing Images
QPOP is running image recognition

As these conditions are fulfilled, each row will light up with a corresponding check. When QPOP detects a game is ready to accept it displays the following screen.

![Queue Accept Example](https://user-images.githubusercontent.com/13967957/37259087-3aac42e2-253f-11e8-8256-4a4739eb0c95.PNG)

## Build
### Requirements
* NodeJS
* processingModule
* jQuery
* Velocity
* Child Process
* Electron
* Electron Builder
* Semantic UI

### Building the main program
1. Navigate to the QPOP source code directory
2. If Electron Builder is not installed run `npm install electron-builder`
3. run `node_modules\.bin\electron-builder.cmd build`

### Building the processModule
If you want to build the processModule yourself, see instructions [here](https://github.com/nopenoway0/qpop-v8-processing-module).

Wallpaper made by: 
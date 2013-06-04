# phonegap-nfc-test
Some sanity ridden code to help get phonegap-nfc running with cordova cli.

## Requirements
Known working with cordova-cli 2.6.0 -- `` sudo npm install -g cordova@2.6.0 && sudo chown -R YOURUSERNAME /usr/local/lib/node_modules/cordova``


## Installation
1) Clone this repo ``git clone git://github.com/JohnMcLear/phonegap-nfc-test.git && cd phonegap-nfc-test``

2) Change SDK path in local.properties

3) Prepare and Build ``cordova prepare && cordova build android``

4) Run you fool ``./platforms/android/cordova/run``

5) Make changes and rebuild..  ``cordova build android && ./platforms/android/cordova/run``

## Debugging 
Use weinre

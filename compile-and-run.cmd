@ECHO OFF
TITLE Compilando el proyecto en el dispositivo
CALL ng build --prod=false --base-href . --output-path www && cordova run android --device

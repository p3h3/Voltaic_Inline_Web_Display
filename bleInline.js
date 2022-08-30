function log(s){console.log(s);}

const inlineDataLoggingServiceUuid = "ffd70200-fe1b-4b6d-aba1-36cc0bab3e3d";
const inlineDataLoggingCharacteristicUuid= "ffd70201-fe1b-4b6d-aba1-36cc0bab3e3d";
let inlineDataLoggingCharacteristic;

const inlineConfigServiceUuid = "ffd70100-fe1b-4b6d-aba1-36cc0bab3e3d";
const inlineOdometerCharacteristicUuid= "ffd70102-fe1b-4b6d-aba1-36cc0bab3e3d";
let inlineOdometerCharacteristic;

let bleInlineConnected = false;

async function startInlineNotifications() {
    navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
            inlineDataLoggingServiceUuid,
            inlineConfigServiceUuid,
        ]
    })
        .then(device => {
            device.addEventListener('gattserverdisconnected', ()=>{
                bleInlineConnected = false;
                inlineDisconnected();
            });
            return device.gatt.connect();
        })
        .then(server => {
            server.connect();

            setConnectionStatus("Getting Services");

            server.getPrimaryService(inlineConfigServiceUuid).then((service)=>{
                service.getCharacteristic(inlineOdometerCharacteristicUuid).then((characteristic) => {
                    inlineOdometerCharacteristic = characteristic;
                });
            });

            return server.getPrimaryService(inlineDataLoggingServiceUuid);

        })
        .then((dataLog) => {
            setConnectionStatus("Getting Characteristics");

            return dataLog.getCharacteristic(inlineDataLoggingCharacteristicUuid);
        })
        .then(characteristics => {

            setConnectionStatus("Starting Notifications!");
            inlineDataLoggingCharacteristic = characteristics;

            return inlineDataLoggingCharacteristic.startNotifications();
        })
        .then(_ => {
            setConnectionStatus("hidden");

            bleInlineConnected = true;

            inlineConnected();

            inlineDataLoggingCharacteristic.addEventListener('characteristicvaluechanged', handleInlineLoggingNotifications);
        })
        .catch(error => {
            log('Argh! ' + error);
            bleInlineConnected = false;
            inlineDisconnected();
            connectLastInlineButtonVisible();
            setConnectionStatus(error)
        });
}

function stopInlineNotifications() {
    if (bleInlineConnected) {
        inlineDataLoggingCharacteristic.stopNotifications().then(_ => {
            inlineDataLoggingCharacteristic.removeEventListener('characteristicvaluechanged',
                handleInlineLoggingNotifications);
        }).catch(error => {log('Argh! ' + error);});
    }
}

function disconnectInline() {
    if(bleInlineConnected){
        bleInlineDevice.gatt.disconnect();
    }
}

function handleInlineLoggingNotifications(event) {
    let value = event.target.value;

    if(value.byteLength > 1) {
        console.log(value);
        processInlineData(value);
    }else{
        console.log("Something wrong with incoming BLE Data!");
    }
}
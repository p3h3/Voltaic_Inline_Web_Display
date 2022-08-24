function log(s){console.log(s);}

const inlineDataLoggingServiceUuid = "e9ea0200-e19b-482d-9293-c7907585fc48";
    const inlineDataLoggingCharacteristicUuid= "e9ea0201-e19b-482d-9293-c7907585fc48";
    let inlineDataLoggingCharacteristic;

const inlineConfigServiceUuid = "e9ea0100-e19b-482d-9293-c7907585fc48";
    const inlineOdometerCharacteristicUuid= "e9ea0102-e19b-482d-9293-c7907585fc48";
    let inlineOdometerCharacteristic;

let bleInlineConnected = false;

async function startInlineNotifications() {
    navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        services: [
            inlineDataLoggingServiceUuid,
            inlineConfigServiceUuid],
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
        processInlineData(value);
    }else{
        console.log("Something wrong with incoming BLE Data!");
    }
}
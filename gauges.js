var mainGrid = document.getElementById("main-grid");
mainGrid.style.opacity = "0.5";


let inlineGaugeDiv = document.getElementById("inline-gauge-template");
let vehicleOdometerValue = document.getElementById("vehicle-odo-val");
let tripOdometerValue = document.getElementById("trip-odo-val");
let vehicleSpeedValue = document.getElementById("speed-val");
let resetTripButton = document.getElementById("resetTripOdo");
let vehicleRPMValue = document.getElementById("speed-rpm-val");


inlineGaugeDiv.style.opacity = "0.5";
inlineGaugeDiv.style.pointerEvents = "none";

function setSpeedGaugeValues(values){
    if(!values.direction){ // forwards
        vehicleSpeedValue.innerHTML = values.speed.toFixed(1) + "km/h";
    }else{ // backwards
        vehicleSpeedValue.innerHTML = "-" + values.speed.toFixed(1) + "km/h";
    }

    vehicleRPMValue.innerHTML = values.rpm + "RPM";

    tripOdometerValue.innerHTML = (values.tripOdo / 1000).toFixed(2) + "m";

    vehicleOdometerValue.innerHTML = (Math.floor((values.vehicleOdo / 100)) / 10).toFixed(1) + "km";

}


resetTripButton.addEventListener("click", () => {
    console.log("resetting trip odometer");
    inlineOdometerCharacteristic.writeValueWithoutResponse(Uint8Array.from([0b00000001]).buffer);
});

function inlineConnected(){
    inlineGaugeDiv.style.opacity = "1";
    inlineGaugeDiv.style.pointerEvents = "";
}

function inlineDisconnected(){
    inlineGaugeDiv.style.opacity = "0.3";
    inlineGaugeDiv.style.pointerEvents = "none";
}


function setConnectionStatus(status) {
    document.getElementById("connectionStatus").innerHTML = status;
    document.getElementById("connectionStatus").style.position = "inherit";
    if (status === "") {
        document.getElementById("connectionStatus").style.visibility = "hidden";
        connectLastInlineButtonVisible();
        return;
    }
    if(status === "hidden"){
        document.getElementById("connectionStatus").style.visibility = "hidden";
        document.getElementById("connectionStatus").style.position = "absolute";
        connectLastInlineButtonInVisible();
        return;
    }else{
        document.getElementById("connectionStatus").style.visibility = "visible";
    }
    console.log(status);
}
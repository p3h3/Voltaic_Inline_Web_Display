function processInlineData(data){
    let values = {
        speed: (((data.getUint8(2) << 8) | data.getUint8(1)) * 0.036),
        direction: data.getUint8(3),
        motorTemp: (((data.getUint8(5) << 8) | data.getUint8(4)) / 10),
        integratedTemp: (((data.getUint8(7) << 8) | data.getUint8(6)) / 10),
        tripOdo: 0,
        vehicleOdo: 0,
        boardOdo: 0

    };
    setSpeedGaugeValues(values);
}
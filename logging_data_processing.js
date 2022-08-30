function processInlineData(data){
    let values = {
        speed: (((data.getUint8(2) << 8) | data.getUint8(1)) * 0.036),
        direction: data.getUint8(3),
        rpm: ((data.getUint8(5) << 8) | data.getUint8(4)),
        motorTemp: (((data.getUint8(7) << 8) | data.getUint8(6)) / 10),
        integratedTemp: (((data.getUint8(9) << 8) | data.getUint8(8)) / 10),
        tripOdo: (((data.getUint8(13) << 24) | (data.getUint8(12) << 16) | (data.getUint8(11) << 8) | data.getUint8(10)) / 10),
        //vehicleOdo: (((data.getUint8(16) << 24) | (data.getUint8(15) << 16) | (data.getUint8(15) << 8) | data.getUint8(14)) / 10),
        //boardOdo: (((data.getUint8(20) << 24) | (data.getUint8(19) << 16) | (data.getUint8(18) << 8) | data.getUint8(17)) / 10)
    };
    setSpeedGaugeValues(values);
}
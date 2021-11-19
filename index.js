// https://www.espruino.com/I2C
// https://learn.adafruit.com/adafruit-stemma-soil-sensor-i2c-capacitive-moisture-sensor/arduino-test
// https://github.com/KaylinAnn/i2c-seesaw-moisture-sensor/blob/master/index.js
// https://github.com/adafruit/Adafruit_Seesaw/blob/master/Adafruit_seesaw.cpp

I2C1.setup({ scl: D22, sda: D21 });

const TOUCH_BASE = 0x0f;
const TOUCH_OFFSET = 0x10;
const STATUS_BASE = 0x00;
const STATUS_TEMP = 0x04;
const I2C_ADDR = 0x36;

function i2hex(i) {
  return ("0" + i.toString(16)).slice(-2);
}

const convertUint8ArrayToHex = (uInt8Array) => {
  return parseInt(
    uInt8Array
      .toString()
      .split(",")
      .map((i) => parseInt(i))
      .map(i2hex)
      .join(""),
    16
  );
};

const getTemperature = () => {
  I2C1.writeTo(I2C_ADDR, [STATUS_BASE, STATUS_TEMP]);
  const readBuffer = I2C1.readFrom(I2C_ADDR, 4);
  const temp = convertUint8ArrayToHex(readBuffer) * 0.00001525878;
  return temp;
};

const getMoisture = () => {
  I2C1.writeTo(I2C_ADDR, [TOUCH_BASE, TOUCH_OFFSET]);
  // we need to delay it a bit, since there is no delay function in espurino, simple loop does the trick
  for (let i = 0; i < 100; i++) {}
  const readBuffer = I2C1.readFrom(I2C_ADDR, 2);
  const moisture = convertUint8ArrayToHex(readBuffer);

  return moisture;
};

/**
 * Read temperature
 */
setInterval(() => {
  console.log("Temp: ", getTemperature());
  console.log("Moisture: ", getMoisture());
}, 500);

function generatePin(length) {
  const digits = "0123456789";
  let pin = "";

  for (let i = 0; i < length; i++) {
    pin += digits[Math.floor(Math.random() * 10)];
  }

  return pin;
}

module.exports = generatePin

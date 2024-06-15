const { db } = require("../config/firebaseConfig");

class Pin {
  constructor(id, pin, exp, used) {
    this.id = id;
    this.pin = pin;
    this.exp = exp;
    this.used = used;
  }

  static savePin = async (id) => {
    await db.collection("resetPasswords").doc(id).set({ pin: null, exp: null, used: false });
  }

  static updatePin = async (req) => {
    const { id, pin, exp, used } = req;
    await db.collection("resetPasswords").doc(id).update({ pin, exp, used });
  }

  static findById = async (id) => {
    const doc = await db.collection("resetPasswords").doc(id).get();

    if (doc.exists) {
      const data = doc.data();
      return new Pin(doc.id, data.pin, data.exp, data.used);
    }

    return null;
  }
}

module.exports = Pin;

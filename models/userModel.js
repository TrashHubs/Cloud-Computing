const { db } = require("../config/firebaseConfig");

class User {
  constructor(id, name, email, password, phone, address, mitra, roles) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.address = address;
    this.mitra = mitra;
    this.roles = roles;
  }

  static save = async (user) => {
    const { id, name, email, password, phone, address, mitra, roles, verified, token } = user;
    await db.collection("users").doc(id).set({ name, email, password, phone, address, mitra, roles, token, verified: false, token: null });
  }

  static findById = async (id) => {
    const doc = await db.collection("users").doc(id).get();

    if (doc.exists) {
      const data = doc.data();
      return new User(id, data.name, data.email, data.password, data.phone, data.address, data.mitra, data.roles, data.verified, data.token);
    }

    return null;
  }

  static findByEmail = async (email) => {
    const snapshot = await db.collection("users").where("email", "==", email).get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    return new User(doc.id, data.name, data.email, data.password, data.phone, data.address, data.mitra, data.roles, data.verified, data.token);
  }

  static findByPhone = async (phone) => {
    const snapshot = await db.collection("users").where("phone", "==", phone).get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    return new User(doc.id, data.name, data.email, data.password, data.phone, data.address, data.mitra, data.roles, data.verified, data.token);
  }

  static updateToken = async (id, token) => {
    await db.collection("users").doc(id).update({ token });
  }

  static update = async (user) => {
    const { id, name, address, mitra } = user;
    await db.collection("users").doc(id).update({ name, address, mitra });
  }

  static changePassword = async (id, password) => {
    await db.collection("users").doc(id).update({ password });
  }

  static verified = async (user) => {
    await db.collection('users').doc(user).update({ verified: true });
  }
}

module.exports = User;

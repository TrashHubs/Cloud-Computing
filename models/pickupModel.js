const { db } = require("../config/firebaseConfig");

class Pickup {
  constructor(id, photo, weight, lat, lon, description, pickup_date, pickup_time, status) {
    this.id = id;
    this.photo = photo;
    this.weight = weight;
    this.lat = lat;
    this.lon = lon;
    this.description = description;
    this.pickup_date = pickup_date;
    this.pickup_time = pickup_time;
    this.status = status;
  }

  static save = async (pickup) => {
    const { id, photo, weight, lat, lon, description, pickup_date, pickup_time, status } = pickup;
    await db.collection("pickups").doc(id).set({ photo, weight, lat, lon, description, pickup_date, pickup_time, status });
  }

  static findById = async (id) => {
    const doc = await db.collection("pickups").doc(id).get();

    if (doc.empty) {
      return null;
    }

    const data = doc.data();
    return new Pickup(doc.id, data.photo, data.weight, data.lat, data.lon, data.description, data.pickup_date, data.pickup_time, data.status);
  }

  static accept = async (pickup) => {
    const { id, pickup_date, pickup_time, status } = pickup;
    await db.collection("pickups").doc(id).update({ pickup_date, pickup_time, status });
  }

  static reject = async (id) => {
    await db.collection("pickups").doc(id).update({ status: "rejected" });
  }

  static deleteById = async (id) => {
    await db.collection("pickups").doc(id).delete();
  }
}

module.exports = Pickup

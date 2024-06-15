const { db } = require("../config/firebaseConfig");

class Pickup {
  constructor(id, photo, weight, lat, lon, description, pickup_date, pickup_time, status, notifUser, notifMitra, userId, mitraId) {
    this.id = id;
    this.photo = photo;
    this.weight = weight;
    this.lat = lat;
    this.lon = lon;
    this.description = description;
    this.pickup_date = pickup_date;
    this.pickup_time = pickup_time;
    this.status = status;
    this.notifUser = notifUser;
    this.notifMitra = notifMitra;
    this.userId = userId;
    this.mitraId = mitraId;
  }

  static savePickup = async (pickup) => {
    const { id, photo, weight, lat, lon, description, pickup_date, pickup_time, status, notifUser, notifMitra, userId, mitraId } = pickup;
    await db.collection("pickups").doc(id).set({ photo, weight, lat, lon, description, pickup_date, pickup_time, status, notifUser, notifMitra, userId, mitraId });
  }

  static findAllByUser = async (userId) => {
    const snapshot = await db.collection("pickups").where("userId", "==", userId).get();

    if (snapshot.empty) {
      return null;
    }

    const pickups = snapshot.docs.map((doc) => {
      const data = doc.data();

      if (!snapshot.empty && userId == data.userId) {
        return new Pickup(doc.id, data.photo, data.weight, data.lat, data.lon, data.description, data.pickup_date, data.pickup_time, data.status, data.notifUser, data.notifMitra, data.userId, data.mitraId);
      } else {
        return null;
      }
    })

    return pickups.filter((pickup) => pickup !== null);
  }

  static findAllByMitra = async (mitraId) => {
    const snapshot = await db.collection("pickups").get();

    if (snapshot.empty) {
      return null;
    }

    const pickups = snapshot.docs.map((doc) => {
      const data = doc.data();

      if (!snapshot.empty && !data.mitraId || !snapshot.empty && mitraId == data.mitraId) {
        return new Pickup(doc.id, data.photo, data.weight, data.lat, data.lon, data.description, data.pickup_date, data.pickup_time, data.status, data.notifUser, data.notifMitra, data.userId, data.mitraId);
      } else {
        return null;
      }
    })

    return pickups.filter((pickup) => pickup !== null);
  }

  static findIdByUser = async (id, userId) => {
    const pickup = await db.collection("pickups").doc(id).get();
    const data = pickup.data();

    if (pickup.exists && userId == data.userId) {
      return new Pickup(pickup.id, data.photo, data.weight, data.lat, data.lon, data.description, data.pickup_date, data.pickup_time, data.status, data.notifUser, data.notifMitra, data.userId, data.mitraId);
    } else {
      return null;
    }
  }

  static findIdByMitra = async (id, mitraId) => {
    const pickup = await db.collection("pickups").doc(id).get();
    const data = pickup.data();

    if (pickup.exists && !data.mitraId || pickup.exists && mitraId == data.mitraId) {
      return new Pickup(pickup.id, data.photo, data.weight, data.lat, data.lon, data.description, data.pickup_date, data.pickup_time, data.status, data.notifUser, data.notifMitra, data.userId, data.mitraId);
    } else {
      return null;
    }
  }

  static statusPickup = async (pickup) => {
    const { id, pickup_date, pickup_time, status, mitraId } = pickup;
    await db.collection("pickups").doc(id).update({ pickup_date, pickup_time, status, mitraId });
  }

  static markAs = async (id, notifUser, notifMitra) => {
    await db.collection("pickups").doc(id).update({ notifUser, notifMitra });
  }

  static deletePickup = async (id, userId) => {
    const pickup = db.collection("pickups").doc(id);
    const doc = await pickup.get();

    const data = doc.data();
    if (data.userId !== userId) {
      throw new Error('You are not allowed to delete this pickup!');
    }
    
    await pickup.delete();
  }
}

module.exports = Pickup;

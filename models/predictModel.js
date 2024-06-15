const { db } = require("../config/firebaseConfig");

class Predict {
  constructor(id, result, suggestion, explanation, recyclePercentage, imageUrl, userId, createdAt) {
    this.id = id;
    this.result = result;
    this.suggestion = suggestion;
    this.explanation = explanation;
    this.recyclePercentage = recyclePercentage;
    this.imageUrl = imageUrl;
    this.userId = userId;
    this.createdAt = createdAt;
  }

  static save = async (model) => {
    const { id, result, suggestion, explanation, recyclePercentage, imageUrl, userId, createdAt } = model;
    await db.collection("predictions").doc(id).set({ result, suggestion, explanation, recyclePercentage, imageUrl, userId, createdAt });
  }

  static findAll = async (userId) => {
    const snapshot = await db.collection("predictions").where("userId", "==", userId).get();

    if (snapshot.empty) {
      return null;
    }

    const data = snapshot.docs.map((doc) => {
      const prediction = doc.data();
      if (!snapshot.empty && userId == prediction.userId) {
        return new Predict(doc.id, prediction.result, prediction.suggestion, prediction.explanation, prediction.recyclePercentage, prediction.imageUrl, prediction.userId, prediction.createdAt);

      } else {
        return null;
      }
    })

    return data.filter((prediction) => prediction !== null);
  }

  static findById = async (id, userId) => {
    const doc = await db.collection("predictions").doc(id).get();
    const prediction = doc.data();

    if (doc.exists && prediction.userId == userId) {
      return new Predict(doc.id, prediction.result, prediction.suggestion, prediction.explanation, prediction.recyclePercentage, prediction.imageUrl, prediction.userId, prediction.createdAt);
    }

    return null;
  }
}

module.exports = Predict;

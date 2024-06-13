const { db } = require('../config/firebaseConfig');

class model {
  constructor(id, result, suggestion, explanation, recyclePercentage, imageUrl, createdAt) {
    this.id = id;
    this.result = result;
    this.suggestion = suggestion;
    this.explanation = explanation;
    this.recyclePercentage = recyclePercentage;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt;
  }

  static save = async (model) => {
    const { id, result, suggestion, explanation, recyclePercentage, imageUrl, createdAt } = model;
    await db.collection('predictions').doc(id).set({ result, suggestion, explanation, recyclePercentage, imageUrl, createdAt });
  };

  static getAll = async () => {
    const snapshot = await db.collection('predictions').get();

    if(!snapshot) {
      return [];
    }

    return snapshot.docs.map((doc) => {
      const prediction = doc.data();
      return new model(doc.id, prediction.result, prediction.suggestion, prediction.explanation, prediction.recyclePercentage, prediction.imageUrl, prediction.createdAt);
    });
  }

  static getById = async (id) => {
    const doc = await db.collection('predictions').doc(id).get();

    if(!doc) {
      return [];
    }

    const prediction = doc.data();
    return new model(doc.id, prediction.result, prediction.suggestion, prediction.explanation, prediction.recyclePercentage, prediction.imageUrl, prediction.createdAt);
  }
}

module.exports = model;

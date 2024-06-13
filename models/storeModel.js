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

  async save() {
    const predictCollection = db.collection('detections');
    return predictCollection.doc(this.id).set(this);
  }  
}

module.exports = model;

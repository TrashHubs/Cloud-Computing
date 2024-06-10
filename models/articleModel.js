const { db } = require("../config/firebaseConfig");

class Article {
  constructor(id, title, content, author, image, date) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.author = author;
    this.image = image;
    this.date = date;
  }

  static save = async (article) => {
    const { id, title, content, author, image, date } = article;
    await db.collection("articles").doc(id).set({ title, content, author, image, date });
  }

  static findById = async (id) => {
    const doc = await db.collection("articles").doc(id).get();

    if (doc.empty) {
      return null;
    }

    const data = doc.data();
    return new Article(doc.id, data.title, data.content, data.author, data.image, data.date);
  }

  static findAll = async () => {
    const snapshot = await db.collection("articles").get();

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return new Article(doc.id, data.title, data.content, data.author, data.image, data.date);
    })
  }

  static findNews = async (limit) => {
    const snapshot = await db.collection("articles").orderBy("date", "desc").limit(limit).get();

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return new Article(doc.id, data.title, data.content, data.author, data.image, data.date);
    })
  }

  static findByTitle = async (title) => {
    const snapshot = await db.collection("articles").where("title", ">=", title).where("title", "<=", title + '\uf8ff').get();

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return new Article(doc.id, data.title, data.content, data.author, data.image, data.date);
    })
  }

  static updateById = async (article) => {
    const { id, title, content, author, image, date } = article;
    await db.collection("articles").doc(id).update({ title, content, author, image, date });
  }

  static deleteById = async (id) => {
    await db.collection("articles").doc(id).delete();
  }
}

module.exports = Article;

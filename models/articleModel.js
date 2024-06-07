const { db } = require("../config/firebaseConfig");

class Article {
  constructor(id, title, content, author, imageUrl, date) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.author = author;
    this.imageUrl = imageUrl;
    this.date = date;
  }

  static save = async (article) => {
    const { id, title, content, author, imageUrl, date } = article;
    await db.collection("articles").doc(id).set({ title, content, author, imageUrl, date });
  }

  static findById = async (id) => {
    const doc = await db.collection("articles").doc(id).get();

    if (doc.empty) {
      return null;
    }

    const data = doc.data();
    return new Article(doc.id, data.title, data.content, data.author, data.imageUrl, data.date);
  }

  static findAll = async () => {
    const snapshot = await db.collection("articles").get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return new Article(doc.id, data.title, data.content, data.author, data.imageUrl, data.date);
    })
  }

  static findNews = async (limit) => {
    const snapshot = await db.collection("articles").orderBy("date", "desc").limit(limit).get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return new Article(doc.id, data.title, data.content, data.author, data.imageUrl, data.date);
    })
  }

  static findByTitle = async (title) => {
    const snapshot = await db.collection("articles").where("title", "==", title).get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return new Article(doc.id, data.title, data.content, data.author, data.imageUrl, data.date);
    })
  }

  static updateById = async (id, article) => {
    const { title, content, author, imageUrl } = article;
    await db.collection("articles").doc(id).update({ title, content, author, imageUrl });
  }

  static deleteById = async (id) => {
    await db.collection("articles").doc(id).delete();
  }
}

module.exports = Article;

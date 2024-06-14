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

  static saveArticle = async (article) => {
    const { id, title, content, author, image, date } = article;
    await db.collection("articles").doc(id).set({ title, content, author, image, date });
  }

  static findArticleById = async (id) => {
    const doc = await db.collection("articles").doc(id).get();

    if (doc.empty) {
      return null;
    }

    const data = doc.data();
    return new Article(doc.id, data.title, data.content, data.author, data.image, data.date);
  }

  static findAllArticle = async () => {
    const snapshot = await db.collection("articles").get();

    if (snapshot.empty) {
      return null;
    }

    const data = snapshot.docs.map((doc) => {
      const data = doc.data();
      return new Article(doc.id, data.title, data.content, data.author, data.image, data.date);
    })

    return data.filter((article) => article !== null);
  }

  static findArticleNews = async (limit) => {
    const snapshot = await db.collection("articles").orderBy("date", "desc").limit(limit).get();

    if (snapshot.empty) {
      return null;
    }

    const data = snapshot.docs.map((doc) => {
      const data = doc.data();
      return new Article(doc.id, data.title, data.content, data.author, data.image, data.date);
    })

    return data.filter((article) => article !== null);
  }

  static findArticleByTitle = async (title) => {
    const snapshot = await db.collection("articles").where("title", ">=", title).where("title", "<=", title + '\uf8ff').get();

    if (snapshot.empty) {
      return null;
    }

    const data = snapshot.docs.map((doc) => {
      const data = doc.data();
      return new Article(doc.id, data.title, data.content, data.author, data.image, data.date);
    })

    return data.filter((article) => article !== null);
  }

  static updateArticleById = async (article) => {
    const { id, title, content, author, image, date } = article;
    await db.collection("articles").doc(id).update({ title, content, author, image, date });
  }

  static deleteArticleById = async (id) => {
    await db.collection("articles").doc(id).delete();
  }
}

module.exports = Article;

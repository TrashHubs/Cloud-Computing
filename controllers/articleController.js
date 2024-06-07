const Article = require("../models/articleModel");
const validator = require('validator');
const { v4: uuidv4 } = require("uuid");

const getAll = async (req, res) => {
  try {
    const articles = await Article.findAll();

    return res.status(200).json({
      error: false,
      message: "Successfully get article!",
      articles: articles
    })
  } catch (error) {
    return res.status(404).json({
      error: true,
      message: "Article not found!"
    })
  }
}

const getNews = async (req, res) => {
  let { limit } = req.query;
  limit = parseInt(limit)

  try {
    const article = await Article.findNews(limit);
    return res.status(200).json({
      error: false,
      message: "Successfully get news!",
      article: article
    })
  } catch (error) {
    return res.status(404).json({
      error: true,
      message: "Article not found!"
    })
  }
}

const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await Article.findById(id);
    return res.status(200).json({
      error: false,
      message: "Successfully get article!",
      article: article
    })
  } catch (error) {
    return res.status(404).json({
      error: true,
      message: "Article not found!"
    })
  }
}

const create = async (req, res) => {
  const { title, content, author, imageUrl } = req.body;
  const id = uuidv4();
  let date = new Date().toISOString().split('T')[0];

  if (validator.isEmpty(title)) {
    return res.status(400).json({
      error: true,
      message: "Title is required!"
    })
  } else if (validator.isEmpty(content)) {
    return res.status(400).json({
      error: true,
      message: "Content is required!"
    })
  } else if (validator.isEmpty(author)) {
    return res.status(400).json({
      error: true,
      message: "Author is required!"
    })
  } else if (validator.isEmpty(imageUrl)) {
    return res.status(400).json({
      error: true,
      message: "imageUrl is required!"
    })
  }

  try {
    const article = new Article(id, title, content, author, imageUrl, date);
    await Article.save(article);

    return res.status(200).json({
      error: false,
      message: "Successfully create article!",
      article: article
    })
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to create article!"
    })
  }
}

const update = async (req, res) => {
  const { id } = req.params;
  const { title, content, author, imageUrl } = req.body;

  if (validator.isEmpty(title)) {
    return res.status(400).json({
      error: true,
      message: "Title is required!"
    })
  } else if (validator.isEmpty(content)) {
    return res.status(400).json({
      error: true,
      message: "Content is required!"
    })
  } else if (validator.isEmpty(author)) {
    return res.status(400).json({
      error: true,
      message: "Author is required!"
    })
  } else if (validator.isEmpty(imageUrl)) {
    return res.status(400).json({
      error: true,
      message: "imageUrl is required!"
    })
  }

  try {
    const article = new Article(id, title, content, author, imageUrl, "");
    await Article.updateById(id, article);

    return res.status(200).json({
      error: false,
      message: "Successfully update article!",
      article: article
    })
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to update article!"
    })
  }
}

const deleteById = async (req, res) => {
  const { id } = req.params;

  try {
    await Article.deleteById(id);
    return res.status(200).json({
      error: false,
      message: "Successfully delete article!"
    })
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Failed to delete article!"
    })
  }
}

module.exports = { getAll, getNews, getById, create, update, deleteById };

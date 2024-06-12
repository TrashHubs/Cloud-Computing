const { bucket } = require("../config/firebaseConfig");

const Article = require("../models/articleModel");
const validator = require('validator');
const { v4: uuidv4 } = require("uuid");

const multer = require('multer');
const storage = multer({
  storage: multer.memoryStorage(),
  fileSize: 1 * 1024 * 1024
}).single('image');

const getAll = async (req, res) => {
  try {
    const article = await Article.findAll();
    return res.status(200).json({
      error: false,
      message: "Successfully get articles!",
      articleResults: article
    })

  } catch (error) {
    return res.status(404).json({
      error: true,
      message: "Article not found!"
    })
  }
}

const getNews = async (req, res) => {
  let { limit } = req.params;
  limit = parseInt(limit);

  try {
    const article = await Article.findNews(limit);
    return res.status(200).json({
      error: false,
      message: "Successfully get news!",
      articleResult: article
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

    if (!article) {
      return res.status(404).json({
        error: true,
        message: "Article not found!"
      })

    } else {
      return res.status(200).json({
        error: false,
        message: "Successfully get article!",
        articleResult: article
      })
    }

  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to get article!"
    })
  }
}

const create = async (req, res) => {
  storage(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: "Failed to upload image!"
      })
    }

    const { title, content, author, date } = req.body;
    const id = uuidv4();
    const image = req.file;

    const fileName = `${image.originalname}-${Date.now()}`;
    const folderName = 'articles';

    const filePath = `${folderName}/${fileName}`;
    const file = bucket.file(filePath);

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
    } else if (validator.isEmpty(date) || !validator.isDate(date)) {
      return res.status(400).json({
        error: true,
        message: "Valid date is required!"
      });
    }

    try {
      await file.save(image.buffer, {
        metadata: { contentType: image.mimetype }
      });

      await file.makePublic();
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

      const article = new Article(id, title, content, author, imageUrl, date);
      await Article.save(article);

      return res.status(201).json({
        error: false,
        message: "Successfully create article!",
        createResult: article
      })

    } catch (error) {
      return res.status(400).json({
        error: true,
        message: "Failed to create article!"
      })
    }
  })
}

const update = async (req, res) => {
  storage(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: "Failed to upload image!"
      })
    }

    const { id } = req.params;
    const { title, content, author, date } = req.body;
    const image = req.file;

    const fileName = `${image.originalname}-${Date.now()}`;
    const folderName = 'articles';

    const filePath = `${folderName}/${fileName}`;
    const file = bucket.file(filePath);

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
    } else if (validator.isEmpty(date) || !validator.isDate(date)) {
      return res.status(400).json({
        error: true,
        message: "Valid date is required!"
      });
    }

    try {
      const exist = await Article.findById(id);
      if (!exist) {
        return res.status(404).json({
          error: true,
          message: "Article not found!"
        })

      } else {
        const oldFilePath = exist.image.split(`https://storage.googleapis.com/${bucket.name}/`)[1];
        const oldFile = bucket.file(oldFilePath);
        await oldFile.delete();

        await file.save(image.buffer, {
          metadata: { contentType: image.mimetype }
        });
  
        await file.makePublic();
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

        const article = new Article(id, title, content, author, imageUrl, date);
        await Article.updateById(article);

        return res.status(200).json({
          error: false,
          message: "Successfully update article!",
          updateResult: article
        })
      }

    } catch (error) {
      return res.status(400).json({
        error: true,
        message: "Failed to update article!"
      })
    }
  })
}

const deleteById = async (req, res) => {
  const { id } = req.params;

  try {
    const exist = await Article.findById(id);
    if (!exist) {
      return res.status(404).json({
        error: true,
        message: "Article not found!"
      })

    } else {
      const oldFilePath = exist.image.split(`https://storage.googleapis.com/${bucket.name}/`)[1];
      const oldFile = bucket.file(oldFilePath);
      await oldFile.delete();

      await Article.deleteById(id);
      return res.status(200).json({
        error: false,
        message: "Successfully delete article!"
      })
    }

  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to delete article!"
    })
  }
}

const search = async (req, res) => {
  const { title } = req.params;

  try {
    const article = await Article.findByTitle(title);

    if (!article) {
      return res.status(404).json({
        error: true,
        message: "Article not found!"
      })
    } else {
      return res.status(200).json({
        error: false,
        message: "Successfully get article!",
        searchResult: article
      })
    }

  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to get article!"
    })
  }
}

module.exports = { getAll, getNews, getById, create, update, deleteById, search };

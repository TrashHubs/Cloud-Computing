const express = require("express")
const router = express.Router()

const { create, getAll, getNews, getById, update, deleteById } = require('../controllers/articleController')

router.get('/', getAll)
router.get('/news', getNews)
router.get('/detail/:id', getById)
router.post('/create', create)
router.put('/update/:id', update)
router.delete('/delete/:id', deleteById)

module.exports = router

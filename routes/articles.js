const express = require("express")
const router = express.Router()

const { create, getAll, getNews, getById, update, deleteById, search } = require('../controllers/articleController')

router.get('/', getAll)
router.get('/news/:limit', getNews)
router.get('/detail/:id', getById)
router.post('/create', create)
router.put('/update/:id', update)
router.delete('/delete/:id', deleteById)
router.get('/search/:title', search)

module.exports = router

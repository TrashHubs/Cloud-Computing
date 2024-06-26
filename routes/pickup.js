const express = require("express")
const router = express.Router()

const { create, getAll, getById, accept, reject, deleteById } = require('../controllers/pickupController')
const verifyToken = require('../middleware/authMiddleware')

router.get('/', verifyToken, getAll)
router.post('/create', verifyToken, create)
router.get('/detail/:id', verifyToken, getById)
router.put('/accept/:id', verifyToken, accept)
router.put('/reject/:id', verifyToken, reject)
router.delete('/delete/:id', verifyToken, deleteById)

module.exports = router

const express = require("express")
const router = express.Router()

const { predictModel, getAll, getById } = require("../controllers/predictController.js");
const verifyToken = require("../middleware/authMiddleware");

router.get('/', verifyToken, getAll)
router.post('/create', verifyToken, predictModel)
router.get('/detail/:id', verifyToken, getById)

module.exports = router

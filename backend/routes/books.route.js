const express = require("express")
const books = require("../controllers/books.controller")
const upload = require("../middlewares/upload")
const router = express.Router()

router.post('/', upload.single('image'), books.createBook)
router.get('/', books.getAll)
router.get('/:id', books.getOne)
router.put('/:id', upload.single('image'), books.updateOne)
router.delete('/:id', books.deleteOne)
router.delete('/', books.deleteAll)

module.exports = router;
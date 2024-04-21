const express = require("express");
const users = require("../controllers/users.controller");
const login = require("../controllers/auth.controller")
const router = express.Router();

router.post('/', users.createUser)
router.get('/', users.getAll)
router.get('/:id', users.getOne)
router.delete('/', users.deleteAll)
router.put('/:id', users.updateOne)
router.delete('/:id', users.deleteOne)
router.put('/:id', users.updateFavorite)
router.put('/:id', users.updateBorrow)
router.put('/:id', users.deleteBookFromBorrow)

router.post('/login', login.login)

module.exports = router;
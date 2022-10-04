const { Router } = require('express')
const UsersController = require('../controllers/UsersController')
const uploadConfig = require('../configs/upload')

const userRoutes = Router()
const upload = multer(uploadConfig.MULTER)

const usersController = new UsersController()

userRoutes.post('/', usersController.create)
userRoutes.put('/:id', usersController.update)

module.exports = userRoutes

const { Router } = require('express')

const userRoutes = require('./user.routes')
const notesRoutes = require('./notes.routes')

const routes = Router()
routes.use('/users', userRoutes)
routes.use('/notes', notesRoutes)
routes.use('/tags', tagsRoutes)
routes.use('/sessions', sessionsRouter)

module.exports = routes

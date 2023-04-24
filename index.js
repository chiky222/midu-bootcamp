require('dotenv').config()
require('./mongo.js')

const express = require('express')
const cors = require('cors')
const app = express()
const handleErrors = require('./middleware/handleErrors.js')
const notFound = require('./middleware/notFound.js')
const usersRouter = require('./controllers/users')
const notesRouter = require('./controllers/notes')

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.use('/api/users', usersRouter)
app.use('/api/notes', notesRouter)

app.use(notFound) // notFound estaba definido acá la función, dentro de los paréntesis pero lo pusimos en middleware como módulo
app.use(handleErrors) // idem al anterior

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }

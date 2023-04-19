require('dotenv').config()
require('./mongo.js')

const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/Note')
const handleErrors = require('./middleware/handleErrors.js')
const notFound = require('./middleware/notFound.js')

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  // const note = notes.find(note => note.id === id)
  Note.findById(id).then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  }).catch(err => {
    next(err)
    // console.log(err)
    // response.status(400).end()   esto lo hicimos antes de pasarlo en el next()
  })
})

app.delete('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  // notes = notes.filter(note => note.id !== id)
  Note.findByIdAndDelete(id).then(() => {
    response.status(204).end()
  }).catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      response.json(result)
    }).catch(error => next(error))
})

app.post('/api/notes', (request, response, next) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const newNote = new Note({
    content: note.content,
    date: new Date().toISOString(),
    important: typeof note.important !== 'undefined' ? note.important : false
  })

  newNote.save().then(savedNote => {
    response.json(savedNote)
  }).catch(error => next(error))

  // const ids = notes.map(note => note.id)
  // const maxId = Math.max(...ids)
  // notes = [...notes, newNote] // o tambien  notes = notes.concat(newNote)
  // response.status(201).json(note)
})

app.use(notFound) // notFound estaba definido acá la función, dentro de los paréntesis pero lo pusimos en middleware como módulo
app.use(handleErrors) // idem al anterior

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

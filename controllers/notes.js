const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/user')

notesRouter.get('/', (request, response) => {
  Note.find({}).populate('user').then(notes => {
    response.json(notes)
  })
})

notesRouter.get('/:id', (request, response, next) => {
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

notesRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params
  await Note.findByIdAndDelete(id).then(() => response.status(204).end())
    .catch(next)
})

notesRouter.put('/:id', (request, response, next) => {
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

notesRouter.post('', async (request, response, next) => {
  const {
    content,
    important = false,
    userId
  } = request.body

  const user = await User.findById(userId)

  if (!content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const newNote = new Note({
    content,
    date: new Date().toISOString(),
    important,
    user: user._id // o user.toJSON().id
  })

  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.json(savedNote)
  } catch (error) {
    next(error)
  }

  // const ids = notes.map(note => note.id)
  // const maxId = Math.max(...ids)
  // notes = [...notes, newNote] // o tambien  notes = notes.concat(newNote)
  // response.status(201).json(note)
})

module.exports = notesRouter

const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

// usersRouter.get('/', async (request, response) => {
//   const users = await User.find({})
//   response.json(users)
// })

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    date: 1,
    _id: 0
  })
  // populate trae el cont. de notas en cada usuario - con uno indicamos cual queremos traer, con 0 el que no si es el id
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { body } = request
  const { username, name, password } = body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

module.exports = usersRouter

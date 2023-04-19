const mongoose = require('mongoose')
const connectionString = process.env.MONGO_DB_URI

// conexión a Mongodb
mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.log(err)
  })

// Crear Datos

// const note = new Note({
//   content: 'MongoDB es increible, midu',
//   date: new Date(),
//   important: true
// })

// note.save()
//   .then(result => {
//     console.log(result)
//     mongoose.connection.close()
//   }).catch(err => {
//     console.log(err)
//   })

// Consultar Datos

// Note.find({}).then(result => {
//   console.log(result)
//   mongoose.connection.close()
// })

process.on('uncaughtException', () => {
  mongoose.connection.disconect()
})

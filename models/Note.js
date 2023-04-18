const { model, Schema } = require('mongoose')

const noteSchema = new Schema({ // esto sería new mongoose.Schema pero al importarlo arriba hacemos q no sea necesario
  content: String,
  date: Date,
  important: Boolean
})

// al hacer esto, seteamos el resultado que nos llega en Note.find
// ya que cambiamos el toJSON que se hace automáticamente
// se cambia para todo lo que recibimos de la colección sin afectar la base de datos
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = model('Note', noteSchema)

module.exports = Note

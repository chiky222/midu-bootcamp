module.exports = (err, request, response, next) => {
  console.log(err)
  if (err.name === 'CastError') {
    response.status(400).end()
  } else {
    response.status(500).end()
  }
}

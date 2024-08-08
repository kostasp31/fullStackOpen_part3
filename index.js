const express = require('express')
const app = express()
require('dotenv').config()

const Person = require('./models/person')
app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError')
      return response.status(400).send({ error: 'malformatted id' })
    else if (error.name === 'ValidationError')
      return response.status(400).json({ error: error.message })

    next(error)
}

const cors = require('cors')
app.use(cors())

app.use(express.json())

const morgan = require('morgan')
morgan.token('object', (func = (req, res) => { return JSON.stringify(req.body) }))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
})

app.get('/info', (request, response) => {
    const now = new Date()

    Person.find({}).then(person => {
        response.send(`<p>Phonebook has info for ${person.length} people</p><p>${now.toString()}</p>`)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => {next(error)})
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(result => {
          response.status(204).end()
        })
      .catch(error => next(error))
})
    
// const randInt = (min, max) => {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  
  const person = new Person({
      name: body.name,
      number: body.number,
  })
    
  person.save()
  .then(savedPerson => {
      response.json(savedPerson)
  })
  .catch(error => next(error))
   
})


app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body
  
    Person.findByIdAndUpdate(request.params.id, {name, number}, { new: true, runValidators: true, context: 'query' })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
})


app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
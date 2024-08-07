require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')


app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('object', (func = (req, res) => { return JSON.stringify(req.body) }))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))

let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
  
app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/info', (request, response) => {
    const now = new Date()
    response.send(`<p>Phonebook has info for ${phonebook.length} people</p><p>${now.toString()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => { // not updated 
    const id = request.params.id
    phonebook = phonebook.filter(person => person.id !== id)

    response.status(204).send()
})

// const randInt = (min, max) => {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
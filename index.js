const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')


app.use(express.json())
app.use(cors())

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
    response.json(phonebook)
})

app.get('/info', (request, response) => {
    const now = new Date()
    response.send(`<p>Phonebook has info for ${phonebook.length} people</p><p>${now.toString()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phonebook.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phonebook = phonebook.filter(person => person.id !== id)

    response.status(204).send()
})

const randInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.post('/api/persons', (request, response) => {
    const bd = request.body
    if (!bd.name && !bd.number) {
        return response.status(400).json({
            error: 'name and number missing'
        })
    }
    if (!bd.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    if (!bd.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }

    const twin = phonebook.find(person => person.name === bd.name)
    if (twin) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
  
    const person = {
      name: bd.name,
      number: bd.number,
      id: `${randInt(0, 100000)}`
    }
    phonebook = phonebook.concat(person)
  
    response.json(person)
})



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
const express = require('express')
const morgan = require('morgan')
const app = express()

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "phone": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "phone": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "phone": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "phone": "39-23-6423122"
    }
]

app.use(express.json())

morgan.token('body', (req, res) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body

  if (!person.name || !person.phone) {
    return response.status(400).json({
      error: 'name or phone missing'
    })
  }

  if (persons.find(p => p.name === person.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const id = parseInt(Math.random() * 100000000000000)
  person.id = String(id)
  persons = persons.concat(person)

  response.json(person)
})

app.get('/info', (request, response) => {
  const date = Date().toString()
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
console.log('Hello, world')
let notes = [ //const notes = require('./db.json')
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

//// without using express, then only app.listen(PORT)
//const http = require('http') // syntax for common JS module (older)
////import http from 'http' // would be ES6 module syntax
//const app = http.createServer((request, response) => {
//  response.writeHead(200, { 'Content-Type': 'application/json' })
////  response.end('Hello World') // content of site to be returned
//  response.end(JSON.stringify(notes))
//  console.log('server contacted')
//})

const express = require('express')
const app = express()
app.use(express.json()) // activate json parser, useful to post

const cors = require('cors')
app.use(cors())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  for (const [key, value] of Object.entries(request)) {
  console.log(`${key}`);
  }
  console.log('---')
  next()
}
// app.use(requestLogger)

app.get('/', (request, response) => {
  response.send('<h1> Hello World </h1>') //Since the parameter is a string, Express automatically sets the value of the Content-Type header to be text/html. The status code of the response defaults to 200.
})
app.get('/api/notes', (request, response) => {
  response.json(notes) //Express automatically sets the Content-Type header with the appropriate value of application/json, and stringifies the content.
})
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(e => e.id === id)
  if (note) {
    console.log(`note ${id} was found on the server`)
    response.json(note) //Express automatically sets the Content-Type header with the appropriate value of application/json, and stringifies the content.
  } else {
    statusMessage = `note ${id} was not found on the server`
    console.log(statusMessage)
    response.statusMessage = statusMessage // optional
    response.status(404).end()
  }
})
app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)
  console.log(`note ${id} is not on the server anymore`)
  response.status(204).end()
})
app.post('/api/notes', (request, response) => {
  console.log('post, body is', request.body)
//  console.log('post, request is', request)
  const note = request.body
  notes.push(note)
  response.json(note)
})

const unknownEndpoint = (req, res) => { 
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {// listen to HTTP requests sent to port 3001
  console.log(`Server running on port ${PORT}`)
})

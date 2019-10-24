require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const MOVIEDEX = require('./moviedex.json')

const app = express()

// First middelware - runs on every route
app.use(morgan('dev'))

// Second middleware - runs on every route
app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(" ")[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
  })

app.get('/movie', function handleGetMovie(req, res) {
    let response = MOVIEDEX;
  
    // filter our movie by genre if genre query param is present
    if (req.query.genre) {
      response = response.filter(movie =>
        // case insensitive searching
        movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
      )
    }
  
    // filter our movie by country if country query param is present
    if (req.query.country) {
      response = response.filter(movie =>
        movie.country.toLowerCase().includes(req.query.country.toLowerCase())
      )
    }
  
    // filter our movie by avg_vote if avg_vote query param is present
    if (req.query.avg_vote) {
        response = response.filter(movie =>
          movie.avg_vote >= (req.query.avg_vote)
        )
      }

    res.json(response)
  })

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
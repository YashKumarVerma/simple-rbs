import express from 'express'

/**
 * Initialize express application to hook all middlewares
 */
const app = express()

app.get('', (req, res) => {
  res.json({ alive: true })
})

export default app

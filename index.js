require('dotenv').config()

const express = require('express')
const app = require('./src/config/express')
const bigTime = require('./src/config/bigtime')

const port = process.env.PORT || 3000

app.listen(port, async () => {
  await bigTime.createSession()
  console.log(`BigTime Viz listening on port ${port}`)
})

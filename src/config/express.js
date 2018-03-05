const express = require('express')
const routes = require('../routes')

const app = express()

app.set('views', `${process.cwd()}/src/views`)
app.set('view engine', 'pug')
app.set('namespace', 'btv')

app.use(express.static('public'));
app.use(routes)

module.exports = app

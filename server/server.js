const express = require('express')
const server = express()

server.use(express.json())

const indexRouter = require('../router/index.router')

server.use('/', indexRouter)

module.exports = server
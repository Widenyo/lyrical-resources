const express = require('express')
const server = express()
const cors = require('cors')

server.use(express.json())
server.use(cors());

const indexRouter = require('../router/index.router')

server.use('/', indexRouter)

module.exports = server
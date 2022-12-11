require('dotenv').config()

const port = process.env.PORT || 3005
const server = require('./server/server')

server.listen(port, () => {
    console.log(`Express server listening on port ${port}`)
})
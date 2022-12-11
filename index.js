require('dotenv').config()

const port = process.env.PORT || 3005
const server = require('./server/server')
const CloudinaryService = require('./services/cloudinary/cloudinary.services')
const cloudinaryService = new CloudinaryService()

server.listen(port, async () => {
    console.log(`Express server listening on port ${port}`)
    try{
    const cloudinaryFiles = await cloudinaryService.getFolders()
    server.locals.cloudinary = {...cloudinaryFiles}
    console.log('Cloudinary files loaded successfully')

    console.log(`You're good to go!`)
    }catch(e){
        console.error('Error fetching cloudinary files: ' + e.message)
    }
})
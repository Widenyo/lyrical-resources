require('dotenv').config()

const port = process.env.PORT || 3005
const server = require('./server/server')
const CloudinaryService = require('./services/cloudinary/cloudinary.services')
const JsonFileService = require('./services/json/json.services')
const cloudinaryService = new CloudinaryService()
const jsonFileService = new JsonFileService('cloudinary')

server.listen(port, async () => {
    console.log(`Express server listening on port ${port}`)
        let data = await jsonFileService.readJson()
        if(!data.success){
            console.log(data.message, 'Creating JSON file.')
            const cloudinaryFiles = await cloudinaryService.getFolders()
            await jsonFileService.writeJson(cloudinaryFiles)
        }
        data = null
        console.log('Cloudinary files loaded successfully')
        console.log(`You're good to go!`)
        setInterval(async () => {
            try{
            const cloudinaryFiles = await cloudinaryService.getFolders()
            await jsonFileService.updateJson(cloudinaryFiles)
            }catch(e){
                console.error(e, 'cancelling update')
            }
        }, 3600000)
})
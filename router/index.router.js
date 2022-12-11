const {Router} = require('express')
const router = Router()

const cloudinaryRouter = require('./cloudinary/cloudinary.router.js')

router.use('/cloudinary', cloudinaryRouter)

module.exports = router
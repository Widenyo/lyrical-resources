const {Router} = require('express')
const router = Router();

router.get('/*', async (req, res) => {

    try{
        const {originalUrl} = req
        console.log(originalUrl)
        const splitUrl = originalUrl.split('/')
        splitUrl.shift()
        console.log(splitUrl)
        let folder = req.app.locals.cloudinary
        splitUrl.forEach(i =>{
            if(!folder[i]) return
            folder = folder[i]
        })
        res.json({success: true,
            data:folder.files})
    }catch(e){
        res.json({
            success: false,
            error: e.message
        })
    };

});

module.exports = router;
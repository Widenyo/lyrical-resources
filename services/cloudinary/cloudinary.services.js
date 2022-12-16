const cloudinary = require('cloudinary').v2;
require('dotenv').config();

class CloudinaryService {
  constructor() {
    // Configure Cloudinary using the credentials from the .env file
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  }

  async uploadFile(url, public_id){
    try{
    const upload = await cloudinary.uploader.upload(url, {
      public_id
    })
    return {
      success: true,
      upload
    }
  }catch(e){
    console.error(e)
    return {
      success: false,
      message: e.message
    }
    }
  }

  async deleteFile(path){
    try{
      const deleted = await cloudinary.uploader.destroy(path)
      return {
        success: true,
        deleted
      }
    }catch(e){
      console.error(e)
      return {
        success: false,
        message: e.message
      }
    }
  }

  async getFolders(folder = '/') {
    // Fetch a list of all folders in the specified folder
    const subFolders = await cloudinary.api.sub_folders(folder);
    // Initialize an empty object to store the results
    const folders = {};

    // Loop through each subfolder and fetch its files and subfolders
    for (const subFolder of subFolders.folders) {
      const {name, path} = subFolder
      if(!name) return folders
      folders[name] = {
        files: [],
      };


      let files = []

      try{
      let filesReq = await cloudinary.search.expression(`folder=${path}`).with_field('tags').with_field('context').sort_by('public_id','desc').max_results(500).execute()
      let resources = filesReq.resources
      files = resources

      if(filesReq.next_cursor){
        let flag = true
        let pointer = filesReq.next_cursor
        while(flag){
          const filesReq = await cloudinary.v2.search.expression(`folder=${path}`).with_field('tags').with_field('context').sort_by('public_id','desc').max_results(500).next_cursor(pointer).execute()
          files = [...files, ...filesReq.resources]
          pointer = filesReq.next_cursor
          if(!pointer) flag = false
      }
      }
    }catch(e){
      console.error(e.message)
    }

       console.log(files.length)


      // Loop through each file and add it to the results object
      for (const file of files) {
        folders[name].files.push({
          ...file
        });
      }

      // Recursively call this function to fetch the subfolders of the current subfolder
      Object.assign(folders[name], 
        await this.getFolders(path)
        )
    }

    return folders;
  }
}

module.exports = CloudinaryService;


// const test = new CloudinaryService()
// test.uploadFile('https://drive.google.com/uc?export=view&id=1VqtPBl9wS4535r9wclvzGIG55GnT3h27', 'sex/sunflower.jpg')

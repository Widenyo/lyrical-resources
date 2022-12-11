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
      // Fetch the files in the current folder

      // cloudinary.search.expression(`folder=${path}`).execute().then(r =>{
      //     files = [...files, ...r]
      // }).catch(e => console.error(e))
      // console.log(files)


        let promise = new Promise((resolve, reject) => {
          cloudinary.search
            .expression(`folder=${path}`)
            .execute()
            .then((result) => { resolve(result) })
            .catch((error) => {
              console.error(error)
            });
        })
      
        let result = await promise
        files = result.resources

        if(path === 'accepted/test' || path === 'accepted/test2' || path === 'accepted/test3') console.log(files)


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


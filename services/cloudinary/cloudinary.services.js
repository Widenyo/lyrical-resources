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

  async getFolders(folder = '') {
    // Fetch a list of all folders in the specified folder
    const subFolders = await cloudinary.api.sub_folders(folder);

    // Initialize an empty object to store the results
    const folders = {};

    // Loop through each subfolder and fetch its files and subfolders
    for (const subFolder of subFolders.folders) {
      folders[subFolder] = {
        files: [],
        folders: []
      };

      // Fetch the files in the current subfolder
      const files = await cloudinary.api.resources({
        type: 'upload',
        prefix: `${folder}/${subFolder}/`
      });

      // Loop through each file and add it to the results object
      for (const file of files.resources) {
        folders[subFolder].files.push({
          fileData: file
        });
      }

      // Recursively call this function to fetch the subfolders of the current subfolder
      folders[subFolder].folders = await this.getFolders(`${folder}/${subFolder}`);
    }

    return folders;
  }
}

module.exports = CloudinaryService;

const test = new CloudinaryService()


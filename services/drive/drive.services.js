require("dotenv").config();
const { google } = require("googleapis");
const { authorized } = require("./auth");
const drive = google.drive({ version: "v3", auth: authorized });
const axios = require("axios");
const { Readable } = require("stream");
const JsonFileService = require("../json/json.services");
const cloudinaryStorage = new JsonFileService("cloudinary");
const CloudinaryService = require("../cloudinary/cloudinary.services");
const cloudinaryService = new CloudinaryService()


class DriveService {
  constructor() {}

  async uploadImageByUrl(url, name = "image.jpg") {
    // Fetch the image from the given URL
    let response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    // Convert the image data to a Uint8Array
    const stream = Readable.from(response.data);

    // // Create a ReadableStream from the image data
    // const stream = fs.createReadStream(data);

    // Get the MIME type of the image
    const mimeType = response.headers["content-type"];

    // Create a new file on Google Drive

    const file = await drive.files.create({
      resource: {
        name,
        mimeType: mimeType,
      },
      media: {
        mimeType: mimeType,
        body: stream,
      },
    });

    // Return the file metadata
    return file.data;
  }
  async syncWithCloudinary() {
    const cloudinaryFiles = await (await cloudinaryStorage.readJson()).data;
    const folders = await (
      await drive.files.list({
        q: `mimeType = 'application/vnd.google-apps.folder' and '1V01dUq6WNiQ9XvTQ3Unh4R4mLvAdRsRK' in parents`,
      })
    ).data.files;

    for (const folder of folders) {
      const { id, name } = folder;

      const files = await (
        await drive.files.list({
          q: `'${id}' in parents`,
        })
      ).data.files;


      //If folder doesnt exists, upload all files in a new folder
      if (!cloudinaryFiles[name]) {
        for (const file of files) {
          console.log('Uploading ' + file.name + ' on ' + `${name}/${file.name}`)
          const upload = await cloudinaryService.uploadFile(`https://drive.google.com/uc?export=view&id=${file.id}`, `${name}/${file.name}`)
          if(!upload.success){
            console.log('Failed to upload ' + file.name)
          }
        }
        continue;
      }

      //For each file in the drive folder, check if it exists in cloudinary and if it doesnt upload it
      for (const file of files) {
        let exists = false
        for (const cloudFile of cloudinaryFiles[name].files) {
          if (cloudFile.filename === file.name){
            exists = true
            break
          }
        }
        if(!exists){
          console.log('Uploading ' + file.name + ' on ' + `${name}/${file.name}`)
          const upload = await cloudinaryService.uploadFile(`https://drive.google.com/uc?export=view&id=${file.id}`, `${name}/${file.name}`)
          if(!upload.success){
            console.log('Failed to upload ' + file.name)
          }
        }
      }

    }


    //Rewrite json
    const cloudinaryFilesFromCloud = await cloudinaryService.getFolders()
    await cloudinaryStorage.updateJson(cloudinaryFilesFromCloud)
    return console.log('Finished syncing')
  }
}

module.exports = DriveService;

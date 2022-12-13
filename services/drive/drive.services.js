require('dotenv').config()
const { google } = require('googleapis');
const { authorized } = require('./auth');
const drive = google.drive({version: 'v3', auth: authorized});
const axios = require('axios')
const { Readable } = require('stream');

class DriveService {
  constructor() {
  }

  async uploadImageByUrl(url, name = 'image.jpg') {
    // Fetch the image from the given URL
    let response =  await axios.get(url, {
      responseType: 'arraybuffer'
    });

      // Convert the image data to a Uint8Array
    const stream = Readable.from(response.data);

    // // Create a ReadableStream from the image data
    // const stream = fs.createReadStream(data);

    // Get the MIME type of the image
    const mimeType = response.headers['content-type'];

    // Create a new file on Google Drive

    const file = await drive.files.create({
      resource: {
        name,
        mimeType: mimeType
      },
      media: {
        mimeType: mimeType,
        body: stream
      }
    })

    // Return the file metadata
    return file.data;
  }
  // async syncWithCloudinary(){
    
  // }
}

module.exports = DriveService;

console.log(new DriveService().uploadImageByUrl('https://media.admagazine.com/photos/61eb22cb9b19d943aa117b30/master/w_1600%2Cc_limit/Girasol.jpg'))
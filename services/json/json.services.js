const fs = require('fs')

class JsonFileService {
    constructor(jsonName) {
      this.filePath = `${__dirname}/storage/${jsonName}.json`;
    }
  
    async readJson() {
        try{
            const jsonString = await fs.promises.readFile(this.filePath, 'utf-8');
            return {success: true, data: JSON.parse(jsonString)};
        }catch(e){
            return {
                success:false,
                message: e.message
            }
        }
    }
  
    async writeJson(data) {
      const jsonString = JSON.stringify(data);
      await fs.promises.writeFile(this.filePath, jsonString);
    }
  
    async updateJson(data) {
      const currentData = await (await this.readJson()).data;
      const updatedData = { ...currentData, ...data };
      await this.writeJson(updatedData);
    }
}

module.exports = JsonFileService
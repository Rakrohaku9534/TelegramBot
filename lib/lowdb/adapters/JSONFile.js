const fs = require('fs'); // Ubah cara impor fs

class JSONFile {
  constructor(filename) {
    this.filename = filename;
  }

  async read() {
    let data;
    try {
      data = await fs.promises.readFile(this.filename, 'utf-8'); // Ubah cara membaca file
    } catch (e) {
      if (e.code === 'ENOENT') {
        return null;
      }
      throw e;
    }
    return data ? JSON.parse(data) : null;
  }

  write(obj) {
    return fs.promises.writeFile(this.filename, JSON.stringify(obj, null, 2)); // Ubah cara menulis file
  }
}

module.exports = JSONFile;

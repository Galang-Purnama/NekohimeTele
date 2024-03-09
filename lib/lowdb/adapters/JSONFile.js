import { promises } from 'fs'; // Ubah cara impor fs

class JSONFile {
  constructor(filename) {
    this.filename = filename;
  }

  async read() {
    let data;
    try {
      data = await promises.readFile(this.filename, 'utf-8'); // Ubah cara membaca file
    } catch (e) {
      if (e.code === 'ENOENT') {
        return null;
      }
      throw e;
    }
    return data ? JSON.parse(data) : null;
  }

  write(obj) {
    return promises.writeFile(this.filename, JSON.stringify(obj, null, 2)); // Ubah cara menulis file
  }
}

export default JSONFile;

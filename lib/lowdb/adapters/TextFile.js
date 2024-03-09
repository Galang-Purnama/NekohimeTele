import { readFileSync, writeFileSync, renameSync } from 'fs';
import { join, dirname, basename } from 'path';

class TextFile {
  constructor(filename) {
    this.filename = filename;
    this.tempFilename = join(dirname(filename), `.${basename(filename)}.tmp`);
  }
  read() {
    try {
      const data = readFileSync(this.filename, 'utf-8');
      return data;
    } catch (e) {
      if (e.code === 'ENOENT') {
        return null;
      }
      throw e;
    }
  }
  write(str) {
    writeFileSync(this.tempFilename, str);
    renameSync(this.tempFilename, this.filename);
  }
}



export default TextFile;

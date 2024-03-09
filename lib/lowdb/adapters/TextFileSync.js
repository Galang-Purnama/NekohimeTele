import { readFileSync, writeFileSync, renameSync } from 'fs';
import { join, dirname, basename } from 'path';
class TextFileSync {
    constructor(filename) {
        this.filename = filename;
        this.tempFilename = join(dirname(filename), `.${basename(filename)}.tmp`);
    }
    read() {
        let data;
        try {
            data = readFileSync(this.filename, 'utf-8');
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                return null;
            }
            throw e;
        }
        return data;
    }
    write(str) {
        writeFileSync(this.tempFilename, str);
        renameSync(this.tempFilename, this.filename);
    }
}
export default { TextFileSync };

const fs = require('fs');
const path = require('path');

function TextFile(filename) {
  this.filename = filename;
  this.tempFilename = path.join(path.dirname(filename), `.${path.basename(filename)}.tmp`);
}

TextFile.prototype.read = function () {
  try {
    const data = fs.readFileSync(this.filename, 'utf-8');
    return data;
  } catch (e) {
    if (e.code === 'ENOENT') {
      return null;
    }
    throw e;
  }
};

TextFile.prototype.write = function (str) {
  fs.writeFileSync(this.tempFilename, str);
  fs.renameSync(this.tempFilename, this.filename);
};

module.exports = TextFile;

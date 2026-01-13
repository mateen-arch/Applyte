const DataURI = require("datauri");
const path=require("path");
const DataUriParser = require("datauri/parser");
const parser = new DataUriParser();

const getFileUrl = (file) => {
    const extName = path.extname(file.originalname).toString();

    return parser.format(extName,file.buffer).content;
}

module.exports = {getFileUrl}
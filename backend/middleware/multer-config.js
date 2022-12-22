/* Importing multer */

const multer = require('multer');

/* Setting up the MIME types for the images */

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

/* Setting up the destination and naming convention of the files uploaded */

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        console.log('name ', name);
        const nameCut = name.split('.');
        console.log('nameCut ', nameCut);
        
        const extension = MIME_TYPES[file.mimetype];
        console.log('extension ', extension);
        callback(null, nameCut[0] + Date.now() + '.' + extension);
    }
});

/* Exporting the multer middleware */

module.exports = multer({ storage }).single('image');
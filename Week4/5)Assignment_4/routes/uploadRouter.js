const express = require('express');
const authenticate = require('../authenticate');
const bodyParser = require('body-parser');
const multer = require('multer');
//applying CORS config
const cors = require('./cors');
//configuration of multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
const imageFilter = (req,file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error("You can only upload image files"), false);
    }
    cb(null,true);
}
//passing configurations to multer module
const upload = multer({ storage: storage, fileFilter: imageFilter});
const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());
uploadRouter.route('/')
.options(cors.corsWithOptions,(req,res) => {res.sendStatus(200);})
.get(cors.cors,authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end('GET operation is not supported on the url /imageUpload');
})
.put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on the url /imageUpload');
})
.delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end('DELETE operation is not supported on the url /imageUpload');
})
//here 'imageFile' is the key to upload the image
.post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
module.exports = uploadRouter;
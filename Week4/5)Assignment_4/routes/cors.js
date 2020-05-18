const cors = require('cors');
const express = require('express');

var whiteList = ['https://localhost:3443', 'http://localhost:3000'];

var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    if(whiteList.indexOf(req.header('Origin')) !== -1){
        corsOptions = { origin: true};
    }
    else{
        corsOptions = { origin: false};
    }
    callback(null, corsOptions);
}

exports.cors = cors();//calling the "cors" function without passing any parameters means to allow all the cross origin resources with a wildchar "*"
exports.corsWithOptions = cors(corsOptionsDelegate);
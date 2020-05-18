const express = require('express')
const bodyParser = require('body-parser')
const dishRouter = express.Router()
dishRouter.use(bodyParser.json())
//dishes
dishRouter.route('/')
.all((req,res,next) => {
    req.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})
.get((req,res,next) => {
    res.end('Will send all dishes to you!')
})
.post((req,res,next) => {
    res.end('Will add the dish : '+ req.body.name
     + ' with details '+ req.body.description)

})
.put((req,res,next) => {
    res.statusCode = 403 //request not supported
    res.end('PUT operation not supported for url : /dishes')
})
.delete((req,res,next) => {
    res.end('Deleting all the dishes!')
})

dishRouter.route('/:dishId')
.get((req,res,next) => {
    console.log(req.path)
    res.end('Will send the details of the dish '+ req.params.dishId)
})
.post((req,res,next) => {
    res.statusCode = 403 //request not supported
    res.end('POST operation is not supported for the dish '+req.params.dishId)
})
.put((req,res,next) => {
    res.write('Will update the dish '+req.params.dishId+"\n")
    res.end("Will update the dish: "+ req.body.name + " with details "+ req.body.description)
})
.delete((req,res,next) => {
    res.end("Will delete the dish : "+req.params.dishId)
})
module.exports = dishRouter

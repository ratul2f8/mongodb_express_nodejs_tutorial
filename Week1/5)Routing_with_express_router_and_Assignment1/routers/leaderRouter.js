const express = require('express')
const bodyParser = require('body-parser')
const leaderRouter = express.Router()
leaderRouter.use(bodyParser.json())
//leaders
leaderRouter.route('/')
.all((req,res,next) => {
    req.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})
.get((req,res,next) => {
    res.end('Will send all leaders to you!')
})
.post((req,res,next) => {
    res.end('Will add the leader : '+ req.body.name
     + ' with details '+ req.body.description)

})
.put((req,res,next) => {
    res.statusCode = 403 //request not supported
    res.end('PUT operation not supported for url : /leaders')
})
.delete((req,res,next) => {
    res.end('Deleting all the leaders!')
})
exports.routeLeaders = leaderRouter
//leaders/:leaderId
const leaderIdRouter  = express.Router()
leaderIdRouter.use(bodyParser.json())
leaderIdRouter.route('/leaders/:leaderId')
.get((req,res,next) => {
    console.log(req.path)
    res.end('Will send the details of the leader '+ req.params.leaderId)
})
.post((req,res,next) => {
    res.statusCode = 403 //request not supported
    res.end('POST operation is not supported for the leader '+req.params.leaderId)
})
.put((req,res,next) => {
    res.write('Will update the leader '+req.params.dishId+"\n")
    res.end("Will update the leader: "+ req.body.name + " with details "+ req.body.description)
})
.delete((req,res,next) => {
    res.end("Will delete the leader : "+req.params.dishId)
})
exports.routeLeadersWithId = leaderIdRouter
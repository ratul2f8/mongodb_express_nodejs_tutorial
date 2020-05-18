const express = require('express')
const bodyParser = require('body-parser')
const promoRouter = express.Router()
promoRouter.use(bodyParser.json())
//promos
promoRouter.route('/')
.all((req,res,next) => {
    req.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})
.get((req,res,next) => {
    res.end('Will send all promos to you!')
})
.post((req,res,next) => {
    res.end('Will add the promo : '+ req.body.name
     + ' with details '+ req.body.description)

})
.put((req,res,next) => {
    res.statusCode = 403 //request not supported
    res.end('PUT operation not supported for url : /promotions')
})
.delete((req,res,next) => {
    res.end('Deleting all the promotions!')
})
exports.routePromos = promoRouter
//promotions/:promoId
const promosWithIdRouter  = express.Router()
promosWithIdRouter.use(bodyParser.json())
promosWithIdRouter.route('/promotions/:promoId')
.get((req,res,next) => {
    console.log(req.path)
    res.end('Will send the details of the promo '+ req.params.promoId)
})
.post((req,res,next) => {
    res.statusCode = 403 //request not supported
    res.end('POST operation is not supported for the promo '+req.params.promoId)
})
.put((req,res,next) => {
    res.write('Will update the promo '+req.params.promoId+"\n")
    res.end("Will update the promo: "+ req.body.name + " with details "+ req.body.description)
})
.delete((req,res,next) => {
    res.end("Will delete the promo : "+req.params.promoId)
})
exports.routePromosWithPromoId = promosWithIdRouter

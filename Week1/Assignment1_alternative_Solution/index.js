//PRESET
const express = require('express')
const http = require('http')
const morgan = require('morgan')
const dishRouter = require('./routers/dishRouter')
const promoRouter = require('./routers/promoRouter')
const leaderRouter = require('./routers/leaderRouter')
const host = "localhost"
const port = 3000
const app = express()
app.use(morgan('dev'))
//dishRouter
app.use('/dishes', dishRouter)
//promotionsRouter
app.use('/promotions', promoRouter)
//leaderRouter
app.use('/leaders',leaderRouter)
//DEFAULT
app.use(express.static(__dirname + '/public'))
app.use((req, res, next) => {
    console.log(req.headers)
    res.statusCode = 200
    res.setHeader('Content-Type','text/html')
    res.end('<html><body><h1>This is express server</h1></body></html>')
})
const server = http.createServer(app)
server.listen(port,host,() => {
    console.log(`Server started at: http://${host}:${port}/`)
})
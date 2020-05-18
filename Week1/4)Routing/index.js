const express = require('express')
const http = require('http')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const host = "localhost"
const port = 3000

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())

app.all('/dishes',(req,res,next) => {
    req.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})
app.get('/dishes',(req,res,next) => {
    res.end('Will send all dishes to you!')
})
app.post('/dishes',(req,res,next) => {
    res.end('Will add the dish : '+ req.body.name
     + ' with details '+ req.body.description)

})
app.put('/dishes', (req,res,next) => {
    res.statusCode = 403 //request not supported
    res.end('PUT operation not supported for url : /dishes')
})
app.delete('/dishes',(req,res,next) => {
    res.end('Deleting all the dishes!')
})



app.get('/dishes/:dishId',(req,res,next) => {
    res.end('Will send the details of the dish '+ req.params.dishId)
})
app.post('/dishes/:dishId',(req,res,next) => {
    res.statusCode = 403 //request not supported
    res.end('POST operatuon is not supported for the dish '+req.params.dishId)
})
app.put('/dishes/:dishId', (req,res,next) => {
    res.write('Will update the dish '+req.params.dishId+"\n")
    res.end("Will update the dish: "+ req.body.name + " with details "+ req.body.description)
})
app.delete('/dishes/:dishId',(req,res,next) => {
    res.end("Will delete the dish : "+req.params.dishId)
})


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
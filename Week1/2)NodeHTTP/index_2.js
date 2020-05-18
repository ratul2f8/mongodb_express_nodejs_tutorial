//part2
const http = require('http')
const fs = require('fs')
const path = require('path')

const host = "localhost"
const port = 3000

const server = http.createServer((req,res) => {
    console.log(`Generating output for Request-url: ${req.url}; by-method: ${req.method}`)
    if(req.method == 'GET'){
        var fileURL
        (req.url == "/") ? fileURL = "/index.html" : fileURL = req.url
        var filePath = path.resolve('./public'+fileURL)
        const fileExtension = path.extname(filePath)
        if( fileExtension == ".html"){
            fs.exists(filePath, (exists) => {
                if( exists ){
                    res.statusCode = 200
                    res.setHeader('Content-Type','text/html')
                    fs.createReadStream(filePath).pipe(res)
                    return
                }
                res.statusCode = 404
                res.setHeader('Content-Type', 'text/html')
                res.end('<html><body><h1>Error 404: File not exists</h1></body></html>')
            })
        }
        else{
            res.statusCode = 404
            res.setHeader('Content-Type', 'text/html')
            res.end('<html><body><h1>Error 404: It is not a HTML file</h1></body></html>')
        }
    }
    else{
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/html')
        res.end('<html><body><h1>Error 404: Request is not supported</h1></body></html>')
    }
})

server.listen(port,host,() => {
    console.log(`Server started at: http://${host}:${port}/`)
})
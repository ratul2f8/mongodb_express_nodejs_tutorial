//part1
const http = require('http')
const host  = 'localhost'
const port  = 3000
const server = http.createServer((req, res) => {
    console.log(req.headers)
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end(
       ' <html><body><h1>This is the response</h1></body></html>'
    )
    console.log(res)
})
server.listen(port,host, () => {
    console.log(`Server started at ${host}:${port}`)
})
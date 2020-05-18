var rect = require("./rectangle")

function getValues(a,b){
    rect(a,b,(err, values)=>{
        err 
        ?
        console.log(err.message) 
        : 
        console.log(`Perimeter: ${values.perimeter()} Area: ${values.area()}`)

        console.log("After timer")
    })
    
}
getValues(4,5)

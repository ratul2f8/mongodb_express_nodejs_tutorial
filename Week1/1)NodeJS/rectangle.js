module.exports = (a,b,callback) => {
    if((a <= 0) || (b <= 0)){
        setTimeout(() => {
            callback(
                new Error("ERROR: dimension should not be zero"),
                null
            )
        },2000
        )
    }
    else{
        setTimeout(
            () => {
                callback(
                    null,
                    {
                        area: () => (a*b),
                        perimeter: () => (2*(a+b))
                    }
                )
            },2000
        )
    }
}
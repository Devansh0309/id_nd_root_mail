const emailRouter = require("./Email")
const uniqueIdsRouter = require("./UniqueIds")
const centreRouter = require("./centres")

module.exports = (app)=>{
    app.use('/email',emailRouter)
    app.use('/uid',uniqueIdsRouter)
    app.use('/centres', centreRouter)
}
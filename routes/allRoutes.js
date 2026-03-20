const emailRouter = require("./Email")
const uniqueIdsRouter = require("./UniqueIds")

module.exports = (app)=>{
    app.use('/email',emailRouter)
    app.use('/uid',uniqueIdsRouter)
}
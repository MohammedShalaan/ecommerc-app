import Express from "express";
import { config } from "dotenv";
import 'dotenv/config'

import connectionDb from "./db/db.connection.js";
import * as routers from "./src/moduels/index.routes.js"


import { errorHAndling } from "./src/middelWare/globalErrorHandling.js"


//connect to database 
connectionDb()


//connect to env 
config()

const app = Express()
app.use(Express.json()) // to use req.json in any router 

//routers
app.use('/user', routers.userRouer)
app.use('/auth', routers.authRouer)
app.use('/category', routers.categoryRouer)
app.use('/subcatagory', routers.subcatagoryRouer)
app.use('/brand', routers.brandRouter)



// if page not found 
app.use('/*', (req, res, next) => {
    return next(new Error("this page not found", { cause: 404 }))
})


app.use(errorHAndling)


//  run the server 
app.listen(process.env.serverPort, () => {
    console.log(` the server work AT PORT ${process.env.serverPort}`)
})
const {config}=require("dotenv")
const express =require("express");

const {log, middleware, mongo}=require("./shared");

const {authRoutes, postRoutes}=require("./routes")


const app=express();
config();

(async ()=>{
    try{
        await mongo.connect();

        app.use(express.json());

        app.use(middleware.maintenance)
        app.use(middleware.logging)

        //authRoutes
        app.use("/auth", authRoutes);

            
        //auth middleware
        app.use(middleware.validateToken)

    //all other routes
    app.use("/posts", postRoutes)


        app.listen(process.env.PORT, () => {
            log(`server listening at port ${process.env.PORT}`);
        })
    }catch(err){
        log(`error while creating server -${err.message}`);
        process.exit();
    }
   
})()







const express=require("express")
const mongoose = require("mongoose")
const app=express()
app.use(express.json())

const controler=require("./controler/usercontroler")

const connect=()=>{
    return mongoose.connect("mongodb://localhost:27017/web14")
}


app.use("/users",controler)
app.listen(8080,async function(){

    try{
            await connect()
            console.log("lisnning port 8080")

    }catch(err){
        console.log(err.message)
    }
})

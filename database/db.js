const mongoose = require("mongoose")

const conectToDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("mongo db conected successfully")
    } catch (error) {
        console.log("mongo conection fail")
        process.exit()
    }
}

module.exports= conectToDB
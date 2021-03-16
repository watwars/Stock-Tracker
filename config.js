require("dotenv").config()
const mongoose = require("mongoose")

const onlineMongoUrl = `mongodb+srv://watwars:${process.env.MONGO_PW}@cluster0.px6kj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const localMongoUrl = 'mongodb://localhost/wishlist'


const connectDB = async() => {
    try{
        const conn = await mongoose.connect(onlineMongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        console.log(`MongoDB Connected`);
    }catch(err){
        console.log(err);
    }
}

module.exports = connectDB;
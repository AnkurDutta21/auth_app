require('dotenv').config()
const mongoose = require('mongoose')
const uri = process.env.MONGODB_URI


const mongoDbConnection = async()=>{
    mongoose.connect(uri).then(()=>{
        console.log("db connected....")
    }).catch((err)=>{
        console.log(err)
    })
}

module.exports = {mongoDbConnection}
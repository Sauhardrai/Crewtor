import mongoose, { Schema } from "mongoose";


const adminSchema = new mongoose.Schema({
    name:{
        type:String,  
    },
    email: String,
    password: String
})


export default mongoose.model('Admin' , adminSchema);
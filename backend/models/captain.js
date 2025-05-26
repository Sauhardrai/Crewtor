import mongoose, { Schema } from "mongoose";

const captainSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role:{
        type:String,
        default: 'captain'
    },
    phone: {
        type: Number,
        required: true,
        unique:true
    },
    crewmate:[{
        type: Schema.Types.ObjectId,
        ref: 'user.js'
    }]
});


export default mongoose.model('captain', captainSchema);
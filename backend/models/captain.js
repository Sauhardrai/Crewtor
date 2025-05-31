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
    },
    password:{
        type:String,
        required: true
    },
    studentcount:{
        type:Number,
        default:0
    },
    crewmate:[{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],

    session:{
        type: {
            title:String,
            date: String,
            time: String,
            link: String,
        },

    }
});


export default mongoose.model('captain', captainSchema);
import mongoose, { Schema } from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique: true,
        trim: true
    },
    address:{
        type:String,
        
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type:String,
        default: "user"
    },
    phone:{
        type: Number,
        
    },

    joinAt:Date,

    isCaptain:{
        type: Boolean,
        default : false
    },
    
    captain:{
        type: Schema.Types.ObjectId,
        ref: "captain"
    }
});

export default mongoose.model('user',userSchema);
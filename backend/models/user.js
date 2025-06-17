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
    },
    isplan:{
        type: Boolean,
        default: false
    },
    plan:{
        type: String,
    },
    planexp:{
        type:Date
    },
    planstart:{
        type: Date
    }
});

export default mongoose.model('user',userSchema);
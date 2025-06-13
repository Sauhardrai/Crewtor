import captain from '../models/captain.js';
import bcrypt from 'bcryptjs';
import User from '../models/user.js'
import Captain from '../models/captain.js'







export const search= async (req ,res) =>{
    try{
        const user = await User.find({email:req.body.email}).populate('captain');
        res.status(200).json({user})
    } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
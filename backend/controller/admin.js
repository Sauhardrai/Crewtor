import captain from '../models/captain.js';
import bcrypt from 'bcryptjs';
import User from '../models/user.js'
import Captain from '../models/captain.js'







export const userUpdate= async (req ,res) =>{
    try{
        const {captain_id , user_email} = req.body;
        const user = await User.find({email:user_email});
        const newCaptain = await Captain.findById(captain_id);
        const oldCaptain = await Captain.findById(user[0].captain);    
        
        await User.findByIdAndUpdate(user[0]._id,{$set:{captain: newCaptain._id}}) 
        newCaptain.studentcount+=1;
        newCaptain.crewmate.push(user[0]._id);
        oldCaptain.studentcount -=1;
        oldCaptain.crewmate.pull(user[0]._id);
        await newCaptain.save();
        await oldCaptain.save();

        res.status(200).json({message: 'Success full'})

    } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteUser = async (req,res) => {
  try{
    const {email} = req.body;
    const user = await User.find({email});
    const cap = await Captain.findById(user[0].captain);
    cap.studentcount-=1;
    cap.crewmate.pull(user[0]._id);
    await cap.save();
    await User.findByIdAndDelete(user[0]._id);
    res.status(200).json({message: 'Done'})
  
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }


};
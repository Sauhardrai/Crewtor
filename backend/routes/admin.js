import express from 'express'
import User from '../models/user.js'
import Captain from '../models/captain.js'


const router = express.Router()

router.get("/dashboard", async (req, res) => {
  try{
    const userCount = await User.countDocuments();
  const captainCount = await Captain.countDocuments();
  const captain = await Captain.find({});
  const user = await User.find({}).populate('captain');
  res.status(200).json({userCount, captainCount, captain , user})
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
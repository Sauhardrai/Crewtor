import captain from '../models/captain.js';
import bcrypt from 'bcryptjs';
import User from '../models/user.js'
import Captain from '../models/captain.js'







export const userUpdate = async (req, res) => {
  try {
    const { captain_id, user_email } = req.body;
    const user = await User.find({ email: user_email });
    const newCaptain = await Captain.findById(captain_id);
    console.log(user[0].isCaptain)
    if (user[0].isCaptain) {
      const oldCaptain = await Captain.findById(user[0].captain);
      await User.findByIdAndUpdate(user[0]._id, { $set: { captain: newCaptain._id } })
      newCaptain.studentcount += 1;
      newCaptain.crewmate.push(user[0]._id);
      oldCaptain.studentcount -= 1;
      oldCaptain.crewmate.pull(user[0]._id);
      await newCaptain.save();
      await oldCaptain.save();

      res.status(200).json({ message: 'Success full' })
    } else {
      res.status(500).json({ message: 'captain Change not allowed for this user' })
    }

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.find({ email });
    if (user[0].isCaptain) {
      const cap = await Captain.findById(user[0].captain);
      cap.studentcount -= 1;
      cap.crewmate.pull(user[0]._id);
      await cap.save();
      await User.findByIdAndDelete(user[0]._id);
      res.status(200).json({ message: 'Done' })
    } else {
      await User.findByIdAndDelete(user[0]._id)
      res.status(200).json({ message: 'Done' })
    }

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }


};


export const assignCap = async (req, res) => {
  const { id, capId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, { $set: { captain: `${capId}` , isCaptain: true} });
    const Cap = await Captain.findById(capId);
    Cap.crewmate.push(id);
    Cap.studentcount += 1;
    await Cap.save();

    res.status(200).json({ message: 'done' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export const removeCap = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id)

    if (user.isCaptain) {
      const capid = user.captain
      const cap = await Captain.findById(capid);
      cap.crewmate.pull(id);
      cap.studentcount -= 1;
      await cap.save();
      await User.findByIdAndUpdate(id, {
        $unset: { captain: "" },
        $set: { isCaptain: false }
      });
      res.status(200).json({ message: 'Done' });
    } else {
      res.status(500).json({ message: "Assign Captain First" })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
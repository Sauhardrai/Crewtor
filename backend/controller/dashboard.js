const now = new Date();
import captain from '../models/captain.js';
import bcrypt from 'bcryptjs';
import User from '../models/user.js'


export const capdash = async (req, res) => {
  const user = req.user

  try {
    const data = await captain.findById(user.id).populate('crewmate')
    res.status(200).json({ data })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }

};



export const sessionCreate = async (req, res) => {
  const user = req.user
  const { data } = req.body

  try {
    const existingCaptain = await captain.findById(user.id);

    if (!existingCaptain) {
      return res.status(404).json({ message: 'Captain not found' });
    }

    const previousSession = existingCaptain.session;

    // Check if previous session exists and its dateTime is still in the future
    if (previousSession?.date && previousSession?.time) {
      const lastSessionTime = new Date(`${previousSession.date}T${previousSession.time}`);

      if (lastSessionTime > now) {
        return res.status(400).json({ message: 'Previous session has not ended yet. Cannot create a new one.' });
      }
    }
    await captain.findByIdAndUpdate(user.id, {
      session: {
        date: data.date,
        title: data.title,
        time: data.time,
        link: data.zoom
      }
    });
    res.status(200).json({ message: 'Session Created' });

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



export const profileUpdate = async (req, res) => {
  const user = req.user
  const { data } = req.body
  try {
    let cap = await captain.findById(user.id)
    const isMatch = await bcrypt.compare(data.curntpassword, cap.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (data.newpassword) {
      const salt = await bcrypt.genSalt(10);        // 10 rounds of salting
      const hashedPassword = await bcrypt.hash(data.newpassword, salt);
      await captain.findByIdAndUpdate(user.id, {
        $set: {
          name: data.name,
          email: data.email,
          password: hashedPassword
        }
      })
      res.status(200).json({ message: 'Updated' })
    } else {
      await captain.findByIdAndUpdate(user.id, {
        $set: {
          name: data.name,
          email: data.email,
        }
      })
      res.status(200).json({ message: 'Updated' })
    }

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}


export const crewDash = async (req, res) => {
  const user = req.user

  try {
    const data = await User.findById(user.id)
    res.status(200).json({ data })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }

};


export const crewProfileUpdate = async (req, res) => {
  const user = req.user
  const { data } = req.body
  try {
    let cap = await User.findById(user.id)
    const isMatch = await bcrypt.compare(data.curntpassword, cap.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (data.newpassword) {
      const salt = await bcrypt.genSalt(10);        // 10 rounds of salting
      const hashedPassword = await bcrypt.hash(data.newpassword, salt);
      await User.findByIdAndUpdate(user.id, {
        $set: {
          name: data.name,
          email: data.email,
          password: hashedPassword
        }
      })
      res.status(200).json({ message: 'Updated' })
    } else {
      await User.findByIdAndUpdate(user.id, {
        $set: {
          name: data.name,
          email: data.email,
        }
      })
      res.status(200).json({ message: 'Updated' })
    }

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}



export const fetchCaptain = async (req,res) =>{
    const {id }= req.params;
  
    try {
      const data = await captain.findById(id).populate('crewmate');
      res.status(200).json({data})
    } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};




export const editSession = async (req,res) =>{
    const user = req.user;
    const {editdata} = req.body
    
    try{
        await captain.findByIdAndUpdate(user.id,{$set :{
          session:{
            title: editdata.title,
            date: editdata.date,
            time:editdata.time,
            link:editdata.zoom
          }
        }})
        
        res.status(200).json({message: 'Session Edied SuccessFully'})
    }catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export const deleteSession = async (req,res) =>{
  const user = req.user ;

  try {
    await captain.findByIdAndUpdate(user.id,{ $unset: { session: "" } });
    res.status(200).json({message: "Session Deleted"});
  }catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
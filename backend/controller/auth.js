import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Captain from '../models/captain.js';
import User from '../models/user.js';
import nodemailer from 'nodemailer';
import Otp from '../models/otp.js';
import Admin from '../models/admin.js'





export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let foundUser = await Captain.findOne({ email });
    let role = 'captain';
    
    if (!foundUser) {
      foundUser = await User.findOne({ email });
      role = 'user';
    }
    if (!foundUser){
      foundUser = await Admin.findOne({ email});
      role= 'admin';
    }
    if (!foundUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: foundUser._id,
        email: foundUser.email,
        role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '15d' }
    );

    res.status(200).json({ token, role, message: `Logged in as ${role}` });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



export const sendOtp = async (req, res) => {
  let { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const salt = await bcrypt.genSalt(10);        // 10 rounds of salting
    const hashedOtp = await bcrypt.hash(otp, salt);

    const otpUser = new Otp({
      email,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000
    })

    await otpUser.save();
    await sendEmail(email, otp)
    res.status(200).json({ success: true, message: 'OTP sent to your email.' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

async function sendEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // must be false for port 587
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    }
  });

  await transporter.sendMail({
    from: 'Crewtor Team <crewtorofficial@gmail.com>',
    to: email,
    subject: 'Your Crewtor Verification Code 🚀',
    text: `Hi Student,

Thank you for signing up on Crewtor – where top minds guide future stars!

Your One-Time Password (OTP) is:

👉 ${otp}

Please enter this code on the website to verify your email. This code will expire in 5 minutes.

If you did not request this code, please ignore this email or contact our support team.

Let’s get learning, growing, and building – together! 💡

– The Crewtor Team  
 
`
  })
};


export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const record = await Otp.findOne({ email })
    // console.log(record)
    const ismatch = await bcrypt.compare(otp, record.otp);

    if (!record || !ismatch || record.expiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    await Otp.deleteMany({ email });

    res.json({ success: true, message: 'OTP verified successfully.' });

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export const signup = async (req, res) => {
  const { data } = req.body;
  // console.log(data)
  const salt = await bcrypt.genSalt(10);        // 10 rounds of salting
  const hashedPassword = await bcrypt.hash(data.password, salt);
  try {
    // console.log(data)
    let userFound = await User.findOne({ email: data.email });
    

    if (!userFound) {
      const newUser = new User({
        name: data.name,
        email: data.email,
        address: data.address,
        phone: data.mobilenumber,
        password: hashedPassword,
        joinAt : Date.now()
      })
      await newUser.save();

      const foundUser = await User.findOne({ email: data.email })


      const token = jwt.sign(
        {
          id: foundUser._id,
          email: foundUser.email,
          role: foundUser.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '15d' }
      );

      res.status(200).json({ token });
    } else {
      res.status(500).json({ message: 'User Already Exits please Login' })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// 


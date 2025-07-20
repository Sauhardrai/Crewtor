const now = new Date();
import dotenv from 'dotenv';
dotenv.config();
import captain from '../models/captain.js';
import bcrypt from 'bcryptjs';
import User from '../models/user.js'
import nodemailer from 'nodemailer';

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
    const existingCaptain = await captain.findById(user.id).populate('crewmate');

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
    existingCaptain.crewmate.forEach(async (u) => {
     await sendEmail(u.email, u.name, data.date, data.zoom, data.title, data.time, existingCaptain.name)
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



export const fetchCaptain = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await captain.findById(id).populate('crewmate');
    res.status(200).json({ data })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};




export const editSession = async (req, res) => {
  const user = req.user;
  const { editdata } = req.body

  try {
    await captain.findByIdAndUpdate(user.id, {
      $set: {
        session: {
          title: editdata.title,
          date: editdata.date,
          time: editdata.time,
          link: editdata.zoom
        }
      }
    })

    res.status(200).json({ message: 'Session Edied SuccessFully' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export const deleteSession = async (req, res) => {
  const user = req.user;

  try {
    await captain.findByIdAndUpdate(user.id, { $unset: { session: "" } });
    res.status(200).json({ message: "Session Deleted" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



export const oneOne = async (req, res) => {
  const { data } = req.body;
  try {
    const user = await User.find({ email: data.email });
    await User.findByIdAndUpdate(user[0]._id, {
      $set: {
        oneOne: {
          link: data.zoom,
          date: data.date,
          time: data.time,
        }
      }
    })
    res.status(200).json({ message: 'Created' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


async function sendEmail(email, user, sessionDate, sessLink, sessName, sessTime, userCap) {
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
    subject: '📘 Crewtor Session – Don’t Miss It!',
    html: `<html>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 0; margin: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #ddd;">
      <tr>
        <td style="padding: 20px 30px;">
          <h2 style="color: #333333; margin-top: 0;">📘 Crewtor Session – Don’t Miss It!</h2>
          <p style="font-size: 16px; color: #444;">Dear ${user},</p>
          <p style="font-size: 16px; color: #444;">Your next session with <strong> Your Captain</strong> is scheduled for <strong>${sessionDate}</strong>. We’ll be diving into strategies to help you create a smart and balanced study routine for JEE preparation.</p>
          
          <h3 style="color: #222;">📅 Session Details:</h3>
          <ul style="font-size: 16px; color: #444; line-height: 1.6;">
            <li><strong>Topic:</strong> ${sessName}</li>
            <li><strong>Date:</strong>${sessionDate}</li>
            <li><strong>Time:</strong>${sessTime}</li>
            <li><strong>Captain:</strong>${userCap}</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${sessLink}" target="_blank" style="background-color: #4CAF50; color: white; padding: 14px 24px; text-decoration: none; font-size: 16px; border-radius: 6px; display: inline-block;">
              👉 Join Now
            </a>
          </div>

          <p style="font-size: 16px; color: #444;">
            Please make sure to join on time with a notebook and clear mind. Your consistency defines your success!
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

          <p style="font-size: 16px; color: #444;">
            Best regards,<br>
            <strong>Team Crewtor</strong><br>
            🌐 <a href="https://sauhardrai.github.io/Crewtor/" style="color: #0066cc;">www.crewtor.in</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
 
`
  })
};
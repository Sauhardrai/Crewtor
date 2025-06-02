import { google } from 'googleapis';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

import Captain from './models/captain.js';
import bcrypt from 'bcryptjs'; // ES Module style
dotenv.config();

async function main() {
    let newUsersCount = 0;
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

    const sheets = google.sheets({ version: 'v4', auth });
    const sheetId = '1ubShSiYV5Ke789RE77bmgpbshtBySdeEF6wS966ejLA';

    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Sheet1!A2:D',
    });
    console.log('connected to spread sheet')
    const rows = res.data.values;
    for (let row of rows) {
        const [name, email, phone, status] = row;
        if (status.toLowerCase() === 'approved') {
            const exists = await Captain.findOne({ email });
            if (!exists) {
                const password = `${name.slice(0, 4)}@${phone}`
                const salt = await bcrypt.genSalt(10);        // 10 rounds of salting
                const hashedPassword = await bcrypt.hash(password, salt);
                const newUser = await Captain.create({ name, email, phone, password: hashedPassword });
                await sendEmail(email, name, phone);
                console.log(`✅ Created and emailed: ${email}`);
                newUsersCount++;
            } else {
                console.log(` ${email} pahle se hi captain hai`);
                continue;
            }
        }
    }

    if (newUsersCount === 0) {
        console.log('😴 No new approved captains found. Everything is up-to-date.');
        return;
    } else {
        console.log(`🎉 ${newUsersCount} new captains added and emailed.`);
        return;
    }
}


async function sendEmail(to, name, phone) {

    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false, // must be false for port 587
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: '"Crewtor Team" <crewtorofficial@gmail.com>',
        to,
        subject: '🎉 Welcome Aboard Captain! Your Crewtor Journey Begins 🚀',
        text: `Hi ${name},

We're thrilled to welcome you to Crewtor as a Captain! 🎉  
Your dedication and leadership potential have earned you this elite spot.

Here are your login details:

📧 Email: ${to}  
🔐 Temporary Password: ${name.slice(0,4)}@${phone}

Login here: https://sauhardrai.github.io/Crewtor/html/login.html  
(We recommend changing your password after your first login.)

As a Captain, you'll have access to:
- Tools to manage and guide your Crew
- Communication channels to mentor effectively

Feel free to reach out if you have any questions. We're always here to support you.

Welcome to the Crewtor mission — shaping future leaders together! 🌟

Warm regards,  
Team Crewtor `,
    });
    
}

main();
